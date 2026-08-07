"use client";

import React, { useState } from "react";
import axios from "axios";
import { X, Hash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { AvatarPicker } from "../ui/AvatarPicker";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { useChatStore } from "../../store/chatStore";

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateChannelModal({ isOpen, onClose }: CreateChannelModalProps) {
  useLockBodyScroll(isOpen);

  const { createChannel, setActiveRecipient } = useChatStore();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setName("");
    setNameError("");
    setDescription("");
    setDescriptionError("");
    setAvatarUrl("");
    onClose();
  };

  const handleNameChange = (val: string) => {
    const truncated = val.slice(0, 50);
    setName(truncated);
    setNameError("");
  };

  const handleDescriptionChange = (val: string) => {
    const truncated = val.slice(0, 250);
    setDescription(truncated);
    setDescriptionError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError("Channel name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const newChannel = await createChannel({
        name: trimmedName,
        description: description.trim() || undefined,
        avatar_url: avatarUrl.trim() || undefined,
      });

      if (newChannel) {
        setActiveRecipient({
          id: newChannel.id,
          name: newChannel.name,
          avatar_url: newChannel.avatar_url,
          description: newChannel.description,
          is_channel: true,
          my_role: "owner",
          members_count: 1,
        });
      }

      handleClose();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.detail : "Failed to create channel";
      toast.error(typeof msg === "string" ? msg : "Failed to create channel");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Create New Channel</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Start a new space for group discussion</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Avatar Image Picker */}
          <AvatarPicker
            value={avatarUrl}
            onChange={setAvatarUrl}
            fallbackText={name || "CH"}
            label="Channel Avatar"
            shape="rounded"
          />

          {/* Channel Name */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Channel Name *
              </label>
              <span className={`text-[10px] font-semibold ${name.length >= 50 ? "text-amber-500 font-bold" : "text-slate-400"}`}>
                {name.length}/50
              </span>
            </div>
            <Input
              id="channel-name"
              placeholder="e.g. Design Team, Announcements"
              value={name}
              maxLength={50}
              onChange={(e) => handleNameChange(e.target.value)}
              error={nameError}
              icon={<Hash className="h-4 w-4 text-slate-400" />}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Description (Optional)
              </label>
              <span className={`text-[10px] font-semibold ${description.length >= 250 ? "text-amber-500 font-bold" : "text-slate-400"}`}>
                {description.length}/250
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="What is this channel about?"
              value={description}
              maxLength={250}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 transition-colors resize-none ${
                descriptionError
                  ? "border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 dark:border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500"
              }`}
            />
            {descriptionError && (
              <p className="mt-1 text-[10px] text-rose-500 font-semibold">{descriptionError}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={!!nameError || !!descriptionError || !name.trim()}
            >
              Create Channel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
