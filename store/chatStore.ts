import { create } from "zustand";
import { ChatUser, ChatMessage, ChatRecipient, ChatRequest, Channel, ChannelInvite } from "../types/chat";
import { chatService } from "../services/chat";
import { channelService } from "../services/channel";
import { getToken } from "../lib/auth";
import { useAuthStore } from "./authStore";

interface ChatState {
  users: ChatUser[];
  chatRequests: ChatRequest[];
  channels: Channel[];
  channelInvites: ChannelInvite[];
  activeRecipient: ChatRecipient;
  messages: ChatMessage[];
  unreadCounts: Record<string, number>;
  loading: boolean;
  connected: boolean;
  ws: WebSocket | null;

  fetchUsers: () => Promise<void>;
  fetchRequests: () => Promise<void>;
  fetchChannels: () => Promise<void>;
  fetchChannelInvites: () => Promise<void>;
  respondChannelInvite: (inviteId: string, action: "accept" | "decline") => Promise<void>;
  createChannel: (data: { name: string; description?: string; avatar_url?: string }) => Promise<Channel>;
  updateChannel: (channelId: string, data: { name?: string; description?: string; avatar_url?: string }) => Promise<Channel>;
  deleteChannel: (channelId: string) => Promise<void>;
  fetchMessages: (recipientId: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  sendChatRequest: (recipientId: string) => Promise<void>;
  respondChatRequest: (requestId: string, action: "accept" | "decline") => Promise<void>;
  setActiveRecipient: (recipient: ChatRecipient) => void;
  sendMessage: (content: string) => Promise<void>;
  connectWS: () => void;
  disconnectWS: () => void;
}

export const DEFAULT_RECIPIENT: ChatRecipient = {
  id: "global",
  name: "Public Channel",
  is_global: true,
  connection_status: "accepted",
};

export const useChatStore = create<ChatState>((set, get) => ({
  users: [],
  chatRequests: [],
  channels: [],
  channelInvites: [],
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

  fetchChannels: async () => {
    try {
      const channels = await channelService.getMyChannels();
      set({ channels });
    } catch (error) {
      console.error("Failed to fetch channels", error);
    }
  },

  fetchChannelInvites: async () => {
    try {
      const channelInvites = await channelService.getPendingInvites();
      set({ channelInvites });
    } catch (error) {
      console.error("Failed to fetch channel invites", error);
    }
  },

  respondChannelInvite: async (inviteId: string, action: "accept" | "decline") => {
    try {
      await channelService.respondToInvite(inviteId, action);
      set((state) => ({
        channelInvites: state.channelInvites.filter((inv) => inv.id !== inviteId),
      }));
      // Refresh channels after accepting
      if (action === "accept") {
        const channels = await channelService.getMyChannels();
        set({ channels });
      }
    } catch (error) {
      console.error("Failed to respond to channel invite", error);
      throw error;
    }
  },

  createChannel: async (data) => {
    try {
      const newChannel = await channelService.createChannel(data);
      set((state) => ({ channels: [newChannel, ...state.channels] }));
      return newChannel;
    } catch (error) {
      console.error("Failed to create channel", error);
      throw error;
    }
  },

  updateChannel: async (channelId, data) => {
    try {
      const updated = await channelService.updateChannel(channelId, data);
      set((state) => ({
        channels: state.channels.map((c) => (c.id === updated.id ? updated : c)),
        activeRecipient:
          state.activeRecipient.id === updated.id
            ? { ...state.activeRecipient, name: updated.name, avatar_url: updated.avatar_url, description: updated.description }
            : state.activeRecipient,
      }));
      return updated;
    } catch (error) {
      console.error("Failed to update channel", error);
      throw error;
    }
  },

  deleteChannel: async (channelId) => {
    try {
      await channelService.deleteChannel(channelId);
      set((state) => {
        const nextChannels = state.channels.filter((c) => c.id !== channelId);
        const nextActive = state.activeRecipient.id === channelId ? DEFAULT_RECIPIENT : state.activeRecipient;
        return { channels: nextChannels, activeRecipient: nextActive };
      });
    } catch (error) {
      console.error("Failed to delete channel", error);
      throw error;
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
    set({ loading: true, messages: [] });
    try {
      let messages: ChatMessage[] = [];
      const recipient = get().activeRecipient;
      if (recipient.is_channel) {
        messages = await channelService.getChannelMessages(recipientId);
      } else {
        messages = await chatService.getMessages(recipientId);
      }
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

  editMessage: async (messageId: string, content: string) => {
    const recipient = get().activeRecipient;
    try {
      let updated: ChatMessage;
      if (recipient.is_channel) {
        updated = await channelService.editChannelMessage(recipient.id, messageId, content);
      } else {
        updated = await chatService.editMessage(messageId, content);
      }
      set((state) => ({
        messages: state.messages.map((m) => (m.id === updated.id ? updated : m)),
      }));
    } catch (error) {
      console.error("Failed to edit message", error);
      throw error;
    }
  },

  deleteMessage: async (messageId: string) => {
    const recipient = get().activeRecipient;
    try {
      if (recipient.is_channel) {
        await channelService.deleteChannelMessage(recipient.id, messageId);
      } else {
        await chatService.deleteMessage(messageId);
      }
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== messageId),
      }));
    } catch (error) {
      console.error("Failed to delete message", error);
      throw error;
    }
  },

  setActiveRecipient: (recipient: ChatRecipient) => {
    set({ activeRecipient: recipient, messages: [] });
    get().fetchMessages(recipient.id);
  },

  sendMessage: async (content: string) => {
    const { activeRecipient } = get();
    if (!content.trim()) return;

    if (activeRecipient.is_channel) {
      try {
        const posted = await channelService.postChannelMessage(activeRecipient.id, content.trim());
        set((state) => {
          if (state.messages.some((m) => m.id === posted.id)) return state;
          return { messages: [...state.messages, posted] };
        });
      } catch (err) {
        console.error("Failed to send channel message", err);
        throw err;
      }
    } else {
      const { ws, connected } = get();
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
    }
  },

  connectWS: () => {
    const existingWS = get().ws;
    if (existingWS && (existingWS.readyState === WebSocket.OPEN || existingWS.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const token = getToken();
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    let cleanUrl = apiUrl.replace(/\/+$/, "");
    if (!cleanUrl.includes("/api/v1")) {
      cleanUrl = `${cleanUrl}/api/v1`;
    }
    const wsScheme = cleanUrl.startsWith("https") ? "wss" : "ws";
    const hostAndPath = cleanUrl.replace(/^https?:\/\//, "");
    const wsUrl = `${wsScheme}://${hostAndPath}/chat/ws?token=${encodeURIComponent(token)}`;

    try {
      const ws = new WebSocket(wsUrl);
      let pingInterval: NodeJS.Timeout | null = null;

      ws.onopen = () => {
        set({ connected: true });
        get().fetchUsers();
        get().fetchRequests();
        get().fetchChannels();
        get().fetchMessages(get().activeRecipient.id);

        pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 20000);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.type === "pong") return;

          if (payload.type === "new_message") {
            const msg: ChatMessage = payload.message;
            const currentRecipient = get().activeRecipient;
            const currentUserId = useAuthStore.getState().user?.id;

            const isForActiveConversation =
              (currentRecipient.is_global && msg.recipient_id === "global") ||
              (!currentRecipient.is_global &&
                ((msg.sender_id === currentUserId && msg.recipient_id === currentRecipient.id) ||
                  (msg.sender_id === currentRecipient.id && msg.recipient_id === currentUserId)));

            if (isForActiveConversation) {
              set((state) => {
                if (state.messages.some((m) => m.id === msg.id)) return state;
                return { messages: [...state.messages, msg] };
              });
            } else {
              const key = msg.recipient_id === "global" ? "global" : msg.sender_id;
              set((state) => ({
                unreadCounts: {
                  ...state.unreadCounts,
                  [key]: (state.unreadCounts[key] || 0) + 1,
                },
              }));
            }
          } else if (payload.type === "new_channel_message") {
            const msg: ChatMessage = payload.message;
            const currentRecipient = get().activeRecipient;
            if (currentRecipient.is_channel && currentRecipient.id === payload.message.channel_id) {
              set((state) => {
                if (state.messages.some((m) => m.id === msg.id)) return state;
                return { messages: [...state.messages, msg] };
              });
            } else {
              const key = payload.message.channel_id;
              set((state) => ({
                unreadCounts: {
                  ...state.unreadCounts,
                  [key]: (state.unreadCounts[key] || 0) + 1,
                },
              }));
            }
          } else if (payload.type === "channel_message_edited") {
            const updatedMsg: ChatMessage = payload.message;
            set((state) => ({
              messages: state.messages.map((m) => (m.id === updatedMsg.id ? updatedMsg : m)),
            }));
          } else if (payload.type === "channel_message_deleted") {
            const deletedId: string = payload.message_id;
            set((state) => ({
              messages: state.messages.filter((m) => m.id !== deletedId),
            }));
          } else if (payload.type === "message_edited") {
            const updatedMsg: ChatMessage = payload.message;
            set((state) => ({
              messages: state.messages.map((m) => (m.id === updatedMsg.id ? updatedMsg : m)),
            }));
          } else if (payload.type === "message_deleted") {
            const deletedId: string = payload.message_id;
            set((state) => ({
              messages: state.messages.filter((m) => m.id !== deletedId),
            }));
          } else if (payload.type === "user_status") {
            const { user_id, is_online } = payload;
            set((state) => ({
              users: state.users.map((u) => (u.id === user_id ? { ...u, is_online } : u)),
            }));
          } else if (payload.type === "channel_updated") {
            const ch: Channel = payload.channel;
            set((state) => ({
              channels: state.channels.map((c) => (c.id === ch.id ? { ...c, ...ch } : c)),
            }));
          } else if (payload.type === "channel_deleted") {
            const deletedChId: string = payload.channel_id;
            set((state) => ({
              channels: state.channels.filter((c) => c.id !== deletedChId),
              activeRecipient: state.activeRecipient.id === deletedChId ? DEFAULT_RECIPIENT : state.activeRecipient,
            }));
          } else if (
            payload.type === "channel_member_added" ||
            payload.type === "channel_member_removed" ||
            payload.type === "channel_member_role_updated" ||
            payload.type === "channel_invite_sent" ||
            payload.type === "channel_invite_responded"
          ) {
            get().fetchChannels();
            get().fetchChannelInvites();
          }
        } catch (err) {
          console.error("Error parsing WebSocket message", err);
        }
      };

      ws.onclose = () => {
        if (pingInterval) clearInterval(pingInterval);
        set({ connected: false, ws: null });
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
