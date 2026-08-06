import { create } from "zustand";
import { ChatUser, ChatMessage, ChatRecipient, ChatRequest, Channel, ChannelInvite } from "../types/chat";
import { chatService } from "../services/chat";
import { channelService } from "../services/channel";
import { getToken } from "../lib/auth";
import { getBaseURL } from "../lib/axios";
import { useAuthStore } from "./authStore";
import { useTaskStore } from "./taskStore";
import { toast } from "sonner";

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

const RECIPIENT_STORAGE_KEY = "todo_active_recipient";

const getSavedRecipient = (): ChatRecipient => {
  if (typeof window === "undefined") return DEFAULT_RECIPIENT;
  try {
    const saved = localStorage.getItem(RECIPIENT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id) {
        if (parsed.id === "global") return DEFAULT_RECIPIENT;
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse saved active recipient", e);
  }
  return DEFAULT_RECIPIENT;
};

const saveRecipientToStorage = (recipient: ChatRecipient) => {
  if (typeof window === "undefined") return;
  try {
    const minimalRecipient = {
      id: recipient.id,
      name: recipient.name,
      is_global: recipient.id === "global" || recipient.is_global,
      is_channel: recipient.is_channel,
      connection_status: recipient.connection_status,
    };
    localStorage.setItem(RECIPIENT_STORAGE_KEY, JSON.stringify(minimalRecipient));
  } catch (e) {
    console.error("Failed to save active recipient", e);
  }
};

export const useChatStore = create<ChatState>((set, get) => ({
  users: [],
  chatRequests: [],
  channels: [],
  channelInvites: [],
  activeRecipient: getSavedRecipient(),
  messages: [],
  unreadCounts: {},
  loading: false,
  connected: false,
  ws: null,

  fetchUsers: async () => {
    try {
      const users = await chatService.getUsers();
      set((state) => {
        const onlineMap = new Map(state.users.map((u) => [u.id.toLowerCase(), u.is_online]));
        const mergedUsers = users.map((u) => {
          const wasOnline = onlineMap.get(u.id.toLowerCase());
          return {
            ...u,
            is_online: wasOnline !== undefined ? Boolean(u.is_online || wasOnline) : u.is_online,
          };
        });

        const currentActive = state.activeRecipient;
        let updatedRecipient = currentActive;
        if (!currentActive.is_global && !currentActive.is_channel) {
          const updatedUser = mergedUsers.find((u) => u.id.toLowerCase() === currentActive.id.toLowerCase());
          if (updatedUser) {
            updatedRecipient = {
              id: updatedUser.id,
              name: updatedUser.username,
              avatar_url: updatedUser.avatar_url,
              is_online: updatedUser.is_online,
              connection_status: updatedUser.connection_status,
            };
            saveRecipientToStorage(updatedRecipient);
          }
        }
        return { users: mergedUsers, activeRecipient: updatedRecipient };
      });
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
      const currentActive = get().activeRecipient;
      if (currentActive.is_channel) {
        const updatedChannel = channels.find((c) => c.id === currentActive.id);
        if (updatedChannel) {
          const updatedRecipient: ChatRecipient = {
            id: updatedChannel.id,
            name: updatedChannel.name,
            avatar_url: updatedChannel.avatar_url,
            description: updatedChannel.description,
            is_channel: true,
            my_role: updatedChannel.my_role,
            members_count: updatedChannel.members_count,
          };
          set({ activeRecipient: updatedRecipient });
          saveRecipientToStorage(updatedRecipient);
        } else {
          set({ activeRecipient: DEFAULT_RECIPIENT });
          saveRecipientToStorage(DEFAULT_RECIPIENT);
        }
      }
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
      set((state) => {
        const nextActive =
          state.activeRecipient.id === updated.id
            ? { ...state.activeRecipient, name: updated.name, avatar_url: updated.avatar_url, description: updated.description }
            : state.activeRecipient;
        if (state.activeRecipient.id === updated.id) {
          saveRecipientToStorage(nextActive);
        }
        return {
          channels: state.channels.map((c) => (c.id === updated.id ? updated : c)),
          activeRecipient: nextActive,
        };
      });
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
        if (state.activeRecipient.id === channelId) {
          saveRecipientToStorage(DEFAULT_RECIPIENT);
        }
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
    if (get().messages.length === 0) {
      set({ loading: true });
    }
    try {
      let messages: ChatMessage[] = [];
      const recipient = get().activeRecipient;
      const isChannel = recipient.is_channel || (recipientId !== "global" && get().channels.some((c) => c.id === recipientId));

      if (isChannel) {
        messages = await channelService.getChannelMessages(recipientId);
      } else {
        messages = await chatService.getMessages(recipientId);
      }
      set({ messages, loading: false });

      // Clear unread count for this recipient
      set((state) => {
        const nextUnread = { ...state.unreadCounts };
        delete nextUnread[recipientId];
        delete nextUnread[recipientId.toLowerCase()];
        return { unreadCounts: nextUnread };
      });
    } catch (error) {
      console.error("Failed to fetch chat messages", error);
      set({ loading: false });
    }
  },

  editMessage: async (messageId: string, content: string) => {
    const recipient = get().activeRecipient;
    const isChannel = recipient.is_channel || (recipient.id !== "global" && get().channels.some((c) => c.id === recipient.id));
    try {
      let updated: ChatMessage;
      if (isChannel) {
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
    const isChannel = recipient.is_channel || (recipient.id !== "global" && get().channels.some((c) => c.id === recipient.id));
    try {
      if (isChannel) {
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
    saveRecipientToStorage(recipient);
    get().fetchMessages(recipient.id);
  },

  sendMessage: async (content: string) => {
    const { activeRecipient } = get();
    if (!content.trim()) return;

    const isGlobal = activeRecipient.id === "global" || activeRecipient.is_global;
    const isChannel = !isGlobal && (activeRecipient.is_channel || get().channels.some((c) => c.id === activeRecipient.id));

    if (isChannel) {
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
      const recipientId = isGlobal ? "global" : activeRecipient.id;
      const { ws, connected } = get();
      if (ws && connected && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            recipient_id: recipientId,
            content: content.trim(),
          })
        );
      } else {
        // Fallback to HTTP when WS is unavailable; then trigger reconnection
        try {
          const sent = await chatService.sendMessage(recipientId, content.trim());
          set((state) => {
            if (state.messages.some((m) => m.id === sent.id)) return state;
            return { messages: [...state.messages, sent] };
          });
        } catch (err) {
          console.error("Failed to send message via HTTP fallback", err);
          toast.error("Failed to send message. Please check connection.");
        }
        get().connectWS();
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

    const apiUrl = getBaseURL();
    const cleanUrl = apiUrl.replace(/\/+$/, "");
    const wsScheme = cleanUrl.startsWith("https") ? "wss" : "ws";
    const hostAndPath = cleanUrl.replace(/^https?:\/\//, "");
    const wsUrl = `${wsScheme}://${hostAndPath}/chat/ws?token=${encodeURIComponent(token)}`;

    try {
      const ws = new WebSocket(wsUrl);
      let pingInterval: NodeJS.Timeout | null = null;
      let visibilityListener: (() => void) | null = null;
      let reconnectDelay = 1000;

      ws.onopen = () => {
        reconnectDelay = 1000;
        set({ connected: true });
        get().fetchUsers();
        get().fetchRequests();
        get().fetchChannels();
        get().fetchMessages(get().activeRecipient.id);

        pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN && typeof document !== "undefined" && !document.hidden) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 20000);

        if (typeof document !== "undefined") {
          visibilityListener = () => {
            if (!document.hidden && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "ping" }));
            }
          };
          document.addEventListener("visibilitychange", visibilityListener);
        }
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.type === "pong") return;
          console.log("[WS EVENT]", payload);

          if (payload.type === "new_message") {
            const msg: ChatMessage = payload.message;
            const currentRecipient = get().activeRecipient;
            const currentUserId = useAuthStore.getState().user?.id;

            const isGlobal = currentRecipient.id === "global" || currentRecipient.is_global;

            const msgSender = (msg.sender_id || "").toLowerCase();
            const msgRecipient = (msg.recipient_id || "").toLowerCase();
            const currUser = (currentUserId || "").toLowerCase();
            const activeId = (currentRecipient.id || "").toLowerCase();

            const isForActiveConversation =
              (isGlobal && msgRecipient === "global") ||
              (!isGlobal &&
                ((msgSender === currUser && msgRecipient === activeId) ||
                  (msgSender === activeId && (msgRecipient === currUser || msgRecipient === "global"))));

            if (isForActiveConversation) {
              set((state) => {
                if (state.messages.some((m) => m.id === msg.id)) return state;
                return { messages: [...state.messages, msg] };
              });
            } else {
              const targetUser = get().users.find((u) => u.id.toLowerCase() === msgSender);
              const key = msgRecipient === "global" ? "global" : (targetUser ? targetUser.id : msgSender);
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
            const currentUserId = useAuthStore.getState().user?.id;
            const isMe = msg.sender_id === currentUserId;

            if (currentRecipient.is_channel && currentRecipient.id === payload.message.channel_id) {
              set((state) => {
                if (state.messages.some((m) => m.id === msg.id)) return state;
                return { messages: [...state.messages, msg] };
              });
            } else if (!isMe) {
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
          } else if (payload.type === "online_users") {
            const onlineSet = new Set(
              (payload.user_ids || []).map((id: string) => String(id).toLowerCase())
            );
            set((state) => ({
              users: state.users.map((u) => ({
                ...u,
                is_online: onlineSet.has(u.id.toLowerCase()),
              })),
              activeRecipient: {
                ...state.activeRecipient,
                is_online: onlineSet.has(state.activeRecipient.id.toLowerCase()),
              },
            }));
          } else if (payload.type === "user_status") {
            const { user_id, is_online } = payload;
            const targetId = String(user_id).toLowerCase();
            set((state) => ({
              users: state.users.map((u) => (u.id.toLowerCase() === targetId ? { ...u, is_online } : u)),
              activeRecipient:
                state.activeRecipient.id.toLowerCase() === targetId
                  ? { ...state.activeRecipient, is_online }
                  : state.activeRecipient,
            }));
          } else if (
            payload.type === "chat_request_received" ||
            payload.type === "chat_request_updated"
          ) {
            get().fetchRequests();
            get().fetchUsers();

            const req: ChatRequest = payload.request;
            const currentUserId = useAuthStore.getState().user?.id;

            if (req) {
              if (payload.type === "chat_request_received" && req.recipient_id === currentUserId) {
                toast.info(`New chat request from @${req.requester_name}!`);
              } else if (payload.type === "chat_request_updated" && req.requester_id === currentUserId) {
                if (req.status === "accepted") {
                  toast.success(`@${req.recipient_name} accepted your chat request!`);
                } else if (req.status === "declined") {
                  toast.info(`@${req.recipient_name} declined your chat request.`);
                }
              }

              // Real-time connection_status update for open active recipient
              const currentActive = get().activeRecipient;
              if (!currentActive.is_global && !currentActive.is_channel) {
                if (currentActive.id === req.requester_id || currentActive.id === req.recipient_id) {
                  let newStatus: "none" | "pending_sent" | "pending_received" | "accepted" | "declined" = "none";
                  if (req.status === "accepted") {
                    newStatus = "accepted";
                  } else if (req.status === "pending") {
                    newStatus = req.requester_id === currentUserId ? "pending_sent" : "pending_received";
                  } else if (req.status === "declined") {
                    newStatus = "declined";
                  }
                  const updatedActive = { ...currentActive, connection_status: newStatus };
                  set({ activeRecipient: updatedActive });
                }
              }
            }
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
          } else if (
            payload.type === "task_share_requested" ||
            payload.type === "task_share_responded" ||
            payload.type === "task_collaborator_removed" ||
            payload.type === "task_comment_added"
          ) {
            useTaskStore.getState().fetchTasks();
            useTaskStore.getState().fetchPendingShares();

            if (payload.type === "task_share_requested") {
              toast.info(`New task invitation from @${payload.owner_username}!`);
            } else if (payload.type === "task_share_responded" && payload.action === "accept") {
              toast.success(`Task invitation accepted!`);
            }
          }
        } catch (err) {
          console.error("Error parsing WebSocket message", err);
        }
      };

      ws.onclose = (event: CloseEvent) => {
        if (pingInterval) clearInterval(pingInterval);
        if (typeof document !== "undefined" && visibilityListener) {
          document.removeEventListener("visibilitychange", visibilityListener);
        }
        set({ connected: false, ws: null });
        if (event.code === 1008) {
          console.warn("WebSocket authentication failed (1008). Stopping reconnection loop.");
          return;
        }
        // Exponential backoff strategy for reconnection
        const currentDelay = reconnectDelay;
        reconnectDelay = Math.min(reconnectDelay * 2, 30000);
        setTimeout(() => {
          get().connectWS();
        }, currentDelay);
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
