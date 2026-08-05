"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Navbar } from "../../components/layout/Navbar";
import { Sidebar } from "../../components/layout/Sidebar";
import { Footer } from "../../components/layout/Footer";
import { useAuthStore } from "../../store/authStore";
import { useChatStore, DEFAULT_RECIPIENT } from "../../store/chatStore";
import {
  MessageSquare,
  Send,
  Search,
  Hash,
  Loader2,
  UserPlus,
  Check,
  X,
  Clock,
  ShieldAlert,
  UserCheck,
  Pencil,
  Trash2,
  Plus,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Pagination } from "../../components/ui/Pagination";
import { toast } from "sonner";
import { CreateChannelModal } from "../../components/chat/CreateChannelModal";
import { ChannelSettingsModal } from "../../components/chat/ChannelSettingsModal";

export default function ChatPage() {
  const { user } = useAuthStore();
  const {
    users,
    chatRequests,
    channels,
    channelInvites,
    activeRecipient,
    messages,
    unreadCounts,
    loading,
    connected,
    fetchUsers,
    fetchRequests,
    fetchChannels,
    fetchChannelInvites,
    respondChannelInvite,
    fetchMessages,
    editMessage,
    deleteMessage,
    sendChatRequest,
    respondChatRequest,
    setActiveRecipient,
    sendMessage,
    connectWS,
    disconnectWS,
  } = useChatStore();

  const [inputContent, setInputContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"chats" | "requests" | "discover">("chats");
  const [isSendingReq, setIsSendingReq] = useState<string | null>(null);

  // Collapse states for sidebar sections
  const [isChannelsCollapsed, setIsChannelsCollapsed] = useState(false);
  const [isContactsCollapsed, setIsContactsCollapsed] = useState(false);

  // Channel modals state
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isChannelSettingsOpen, setIsChannelSettingsOpen] = useState(false);
  
  // Message edit state
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Message delete modal state
  const [msgToDeleteId, setMsgToDeleteId] = useState<string | null>(null);
  const [isDeletingMsg, setIsDeletingMsg] = useState(false);

  // Discover tab pagination state
  const [discoverPage, setDiscoverPage] = useState(1);
  const USERS_PER_PAGE = 10;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
    fetchRequests();
    fetchChannels();
    fetchChannelInvites();
    fetchMessages(activeRecipient.id);
    connectWS();

    return () => {
      disconnectWS();
    };
  }, [activeRecipient.id, connectWS, disconnectWS, fetchChannels, fetchChannelInvites, fetchMessages, fetchRequests, fetchUsers]);

  // Auto-scroll messages to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim()) return;

    sendMessage(inputContent.trim());
    setInputContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartEdit = (msgId: string, currentContent: string) => {
    setEditingMsgId(msgId);
    setEditContent(currentContent);
  };

  const handleCancelEdit = () => {
    setEditingMsgId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (msgId: string) => {
    if (!editContent.trim()) return;
    try {
      await editMessage(msgId, editContent.trim());
      setEditingMsgId(null);
      setEditContent("");
      toast.success("Message updated");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.detail : undefined;
      toast.error(msg || "Failed to edit message");
    }
  };

  const handleDeleteMsg = (msgId: string) => {
    setMsgToDeleteId(msgId);
  };

  const handleConfirmDelete = async () => {
    if (!msgToDeleteId) return;
    setIsDeletingMsg(true);
    try {
      await deleteMessage(msgToDeleteId);
      toast.success("Message deleted");
      setMsgToDeleteId(null);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.detail : undefined;
      toast.error(msg || "Failed to delete message");
    } finally {
      setIsDeletingMsg(false);
    }
  };

  const handleSendRequestClick = async (recipientId: string) => {
    setIsSendingReq(recipientId);
    try {
      await sendChatRequest(recipientId);
      toast.success("Chat request sent!");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.detail : undefined;
      toast.error(msg || "Failed to send chat request");
    } finally {
      setIsSendingReq(null);
    }
  };

  const handleRespondRequestClick = async (requestId: string, action: "accept" | "decline") => {
    try {
      await respondChatRequest(requestId, action);
      if (action === "accept") {
        toast.success("Chat request accepted!");
      } else {
        toast.info("Chat request declined");
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.detail : undefined;
      toast.error(msg || "Failed to respond to request");
    }
  };

  const handleRespondChannelInviteClick = async (inviteId: string, action: "accept" | "decline") => {
    try {
      await respondChannelInvite(inviteId, action);
      if (action === "accept") {
        toast.success("Joined channel!");
      } else {
        toast.info("Channel invitation declined");
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.detail : undefined;
      toast.error(msg || "Failed to respond to channel invite");
    }
  };

  const acceptedUsers = users.filter((u) => u.connection_status === "accepted");
  const pendingIncoming = chatRequests.filter(
    (r) => r.recipient_id === user?.id && r.status === "pending"
  );
  const pendingOutgoing = chatRequests.filter(
    (r) => r.requester_id === user?.id && r.status === "pending"
  );

  const discoverUsers = users.filter(
    (u) =>
      u.connection_status !== "accepted" &&
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDiscoverPages = Math.ceil(discoverUsers.length / USERS_PER_PAGE);
  const paginatedDiscoverUsers = discoverUsers.slice(
    (discoverPage - 1) * USERS_PER_PAGE,
    discoverPage * USERS_PER_PAGE
  );

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.trim().substring(0, 2).toUpperCase();
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  // Find request ID for active recipient if pending
  const incomingReqForActive = pendingIncoming.find((r) => r.requester_id === activeRecipient.id);

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full flex flex-col h-[calc(100vh-4rem)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  Chat
                </h1>
              </div>
            </div>

            {/* Main Chat Interface Container */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden min-h-0">
              {/* Left Column: Navigation Tabs & Users */}
              <div className="border-r border-slate-200/80 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/40">
                {/* Search Header */}
                <div className="p-3 border-b border-slate-200/60 dark:border-slate-800 space-y-2">
                  <Input
                    id="chat-user-search"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="h-4 w-4 text-slate-400" />}
                    className="h-9 text-xs"
                  />

                  {/* Left Column Tabs */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl text-[11px] font-semibold">
                    <button
                      onClick={() => setActiveTab("chats")}
                      className={`py-1 rounded-lg transition-colors ${
                        activeTab === "chats"
                          ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Chats
                    </button>
                    <button
                      onClick={() => setActiveTab("requests")}
                      className={`py-1 rounded-lg transition-colors relative ${
                        activeTab === "requests"
                          ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Requests
                      {pendingIncoming.length + channelInvites.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-3.5 min-w-3.5 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                          {pendingIncoming.length + channelInvites.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("discover")}
                      className={`py-1 rounded-lg transition-colors ${
                        activeTab === "discover"
                          ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Discover
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-2 space-y-3">
                  {activeTab === "chats" && (
                    <>
                      {/* Channels Section */}
                      <div>
                        <div className="flex items-center justify-between px-2 mb-1">
                          <button
                            onClick={() => setIsChannelsCollapsed((prev) => !prev)}
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                          >
                            {isChannelsCollapsed ? (
                              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                            )}
                            Channels ({channels.length + 1})
                          </button>
                          <button
                            onClick={() => setIsCreateChannelOpen(true)}
                            title="Create new channel"
                            className="p-0.5 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {!isChannelsCollapsed && (
                          <div className="space-y-1">
                            {/* Public Channel */}
                            <button
                              onClick={() => setActiveRecipient(DEFAULT_RECIPIENT)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                activeRecipient.id === "global"
                                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <div className="h-7 w-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                                  <Hash className="h-4 w-4" />
                                </div>
                                <span className="truncate">Public Channel</span>
                              </div>
                              {unreadCounts["global"] ? (
                                <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                                  {unreadCounts["global"]}
                                </span>
                              ) : null}
                            </button>

                            {/* Custom Channels */}
                            {channels.map((ch) => {
                              const isSelected = activeRecipient.id === ch.id;
                              const unread = unreadCounts[ch.id];

                              return (
                                <button
                                  key={ch.id}
                                  onClick={() =>
                                    setActiveRecipient({
                                      id: ch.id,
                                      name: ch.name,
                                      avatar_url: ch.avatar_url,
                                      description: ch.description,
                                      is_channel: true,
                                      my_role: ch.my_role,
                                      members_count: ch.members_count,
                                    })
                                  }
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                    isSelected
                                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold"
                                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <div className="h-7 w-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 overflow-hidden font-bold text-[11px]">
                                      {ch.avatar_url ? (
                                        <img src={ch.avatar_url} alt={ch.name} className="h-full w-full object-cover" />
                                      ) : (
                                        <Hash className="h-4 w-4" />
                                      )}
                                    </div>
                                    <span className="truncate">#{ch.name}</span>
                                  </div>

                                  {unread ? (
                                    <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                                      {unread}
                                    </span>
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Direct Messages Section (Accepted Connections) */}
                      <div>
                        <div className="flex items-center justify-between px-2 mb-1">
                          <button
                            onClick={() => setIsContactsCollapsed((prev) => !prev)}
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                          >
                            {isContactsCollapsed ? (
                              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                            )}
                            Contacts ({acceptedUsers.length})
                          </button>
                        </div>

                        {!isContactsCollapsed && (
                          <div className="space-y-1 mt-1">
                            {acceptedUsers.length === 0 ? (
                              <p className="px-2 text-[11px] text-slate-400 dark:text-slate-500 italic">
                                No approved chats yet. Send or accept a chat request!
                              </p>
                            ) : (
                              acceptedUsers.map((u) => {
                                const isSelected = activeRecipient.id === u.id;
                                const unread = unreadCounts[u.id];

                                return (
                                  <button
                                    key={u.id}
                                    onClick={() =>
                                      setActiveRecipient({
                                        id: u.id,
                                        name: u.username,
                                        avatar_url: u.avatar_url,
                                        is_online: u.is_online,
                                        connection_status: "accepted",
                                      })
                                    }
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                                      isSelected
                                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 truncate">
                                      <div className="relative flex-shrink-0">
                                        <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                                          {u.avatar_url ? (
                                            <img
                                              src={u.avatar_url}
                                              alt={u.username}
                                              className="h-full w-full object-cover"
                                            />
                                          ) : (
                                            getInitials(u.username)
                                          )}
                                        </div>
                                        <span
                                          className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                                            u.is_online ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                                          }`}
                                        />
                                      </div>

                                      <span className="truncate">{u.username}</span>
                                    </div>

                                    {unread ? (
                                      <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                                        {unread}
                                      </span>
                                    ) : null}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {activeTab === "requests" && (
                    <div className="space-y-3">
                      {/* Channel Invitations */}
                      {channelInvites.length > 0 && (
                        <div>
                          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Channel Invites ({channelInvites.length})
                          </span>
                          <div className="space-y-2 mt-1">
                            {channelInvites.map((inv) => (
                              <div
                                key={inv.id}
                                className="p-2.5 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 space-y-2"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-lg bg-indigo-200 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden">
                                    {inv.channel_avatar ? (
                                      <img src={inv.channel_avatar} alt={inv.channel_name} className="h-full w-full object-cover" />
                                    ) : (
                                      <Hash className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div className="truncate">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                      #{inv.channel_name}
                                    </h4>
                                    {inv.channel_description && (
                                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                        {inv.channel_description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    className="h-7 text-[10px] py-0 px-2.5 flex-1 bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => handleRespondChannelInviteClick(inv.id, "accept")}
                                    icon={<Check className="h-3 w-3" />}
                                  >
                                    Accept Channel Invite
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-[10px] py-0 px-2.5 text-rose-500 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                    onClick={() => handleRespondChannelInviteClick(inv.id, "decline")}
                                    icon={<X className="h-3 w-3" />}
                                  >
                                    Decline
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Incoming Requests */}
                      <div>
                        <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Incoming Requests ({pendingIncoming.length})
                        </span>
                        <div className="space-y-2 mt-1">
                          {pendingIncoming.length === 0 ? (
                            <p className="px-2 text-[11px] text-slate-400 dark:text-slate-500 italic">
                              No pending incoming requests.
                            </p>
                          ) : (
                            pendingIncoming.map((req) => (
                              <div
                                key={req.id}
                                className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 space-y-2"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden font-bold text-xs">
                                    {req.requester_avatar ? (
                                      <img
                                        src={req.requester_avatar}
                                        alt={req.requester_name}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      getInitials(req.requester_name)
                                    )}
                                  </div>
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                    {req.requester_name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    className="h-7 text-[10px] py-0 px-2.5 flex-1 bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => handleRespondRequestClick(req.id, "accept")}
                                    icon={<Check className="h-3 w-3" />}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-[10px] py-0 px-2.5 text-rose-500 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                    onClick={() => handleRespondRequestClick(req.id, "decline")}
                                    icon={<X className="h-3 w-3" />}
                                  >
                                    Decline
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Outgoing Pending Requests */}
                      <div>
                        <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Sent Pending ({pendingOutgoing.length})
                        </span>
                        <div className="space-y-1 mt-1">
                          {pendingOutgoing.length === 0 ? (
                            <p className="px-2 text-[11px] text-slate-400 dark:text-slate-500 italic">
                              No outgoing pending requests.
                            </p>
                          ) : (
                            pendingOutgoing.map((req) => (
                              <div
                                key={req.id}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-slate-100/70 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400"
                              >
                                <span className="truncate font-medium">{req.recipient_name}</span>
                                <span className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold">
                                  <Clock className="h-3 w-3" /> Pending
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "discover" && (
                    <div>
                      <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Other Registered Users ({discoverUsers.length})
                      </span>
                      <div className="space-y-1.5 mt-2">
                        {discoverUsers.length === 0 ? (
                          <p className="px-2 text-[11px] text-slate-400 dark:text-slate-500 italic">
                            No new users to discover.
                          </p>
                        ) : (
                          paginatedDiscoverUsers.map((u) => {
                            const status = u.connection_status || "none";

                            return (
                              <div
                                key={u.id}
                                className="flex items-center justify-between p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800"
                              >
                                <div className="flex items-center gap-2.5 truncate">
                                  <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden font-bold text-[11px]">
                                    {u.avatar_url ? (
                                      <img
                                        src={u.avatar_url}
                                        alt={u.username}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      getInitials(u.username)
                                    )}
                                  </div>
                                  <div className="truncate">
                                    <span className="block font-bold text-slate-800 dark:text-slate-200 truncate">
                                      {u.username}
                                    </span>
                                  </div>
                                </div>

                                {status === "pending_sent" ? (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                                    <Clock className="h-3 w-3" /> Sent
                                  </span>
                                ) : status === "pending_received" ? (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                                    Request received
                                  </span>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-[10px] py-0 px-2 font-semibold"
                                    loading={isSendingReq === u.id}
                                    onClick={() => handleSendRequestClick(u.id)}
                                    icon={<UserPlus className="h-3 w-3" />}
                                  >
                                    Connect
                                  </Button>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>

                      {totalDiscoverPages > 1 && (
                        <div className="mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <Pagination
                            currentPage={discoverPage}
                            totalPages={totalDiscoverPages}
                            onPageChange={setDiscoverPage}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Active Chat Area */}
              <div className="md:col-span-2 lg:col-span-3 flex flex-col min-h-0 bg-white dark:bg-slate-900">
                {/* Active Chat Header */}
                <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
                  <div className="flex items-center gap-3">
                    {activeRecipient.is_global || activeRecipient.is_channel ? (
                      <div className="h-9 w-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold overflow-hidden flex-shrink-0">
                        {activeRecipient.avatar_url ? (
                          <img src={activeRecipient.avatar_url} alt={activeRecipient.name} className="h-full w-full object-cover" />
                        ) : (
                          <Hash className="h-5 w-5" />
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden font-bold text-slate-700 dark:text-slate-300 text-xs">
                          {activeRecipient.avatar_url ? (
                            <img
                              src={activeRecipient.avatar_url}
                              alt={activeRecipient.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(activeRecipient.name)
                          )}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                            activeRecipient.is_online ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                          }`}
                        />
                      </div>
                    )}

                    <div>
                      <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                        {activeRecipient.is_channel ? `#${activeRecipient.name}` : activeRecipient.name}
                      </h2>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        {activeRecipient.is_global
                          ? "Public group channel. Messages are automatically deleted after 180 days."
                          : activeRecipient.is_channel
                          ? activeRecipient.description || `${activeRecipient.members_count || 1} members`
                          : activeRecipient.is_online
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </div>

                  {activeRecipient.is_channel && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs px-2.5 font-semibold translate-x-2"
                      onClick={() => setIsChannelSettingsOpen(true)}
                      icon={<Settings className="h-4 w-4" />}
                    >
                      Settings
                    </Button>
                  )}
                </div>

                {/* Message Log */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                  {loading ? (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                      Loading message history...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center mb-3">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        No messages yet
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                        Start the conversation by sending a message below!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender_id === user?.id;
                      const isEditingThis = editingMsgId === msg.id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-3 max-w-[85%] group ${
                            isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                          }`}
                        >
                          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs">
                            {msg.sender_avatar ? (
                              <img
                                src={msg.sender_avatar}
                                alt={msg.sender_name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitials(msg.sender_name)
                            )}
                          </div>

                          <div
                            className={`flex flex-col space-y-1 ${
                              isMe ? "items-end" : "items-start"
                            }`}
                          >
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                              <span className="font-semibold text-slate-600 dark:text-slate-400">
                                {isMe ? "You" : msg.sender_name}
                              </span>
                              <span>•</span>
                              <span>{formatTime(msg.created_at)}</span>
                              {msg.is_edited && (
                                <span className="text-[9px] font-semibold text-slate-400 italic">
                                  (edited)
                                </span>
                              )}
                            </div>

                            {/* Message Content or Edit Input */}
                            {isEditingThis ? (
                              <div className="flex flex-col gap-2 w-full min-w-[200px] bg-slate-100 dark:bg-slate-800 p-2 rounded-xl border border-indigo-300 dark:border-indigo-700">
                                <Input
                                  id={`edit-input-${msg.id}`}
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="text-xs h-8 bg-white dark:bg-slate-900"
                                  autoFocus
                                />
                                <div className="flex items-center justify-end gap-1.5">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 text-[10px] px-2 py-0"
                                    onClick={handleCancelEdit}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    className="h-6 text-[10px] px-2 py-0 bg-indigo-600"
                                    onClick={() => handleSaveEdit(msg.id)}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="relative group/bubble flex items-center gap-1.5">
                                {/* Hover Action Buttons */}
                                {(isMe || (activeRecipient.is_channel && (activeRecipient.my_role === "owner" || activeRecipient.my_role === "admin"))) && (
                                  <div className="opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1">
                                    {isMe && (
                                      <button
                                        onClick={() => handleStartEdit(msg.id, msg.content)}
                                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                      >
                                        <Pencil className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteMsg(msg.id)}
                                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                )}

                                <div
                                  className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed break-words shadow-xs ${
                                    isMe
                                      ? "bg-indigo-600 text-white rounded-tr-none"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60"
                                  }`}
                                >
                                  {msg.content}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Channel Protection Guard & Input Box */}
                {!activeRecipient.is_global && !activeRecipient.is_channel && activeRecipient.connection_status !== "accepted" ? (
                  <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-center space-y-2">
                    {activeRecipient.connection_status === "pending_sent" ? (
                      <div className="flex flex-col items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                        <Clock className="h-5 w-5 animate-pulse" />
                        <span className="font-bold">Chat Request Sent</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Waiting for {activeRecipient.name} to accept your request before sending messages.
                        </p>
                      </div>
                    ) : activeRecipient.connection_status === "pending_received" && incomingReqForActive ? (
                      <div className="flex flex-col items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                          <MessageSquare className="h-5 w-5" />
                          <span>{activeRecipient.name} wants to start a private chat with you!</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            size="sm"
                            variant="primary"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleRespondRequestClick(incomingReqForActive.id, "accept")}
                            icon={<Check className="h-4 w-4" />}
                          >
                            Accept Chat Request
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-rose-500 border-rose-200 hover:bg-rose-50"
                            onClick={() => handleRespondRequestClick(incomingReqForActive.id, "decline")}
                            icon={<X className="h-4 w-4" />}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
                          <ShieldAlert className="h-5 w-5 text-indigo-500" />
                          <span>Private chat connection required</span>
                        </div>
                        <p className="text-[11px] text-slate-400 max-w-sm">
                          Send a chat request to {activeRecipient.name}. Once accepted, you can exchange private messages!
                        </p>
                        <Button
                          size="sm"
                          variant="primary"
                          loading={isSendingReq === activeRecipient.id}
                          onClick={() => handleSendRequestClick(activeRecipient.id)}
                          icon={<UserPlus className="h-4 w-4" />}
                        >
                          Send Chat Request
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form
                    onSubmit={handleSend}
                    className="p-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 bg-slate-50/40 dark:bg-slate-900/40"
                  >
                    <Input
                      id="chat-message-input"
                      placeholder={`Message ${activeRecipient.name}...`}
                      value={inputContent}
                      onChange={(e) => setInputContent(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 text-xs h-10"
                      autoComplete="off"
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={!inputContent.trim() || !connected}
                      icon={<Send className="h-4 w-4" />}
                      className="h-10 px-4"
                    >
                      Send
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>

      {/* Delete Message Confirmation Modal */}
      <ConfirmModal
        isOpen={!!msgToDeleteId}
        onClose={() => setMsgToDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete Message"
        cancelText="Cancel"
        isLoading={isDeletingMsg}
        variant="danger"
      />

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
      />

      {/* Channel Settings & Admin Modal */}
      {isChannelSettingsOpen && activeRecipient.is_channel && (
        <ChannelSettingsModal
          isOpen={isChannelSettingsOpen}
          onClose={() => setIsChannelSettingsOpen(false)}
          channelId={activeRecipient.id}
        />
      )}
    </ProtectedRoute>
  );
}
