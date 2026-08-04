import { create } from "zustand";
import { ChatUser, ChatMessage, ChatRecipient } from "../types/chat";
import { chatService } from "../services/chat";
import { getToken } from "../lib/auth";

interface ChatState {
  users: ChatUser[];
  activeRecipient: ChatRecipient;
  messages: ChatMessage[];
  unreadCounts: Record<string, number>;
  loading: boolean;
  connected: boolean;
  ws: WebSocket | null;

  fetchUsers: () => Promise<void>;
  fetchMessages: (recipientId: string) => Promise<void>;
  setActiveRecipient: (recipient: ChatRecipient) => void;
  sendMessage: (content: string) => void;
  connectWS: () => void;
  disconnectWS: () => void;
}

export const DEFAULT_RECIPIENT: ChatRecipient = {
  id: "global",
  name: "General Channel",
  is_global: true,
};

export const useChatStore = create<ChatState>((set, get) => ({
  users: [],
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
    const wsScheme = apiUrl.startsWith("https") ? "wss" : "ws";
    const host = apiUrl.replace(/^https?:\/\//, "");
    const wsUrl = `${wsScheme}://${host}/chat/ws?token=${token}`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        set({ connected: true });
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          
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
          }
        } catch (err) {
          console.error("Error parsing WebSocket message", err);
        }
      };

      ws.onclose = () => {
        set({ connected: false, ws: null });
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
