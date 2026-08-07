import { create } from "zustand";
import { toast } from "sonner";
import api, { getBaseURL } from "../lib/axios";
import { getToken } from "../lib/auth";
import { useAuthStore } from "./authStore";
import { useTaskStore } from "./taskStore";

export interface ChatUser {
  id: string;
  username: string;
  avatar_url?: string | null;
  is_online?: boolean;
  connection_status?: "none" | "pending_sent" | "pending_received" | "accepted" | "declined";
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name?: string;
  sender_avatar?: string | null;
  recipient_id: string; // user_id or "global" or channel_id
  content: string;
  content_hash?: string;
  created_at: string;
  is_edited?: boolean;
  updated_at?: string | null;
}

export interface ChatRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  requester_avatar?: string | null;
  recipient_id: string;
  recipient_name: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

export interface ActiveRecipient {
  id: string; // user_id, "global", or channel_id
  username?: string;
  name?: string | null;
  avatar_url?: string | null;
  is_online?: boolean;
  is_global?: boolean;
  is_channel?: boolean;
  description?: string | null;
  my_role?: string | null;
  members_count?: number;
  connection_status?: "none" | "pending_sent" | "pending_received" | "accepted" | "declined";
}

export interface Channel {
  id: string;
  name: string;
  description?: string | null;
  avatar_url?: string | null;
  owner_id: string;
  created_at: string;
  my_role: "owner" | "admin" | "member";
  members_count: number;
}

export interface ChannelMember {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string | null;
  role: "owner" | "admin" | "member";
  status: "pending" | "accepted";
  joined_at: string;
}

export interface ChannelInvite {
  id: string;
  channel_id: string;
  channel_name: string;
  channel_description?: string | null;
  channel_avatar?: string | null;
  created_at: string;
}

interface ChatState {
  users: ChatUser[];
  activeRecipient: ActiveRecipient;
  messages: ChatMessage[];
  requests: ChatRequest[];
  channels: Channel[];
  channelInvites: ChannelInvite[];
  unreadCounts: Record<string, number>;
  loading: boolean;
  connected: boolean;
  ws: WebSocket | null;

