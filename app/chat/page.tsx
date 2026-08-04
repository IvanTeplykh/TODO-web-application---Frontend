"use client";

import React, { useEffect, useState, useRef } from "react";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Navbar } from "../../components/layout/Navbar";
import { Sidebar } from "../../components/layout/Sidebar";
import { Footer } from "../../components/layout/Footer";
import { useAuthStore } from "../../store/authStore";
import { useChatStore, DEFAULT_RECIPIENT } from "../../store/chatStore";
import { ChatUser, ChatRecipient } from "../../types/chat";
import { MessageSquare, Send, Users, Search, Circle, User as UserIcon, Hash, Loader2 } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function ChatPage() {
  const { user } = useAuthStore();
  const {
    users,
    activeRecipient,
    messages,
    unreadCounts,
    loading,
    connected,
    fetchUsers,
    fetchMessages,
    setActiveRecipient,
    sendMessage,
    connectWS,
    disconnectWS,
  } = useChatStore();

  const [inputContent, setInputContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
    fetchMessages(activeRecipient.id);
    connectWS();

    return () => {
      disconnectWS();
    };
  }, []);

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

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
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
                  Team Chat
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time communication & team collaboration
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    connected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                  }`}
                />
                <span className="text-slate-600 dark:text-slate-300">
                  {connected ? "Connected" : "Reconnecting..."}
                </span>
              </div>
            </div>

            {/* Main Chat Interface Container */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden min-h-0">
              {/* Left Column: Channels & User List */}
              <div className="border-r border-slate-200/80 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/40">
                {/* Search Header */}
                <div className="p-3 border-b border-slate-200/60 dark:border-slate-800">
                  <Input
                    id="chat-user-search"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="h-4 w-4 text-slate-400" />}
                    className="h-9 text-xs"
                  />
                </div>

                {/* Channels & User Items */}
                <div className="flex-1 overflow-y-auto p-2 space-y-3">
                  {/* General Channel Section */}
                  <div>
                    <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Channels
                    </span>
                    <button
                      onClick={() => setActiveRecipient(DEFAULT_RECIPIENT)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors mt-1 ${
                        activeRecipient.id === "global"
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="h-7 w-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                          <Hash className="h-4 w-4" />
                        </div>
                        <span className="truncate">General Channel</span>
                      </div>
                      {unreadCounts["global"] ? (
                        <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {unreadCounts["global"]}
                        </span>
                      ) : null}
                    </button>
                  </div>

                  {/* Direct Messages Section */}
                  <div>
                    <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Direct Messages ({filteredUsers.length})
                    </span>
                    <div className="space-y-1 mt-1">
                      {filteredUsers.map((u) => {
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
                              })
                            }
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                              isSelected
                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              {/* User Avatar & Status indicator */}
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
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Chat Log & Input */}
              <div className="md:col-span-2 lg:col-span-3 flex flex-col min-h-0 bg-white dark:bg-slate-900">
                {/* Active Chat Header */}
                <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
                  <div className="flex items-center gap-3">
                    {activeRecipient.is_global ? (
                      <div className="h-9 w-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        <Hash className="h-5 w-5" />
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
                        {activeRecipient.name}
                      </h2>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        {activeRecipient.is_global
                          ? "Public group channel for all team members"
                          : activeRecipient.is_online
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </div>
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

                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-3 max-w-[85%] ${
                            isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                          }`}
                        >
                          {/* Sender Avatar */}
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

                          {/* Message Content Bubble */}
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
                            </div>

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
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Box */}
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
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
