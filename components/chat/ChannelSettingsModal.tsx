"use client";

import React, { useEffect, useState } from "react";
import { X, Settings, Users, Shield, UserPlus, Trash2, Check, UserMinus, Image, Hash, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { AvatarPicker } from "../ui/AvatarPicker";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { useChatStore } from "../../store/chatStore";
import { channelService } from "../../services/channel";
import { ChannelMember, ChatUser } from "../../types/chat";
import { useAuthStore } from "../../store/authStore";

interface ChannelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
}

export function ChannelSettingsModal({ isOpen, onClose, channelId }: ChannelSettingsModalProps) {
  useLockBodyScroll(isOpen);

  const { user: currentUser } = useAuthStore();
  const { channels, users, updateChannel, deleteChannel } = useChatStore();
  const channel = channels.find((c) => c.id === channelId);

  const [activeTab, setActiveTab] = useState<"general" | "members">("general");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Members state
  const [members, setMembers] = useState<ChannelMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (channel) {
      setName(channel.name);
      setDescription(channel.description || "");
      setAvatarUrl(channel.avatar_url || "");
    }
  }, [channel]);

  useEffect(() => {
    if (isOpen && channelId) {
      loadMembers();
    }
  }, [isOpen, channelId]);

  const loadMembers = async () => {
    setLoadingMembers(true);
    try {
      const data = await channelService.getChannelMembers(channelId);
      setMembers(data);
    } catch (err) {
      console.error("Failed to load channel members", err);
    } finally {
      setLoadingMembers(false);
    }
  };

  if (!isOpen || !channel) return null;

  const isAdminOrOwner = channel.my_role === "owner" || channel.my_role === "admin";
  const isOwner = channel.my_role === "owner";

  const handleNameChange = (val: string) => {
    setName(val);
    if (val.trim().length === 0) {
      setNameError("");
    } else if (val.length > 50) {
      setNameError("Channel name cannot exceed 50 characters");
    } else {
      setNameError("");
    }
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    if (val.length > 250) {
      setDescriptionError("Description cannot exceed 250 characters");
    } else {
      setDescriptionError("");
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError("Channel name is required");
      return;
    }

    if (trimmedName.length > 50) {
      setNameError("Channel name cannot exceed 50 characters");
      return;
    }

    if (description.length > 250) {
      setDescriptionError("Description cannot exceed 250 characters");
      return;
    }

    setIsSaving(true);
    try {
      await updateChannel(channelId, {
        name: trimmedName,
        description: description.trim(),
        avatar_url: avatarUrl.trim(),
      });
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail;
      const msg = typeof errorDetail === "string" ? errorDetail : "Failed to update channel";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const [manualUsername, setManualUsername] = useState("");

  const handleAddMember = async () => {
    const targetUsername = manualUsername.trim();
    if (!selectedUserToAdd && !targetUsername) return;

    setIsAddingMember(true);
    try {
      if (targetUsername) {
        await channelService.addMember(channelId, { username: targetUsername });
        toast.success(`Invitation sent to @${targetUsername}!`);
      } else if (selectedUserToAdd) {
        const targetUserObj = users.find((u) => u.id === selectedUserToAdd);
        await channelService.addMember(channelId, { user_id: selectedUserToAdd });
        toast.success(`Invitation sent to ${targetUserObj?.username || "user"}!`);
      }
      setSelectedUserToAdd("");
      setManualUsername("");
      await loadMembers();
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to send invitation";
      toast.error(msg);
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId: string, username: string) => {
    try {
      await channelService.removeMember(channelId, userId);
      toast.success(`${username} removed from channel`);
      await loadMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to remove member");
    }
  };

  const handleToggleAdminRole = async (member: ChannelMember) => {
    const newRole = member.role === "admin" ? "member" : "admin";
    try {
      await channelService.updateMemberRole(channelId, member.user_id, newRole);
      toast.success(`${member.username} is now ${newRole === "admin" ? "an Admin" : "a Member"}`);
      await loadMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to update role");
    }
  };

  const handleDeleteChannelConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteChannel(channelId);
      toast.success("Channel deleted");
      onClose();
    } catch (err) {
      toast.error("Failed to delete channel");
    } finally {
      setIsDeleting(false);
      setConfirmDeleteOpen(false);
    }
  };

  // Available users to add (not already members)
  const availableUsersToAdd = users.filter(
    (u) => !members.some((m) => m.user_id === u.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black overflow-hidden flex-shrink-0">
              {channel.avatar_url ? (
                <img src={channel.avatar_url} alt={channel.name} className="h-full w-full object-cover" />
              ) : (
                <Hash className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                #{channel.name}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {channel.my_role}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage channel settings and members</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 gap-6 flex-shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("general")}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "general"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Settings className="h-4 w-4" /> General Settings
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "members"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Users className="h-4 w-4" /> Members ({members.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === "general" && (
            <form onSubmit={handleSaveGeneral} className="space-y-4">
              <AvatarPicker
                value={avatarUrl}
                onChange={setAvatarUrl}
                fallbackText={name || "CH"}
                label="Channel Avatar"
                shape="rounded"
              />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Channel Name
                  </label>
                  <span className={`text-[10px] font-semibold ${name.length > 50 ? "text-rose-500 font-bold" : "text-slate-400"}`}>
                    {name.length}/50
                  </span>
                </div>
                <Input
                  id="edit-channel-name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  disabled={!isAdminOrOwner}
                  error={nameError}
                  icon={<Hash className="h-4 w-4 text-slate-400" />}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Description
                  </label>
                  <span className={`text-[10px] font-semibold ${description.length > 250 ? "text-rose-500 font-bold" : "text-slate-400"}`}>
                    {description.length}/250
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  disabled={!isAdminOrOwner}
                  className={`w-full px-3 py-2 text-xs rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 transition-colors resize-none disabled:opacity-60 ${
                    descriptionError
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-200 dark:border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                />
                {descriptionError && (
                  <p className="mt-1 text-[10px] text-rose-500 font-semibold">{descriptionError}</p>
                )}
              </div>

              {isAdminOrOwner && (
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" loading={isSaving}>
                    Save Changes
                  </Button>
                </div>
              )}

              {isOwner && (
                <div className="mt-8 pt-4 border-t border-rose-100 dark:border-rose-950/40">
                  <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">
                    Danger Zone
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Deleting the channel will permanently remove all member access and channel message history.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/40 text-xs font-bold"
                    onClick={() => setConfirmDeleteOpen(true)}
                    icon={<Trash2 className="h-3.5 w-3.5" />}
                  >
                    Delete Channel
                  </Button>
                </div>
              )}
            </form>
          )}

          {activeTab === "members" && (
            <div className="space-y-4">
              {/* Invite Member Bar (Admin Only) */}
              {isAdminOrOwner && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Invite User to Channel
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      User receives an invitation request
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Input
                      id="manual-username-input"
                      placeholder="Type username manually..."
                      value={manualUsername}
                      onChange={(e) => {
                        setManualUsername(e.target.value);
                        if (e.target.value) setSelectedUserToAdd("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddMember();
                        }
                      }}
                      className="text-xs h-9"
                    />

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Select
                          value={selectedUserToAdd}
                          options={availableUsersToAdd.map((u) => ({
                            value: u.id,
                            label: u.username,
                          }))}
                          onChange={(val) => {
                            setSelectedUserToAdd(String(val));
                            setManualUsername("");
                          }}
                          placeholder="Or pick connected user..."
                          disabled={!!manualUsername.trim()}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        className="h-10 px-4 text-xs font-semibold shrink-0"
                        disabled={!selectedUserToAdd && !manualUsername.trim()}
                        loading={isAddingMember}
                        onClick={handleAddMember}
                        icon={<UserPlus className="h-4 w-4" />}
                      >
                        Send Invite
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Members List */}
              <div className="space-y-2">
                {loadingMembers ? (
                  <p className="text-xs text-slate-400 italic">Loading members...</p>
                ) : (
                  members.map((m) => {
                    const isSelf = m.user_id === currentUser?.id;
                    const canManage = isAdminOrOwner && m.role !== "owner" && !isSelf;

                    return (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs overflow-hidden">
                            {m.avatar_url ? (
                              <img src={m.avatar_url} alt={m.username} className="h-full w-full object-cover" />
                            ) : (
                              m.username.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                              {m.username} {isSelf && <span className="text-[10px] text-slate-400">(You)</span>}
                            </span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-extrabold uppercase ${
                                  m.role === "owner"
                                    ? "text-amber-500"
                                    : m.role === "admin"
                                    ? "text-indigo-500"
                                    : "text-slate-400"
                                }`}
                              >
                                {m.role}
                              </span>
                              {m.status === "pending" && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                  Pending Invite
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {canManage && (
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className={`h-7 text-[10px] py-0 px-2 font-semibold ${
                                m.role === "admin"
                                  ? "text-amber-600 border-amber-200 dark:border-amber-900/50"
                                  : "text-indigo-600 border-indigo-200 dark:border-indigo-900/50"
                              }`}
                              onClick={() => handleToggleAdminRole(m)}
                              icon={<Shield className="h-3 w-3" />}
                            >
                              {m.role === "admin" ? "Demote" : "Make Admin"}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-[10px] py-0 px-2 text-rose-500 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50"
                              onClick={() => handleRemoveMember(m.user_id, m.username)}
                              icon={<UserMinus className="h-3 w-3" />}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Channel Modal */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Delete Channel #{channel.name}?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This action cannot be undone. All messages and member history will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-rose-600 hover:bg-rose-700 text-white"
                loading={isDeleting}
                onClick={handleDeleteChannelConfirm}
              >
                Delete Channel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