  fetchUsers: () => Promise<void>;
  fetchRequests: () => Promise<void>;
  fetchChannels: () => Promise<void>;
  fetchChannelInvites: () => Promise<void>;
  createChannel: (
    dataOrName: { name: string; description?: string; avatar_url?: string } | string,
    description?: string,
    avatar_url?: string
  ) => Promise<Channel | null>;
  updateChannel: (channelId: string, data: { name?: string; description?: string; avatar_url?: string }) => Promise<void>;
  deleteChannel: (channelId: string) => Promise<void>;
  addChannelMember: (channelId: string, data: { user_id?: string; username?: string }) => Promise<void>;
  getChannelMembers: (channelId: string) => Promise<ChannelMember[]>;
  respondChannelInvite: (inviteId: string, action: "accept" | "decline") => Promise<void>;
  removeChannelMember: (channelId: string, targetUserId: string) => Promise<void>;
  updateChannelMemberRole: (channelId: string, targetUserId: string, role: "admin" | "member") => Promise<void>;
  fetchMessages: (recipientId: string) => Promise<void>;
  setActiveRecipient: (recipient: ActiveRecipient) => void;
  sendMessage: (content: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  sendChatRequest: (targetUsernameOrId: string) => Promise<void>;
  respondChatRequest: (requestId: string, action: "accept" | "decline" | "cancel") => Promise<void>;
  removeContact: (targetUserId: string) => Promise<void>;
  connectWS: () => void;
  disconnectWS: () => void;
}

export const DEFAULT_RECIPIENT: ActiveRecipient = {
  id: "global",
  username: "Global Public Chat",
  is_global: true,
  is_online: true,
  connection_status: "accepted",
};

const UNREAD_STORAGE_KEY = "todo_unread_counts";

function getStoredUnreadCounts(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(UNREAD_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUnreadCountsToStorage(counts: Record<string, number>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(UNREAD_STORAGE_KEY, JSON.stringify(counts));
  } catch {
    // ignore
  }
}

let chimeAudio: HTMLAudioElement | null = null;
function playChimeSound() {
  if (typeof window === "undefined") return;
  try {
    if (!chimeAudio) {
      chimeAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      chimeAudio.volume = 0.4;
    }
    chimeAudio.currentTime = 0;
    chimeAudio.play().catch(() => {});
  } catch {
    // ignore audio block policy
  }
}

// Module-level WS connection management variables to prevent duplicate socket & listener leaks
let activeWS: WebSocket | null = null;
let pingInterval: ReturnType<typeof setInterval> | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let visibilityListener: (() => void) | null = null;
let currentReconnectDelay = 1000;

function cleanupWebSocket() {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (typeof document !== "undefined" && visibilityListener) {
    document.removeEventListener("visibilitychange", visibilityListener);
    visibilityListener = null;
  }
  if (activeWS) {
    activeWS.onopen = null;
    activeWS.onmessage = null;
    activeWS.onerror = null;
    activeWS.onclose = null;
    if (activeWS.readyState === WebSocket.OPEN || activeWS.readyState === WebSocket.CONNECTING) {
      try {
        activeWS.close();
      } catch {
        // ignore
      }
    }
    activeWS = null;
  }
}

export const useChatStore = create<ChatState>((set, get) => ({
  users: [],
  activeRecipient: DEFAULT_RECIPIENT,
  messages: [],
  requests: [],
  channels: [],
  channelInvites: [],
  unreadCounts: getStoredUnreadCounts(),
  loading: false,
  connected: false,
  ws: null,

  fetchUsers: async () => {
    try {
      const res = await api.get("/chat/users");
      set({ users: res.data });
    } catch (err) {
      console.error("Failed to fetch chat users", err);
    }
  },

  fetchRequests: async () => {
    try {
      const res = await api.get("/chat/requests");
      set({ requests: res.data });
    } catch (err) {
      console.error("Failed to fetch chat requests", err);
    }
  },

  fetchChannels: async () => {
    try {
      const res = await api.get("/channels");
      set({ channels: res.data });
    } catch (err) {
      console.error("Failed to fetch channels", err);
    }
  },

  fetchChannelInvites: async () => {
    try {
      const res = await api.get("/channels/invites/pending");
      set({ channelInvites: res.data });
    } catch (err) {
      console.error("Failed to fetch channel invites", err);
    }
  },

  createChannel: async (dataOrName, description, avatar_url) => {
    let nameVal = "";
    let descVal = description;
    let avatarVal = avatar_url;

    if (typeof dataOrName === "object") {
      nameVal = dataOrName.name;
      descVal = dataOrName.description;
      avatarVal = dataOrName.avatar_url;
    } else {
      nameVal = dataOrName;
    }

    try {
      const res = await api.post("/channels", { name: nameVal, description: descVal, avatar_url: avatarVal });
      toast.success(`Channel #${nameVal} created!`);
      await get().fetchChannels();
      return res.data;
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to create channel.");
      return null;
    }
  },

  updateChannel: async (channelId, data) => {
    try {
      const res = await api.patch(`/channels/${channelId}`, data);
      toast.success("Channel details updated!");
      set((state) => ({
        channels: state.channels.map((c) => (c.id === channelId ? { ...c, ...res.data } : c)),
        activeRecipient:
          state.activeRecipient.id === channelId
            ? { ...state.activeRecipient, ...res.data }
            : state.activeRecipient,
      }));
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update channel.");
    }
  },

  deleteChannel: async (channelId) => {
    try {
      await api.delete(`/channels/${channelId}`);
      toast.success("Channel deleted!");
      set((state) => ({
        channels: state.channels.filter((c) => c.id !== channelId),
        activeRecipient: state.activeRecipient.id === channelId ? DEFAULT_RECIPIENT : state.activeRecipient,
      }));
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to delete channel.");
    }
  },

  addChannelMember: async (channelId, data) => {
    try {
      await api.post(`/channels/${channelId}/members`, data);
      toast.success("Invitation sent successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to send invitation.");
    }
  },

  getChannelMembers: async (channelId) => {
    try {
      const res = await api.get(`/channels/${channelId}/members`);
      return res.data;
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to load channel members.");
      return [];
    }
  },

  respondChannelInvite: async (inviteId, action) => {
    try {
      await api.post(`/channels/invites/${inviteId}/respond?action=${action}`);
      if (action === "accept") toast.success("Joined channel!");
      else toast.info("Invitation declined.");
      await get().fetchChannels();
      await get().fetchChannelInvites();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to respond to invite.");
    }
  },

  removeChannelMember: async (channelId, targetUserId) => {
    try {
      await api.delete(`/channels/${channelId}/members/${targetUserId}`);
      toast.success("Member removed.");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to remove member.");
    }
  },

  updateChannelMemberRole: async (channelId, targetUserId, role) => {
    try {
      await api.patch(`/channels/${channelId}/members/${targetUserId}/role`, { role });
      toast.success(`Role updated to ${role}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update member role.");
    }
  },

  fetchMessages: async (recipientId: string) => {
    set({ loading: true });
    try {
      let endpoint = `/chat/messages?recipient_id=${encodeURIComponent(recipientId)}`;
      const channelMatch = get().channels.find((c) => c.id === recipientId);
      if (channelMatch || get().activeRecipient.is_channel) {
        endpoint = `/channels/${recipientId}/messages`;
      }

      const res = await api.get(endpoint);
      set({ messages: res.data, loading: false });

      set((state) => {
        const next = { ...state.unreadCounts };
        delete next[recipientId];
        saveUnreadCountsToStorage(next);
        return { unreadCounts: next };
      });
    } catch (err) {
      console.error("Failed to fetch messages", err);
      set({ loading: false });
    }
  },

  setActiveRecipient: (recipient: ActiveRecipient) => {
    set({ activeRecipient: recipient });
    get().fetchMessages(recipient.id);
  },

  sendMessage: async (content: string) => {
    if (!content.trim()) return;

    const recipient = get().activeRecipient;
    const ws = activeWS;
    const connected = get().connected;

    if (ws && connected && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          recipient_id: recipient.id,
          content: content.trim(),
        })
      );
    } else {
      try {
        let res;
        if (recipient.is_channel) {
          res = await api.post(`/channels/${recipient.id}/messages`, { content: content.trim() });
        } else {
          res = await api.post("/chat/messages", {
            recipient_id: recipient.id,
            content: content.trim(),
          });
        }
        set((state) => ({
          messages: state.messages.some((m) => m.id === res.data.id)
            ? state.messages
            : [...state.messages, res.data].slice(-500),
        }));
      } catch (err) {
        console.error("Failed to send message via HTTP fallback", err);
        toast.error("Failed to send message. Please check connection.");
      }
      get().connectWS();
    }
  },

  editMessage: async (messageId: string, newContent: string) => {
    if (!newContent.trim()) return;
    const activeRec = get().activeRecipient;
    try {
      let res;
      if (activeRec.is_channel) {
        res = await api.patch(`/channels/${activeRec.id}/messages/${messageId}`, { content: newContent.trim() });
      } else {
        res = await api.patch(`/chat/messages/${messageId}`, { content: newContent.trim() });
      }
      set((state) => ({
        messages: state.messages.map((m) => (m.id === messageId ? res.data : m)),
      }));
      toast.success("Message edited!");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to edit message.");
    }
  },

  deleteMessage: async (messageId: string) => {
    const activeRec = get().activeRecipient;
    try {
      if (activeRec.is_channel) {
        await api.delete(`/channels/${activeRec.id}/messages/${messageId}`);
      } else {
        await api.delete(`/chat/messages/${messageId}`);
      }
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== messageId),
      }));
      toast.success("Message deleted!");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to delete message.");
    }
  },

  sendChatRequest: async (targetUsernameOrId: string) => {
    try {
      const res = await api.post("/chat/requests", { recipient_id: targetUsernameOrId });
      await get().fetchRequests();
      await get().fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to send chat request.");
    }
  },

  respondChatRequest: async (requestId: string, action: "accept" | "decline" | "cancel") => {
    try {
      await api.patch(`/chat/requests/${requestId}`, { action });
      if (action === "accept") {
        toast.success("Chat request accepted!");
      } else if (action === "cancel") {
        toast.info("Chat request cancelled");
      } else {
        toast.info("Chat request declined");
      }
      await get().fetchRequests();
      await get().fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to respond to chat request.");
    }
  },

  removeContact: async (targetUserId: string) => {
    try {
      await api.delete(`/chat/contacts/${targetUserId}`);
      toast.info("Contact removed.");
      await get().fetchUsers();
      await get().fetchRequests();
      set({ activeRecipient: DEFAULT_RECIPIENT });
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to remove contact.");
    }
  },

  connectWS: () => {
    if (activeWS && (activeWS.readyState === WebSocket.OPEN || activeWS.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const token = getToken();
    if (!token) {
      cleanupWebSocket();
      set({ ws: null, connected: false });
      return;
    }

    cleanupWebSocket();

    const apiUrl = getBaseURL();
    const cleanUrl = apiUrl.replace(/\/+$/, "");
    const wsScheme = cleanUrl.startsWith("https") ? "wss" : "ws";
    const hostAndPath = cleanUrl.replace(/^https?:\/\//, "");
    const wsUrl = `${wsScheme}://${hostAndPath}/chat/ws?token=${encodeURIComponent(token)}`;

    try {
      const ws = new WebSocket(wsUrl);
      activeWS = ws;
      set({ ws });

      ws.onopen = () => {
        if (activeWS !== ws) return;
        currentReconnectDelay = 1000;
        set({ connected: true });

        get().fetchUsers();
        get().fetchRequests();
        get().fetchChannels();
        get().fetchMessages(get().activeRecipient.id);

        if (pingInterval) clearInterval(pingInterval);
        pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN && typeof document !== "undefined" && !document.hidden) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 20000);

        if (typeof document !== "undefined") {
          if (visibilityListener) document.removeEventListener("visibilitychange", visibilityListener);
          visibilityListener = () => {
            if (!document.hidden && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "ping" }));
            }
          };
          document.addEventListener("visibilitychange", visibilityListener);
        }
      };

      ws.onmessage = (event) => {
        if (activeWS !== ws) return;

        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "pong") return;

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

            if (msgSender !== currUser) {
              playChimeSound();
            }

            if (isForActiveConversation) {
              set((state) => {
                if (state.messages.some((m) => m.id === msg.id)) return state;
                const updated = [...state.messages, msg];
                return { messages: updated.length > 500 ? updated.slice(-500) : updated };
              });
            } else {
              const targetUser = get().users.find((u) => u.id.toLowerCase() === msgSender);
              const key = msgRecipient === "global" ? "global" : (targetUser ? targetUser.id : msgSender);
              set((state) => {
                const nextUnread = {
                  ...state.unreadCounts,
                  [key]: (state.unreadCounts[key] || 0) + 1,
                };
                saveUnreadCountsToStorage(nextUnread);
                return { unreadCounts: nextUnread };
              });
            }
          } else if (payload.type === "new_channel_message") {
            const msg: ChatMessage = payload.message;
            const currentRecipient = get().activeRecipient;
            const currentUserId = useAuthStore.getState().user?.id;
            const isMe = msg.sender_id === currentUserId;

            if (!isMe) {
              playChimeSound();
            }

            if (currentRecipient.is_channel && currentRecipient.id === payload.message.channel_id) {
              set((state) => {
                if (state.messages.some((m) => m.id === msg.id)) return state;
                const updated = [...state.messages, msg];
                return { messages: updated.length > 500 ? updated.slice(-500) : updated };
              });
            } else if (!isMe) {
              const key = payload.message.channel_id;
              set((state) => {
                const nextUnread = {
                  ...state.unreadCounts,
                  [key]: (state.unreadCounts[key] || 0) + 1,
                };
                saveUnreadCountsToStorage(nextUnread);
                return { unreadCounts: nextUnread };
              });
            }
          } else if (payload.type === "channel_message_edited" || payload.type === "message_edited") {
            const updatedMsg: ChatMessage = payload.message;
            set((state) => ({
              messages: state.messages.map((m) => (m.id === updatedMsg.id ? updatedMsg : m)),
            }));
          } else if (payload.type === "channel_message_deleted" || payload.type === "message_deleted") {
            const deletedId: string = payload.message_id;
            set((state) => ({
              messages: state.messages.filter((m) => m.id !== deletedId),
            }));
          } else if (payload.type === "online_users") {
            const onlineSet = new Set((payload.user_ids || []).map((id: string) => String(id).toLowerCase()));
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
            payload.type === "chat_request_updated" ||
            payload.type === "contact_removed"
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
                  set({ activeRecipient: { ...currentActive, connection_status: newStatus } });
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
        if (activeWS !== ws) return;
        activeWS = null;
        if (pingInterval) {
          clearInterval(pingInterval);
          pingInterval = null;
        }
        if (typeof document !== "undefined" && visibilityListener) {
          document.removeEventListener("visibilitychange", visibilityListener);
          visibilityListener = null;
        }

        set({ connected: false, ws: null });

        if (event.code === 1008) {
          console.warn("WebSocket authentication failed (1008). Logging out stale session.");
          currentReconnectDelay = 1000;
          useAuthStore.getState().logout();
          return;
        }

        const delay = currentReconnectDelay;
        currentReconnectDelay = Math.min(currentReconnectDelay * 2, 30000);

        if (reconnectTimer) clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;
          get().connectWS();
        }, delay);
      };

      ws.onerror = (err) => {
        if (activeWS !== ws) return;
        console.error("WebSocket error", err);
        set({ connected: false });
      };
    } catch (err) {
      console.error("Failed to initialize WebSocket connection", err);
    }
  },

  disconnectWS: () => {
    currentReconnectDelay = 1000;
    cleanupWebSocket();
    set({ ws: null, connected: false });
  },
}));
