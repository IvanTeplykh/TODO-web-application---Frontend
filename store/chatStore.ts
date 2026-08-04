import { create } from "zustand";
import { ChatUser, ChatMessage, ChatRecipient, ChatRequest } from "../types/chat";
import { chatService } from "../services/chat";
import { getToken } from "../lib/auth";

interface ChatState {
  users: ChatUser[];
  chatRequests: ChatRequest[];
  activeRecipient: ChatRecipient;
  messages: ChatMessage[];
  unreadCounts: Record<string, number>;
  loading: boolean;
  connected: boolean;
  ws: WebSocket | null;

  fetchUsers: () => Promise<void>;
  fetchRequests: () => Promise<void>;
  fetchMessages: (recipientId: string) => Promise<void>;
  sendChatRequest: (recipientId: string) => Promise<void>;
  respondChatRequest: (requestId: string, action: "accept" | "decline") => Promise<void>;
  setActiveRecipient: (recipient: ChatRecipient) => void;
  sendMessage: (content: string) => void;
  connectWS: () => void;
  disconnectWS: () => void;
}

export const DEFAULT_RECIPIENT: ChatRecipient = {
  id: "global",
  name: "General Channel",
  is_global: true,
  connection_status: "accepted",
};

export const useChatStore = create<ChatState>((set, get) => ({
  users: [],
  chatRequests: [],
  activeRecipient: DEFAULT_RECIPIENT,
  messages: [],
  unreadCounts: {},
  loading: false,
  connected: false,
  ws: null,

  fetchUsers: async () => {
    try {
      const users = await chatService.getUsers();
      set({ users });
    } catch (error) {
      console.error("Failed to fetch chat users", error);
    }
  },

  fetchRequests: async () => {
    try {
      const requests = await chatService.getRequests();
      set({ chatRequests: requests });
    } catch (error) {
      console.error("Failed to fetch chat requests", error);
    }
  },

  sendChatRequest: async (recipientId: string) => {
    try {
      const newReq = await chatService.sendRequest(recipientId);
      set((state) => ({
        chatRequests: [...state.chatRequests.filter((r) => r.id !== newReq.id), newReq],
      }));
      await get().fetchUsers();
    } catch (error) {
      console.error("Failed to send chat request", error);
      throw error;
    }
  },

  respondChatRequest: async (requestId: string, action: "accept" | "decline") => {
    try {
      const updatedReq = await chatService.respondRequest(requestId, action);
      set((state) => ({
        chatRequests: state.chatRequests.map((r) => (r.id === updatedReq.id ? updatedReq : r)),
      }));
      await get().fetchUsers();
      if (action === "accept" && get().activeRecipient.id === updatedReq.requester_id) {
        get().setActiveRecipient({
          ...get().activeRecipient,
          connection_status: "accepted",
        });
      }
    } catch (error) {
      console.error("Failed to respond to chat request", error);
      throw error;
    }
  },

  fetchMessages: async (recipientId: string) => {
    set({ loading: true });
    try {
      const messages = await chatService.getMessages(recipientId);
      set({ messages, loading: false });
      
      // Clear unread count for this recipient
      set((state) => {
        const nextUnread = { ...state.unreadCounts };
        delete nextUnread[recipientId];
        return { unreadCounts: nextUnread };
      });
    } catch (error) {
      console.error("Failed to fetch chat messages", error);
      set({ loading: false });
    }
  },

  setActiveRecipient: (recipient: ChatRecipient) => {
    set({ activeRecipient: recipient });
    get().fetchMessages(recipient.id);
  },

  sendMessage: (content: string) => {
    const { ws, activeRecipient, connected } = get();
    if (!content.trim()) return;

    if (ws && connected && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          recipient_id: activeRecipient.id,
          content: content.trim(),
        })
      );
    } else {
      console.warn("WebSocket is not connected");
    }
  },

  connectWS: () => {
    const existingWS = get().ws;
    if (existingWS && (existingWS.readyState === WebSocket.OPEN || existingWS.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const token = getToken();
    if (!token) return;

    // Determine WS scheme (ws:// or wss://) based on API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const cleanUrl = apiUrl.replace(/\/+$/, "");
    const wsScheme = cleanUrl.startsWith("https") ? "wss" : "ws";
    const hostAndPath = cleanUrl.replace(/^https?:\/\//, "");
    const wsUrl = `${wsScheme}://${hostAndPath}/chat/ws?token=${token}`;

    try {
      const ws = new WebSocket(wsUrl);
      let pingInterval: NodeJS.Timeout | null = null;

      ws.onopen = () => {
        set({ connected: true });
        
        // Refresh online users, requests & messages on successful WebSocket connection
        get().fetchUsers();
        get().fetchRequests();
        get().fetchMessages(get().activeRecipient.id);

        // Send ping every 20 seconds to prevent Render 55-second idle WebSocket timeout
        pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 20000);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          
          if (payload.type === "pong") {
            return;
          }

          if (payload.type === "new_message") {
            const msg: ChatMessage = payload.message;
            const currentRecipient = get().activeRecipient;

            // Check if message belongs to current active conversation
            const isForActiveConversation =
              (currentRecipient.is_global && msg.recipient_id === "global") ||
              (!currentRecipient.is_global &&
                (msg.sender_id === currentRecipient.id || msg.recipient_id === currentRecipient.id));

            if (isForActiveConversation) {
              set((state) => ({
                messages: [...state.messages, msg],
              }));
            } else {
              // Increment unread count for sender or global
              const key = msg.recipient_id === "global" ? "global" : msg.sender_id;
              set((state) => ({
                unreadCounts: {
                  ...state.unreadCounts,
                  [key]: (state.unreadCounts[key] || 0) + 1,
                },
              }));
            }
          } else if (payload.type === "user_status") {
            const { user_id, is_online } = payload;
            set((state) => ({
              users: state.users.map((u) => (u.id === user_id ? { ...u, is_online } : u)),
            }));
          } else if (payload.type === "chat_request_received" || payload.type === "chat_request_updated") {
            get().fetchRequests();
            get().fetchUsers();
          }
        } catch (err) {
          console.error("Error parsing WebSocket message", err);
        }
      };

      ws.onclose = () => {
        if (pingInterval) clearInterval(pingInterval);
        set({ connected: false, ws: null });

        // Auto-reconnect after 3 seconds if not explicitly disconnected
        setTimeout(() => {
          get().connectWS();
        }, 3000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error", err);
        set({ connected: false });
      };

      set({ ws });
    } catch (err) {
      console.error("Failed to initialize WebSocket connection", err);
    }
  },

  disconnectWS: () => {
    const ws = get().ws;
    if (ws) {
      ws.close();
      set({ ws: null, connected: false });
    }
  },
}));
