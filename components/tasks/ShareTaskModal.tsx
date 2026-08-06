"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Share2, Copy, Check, UserCheck, Key, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { useTaskStore } from "../../store/taskStore";
import { usersService } from "../../services/users";
import { User } from "../../types/auth";

interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
}

export function ShareTaskModal({ isOpen, onClose, taskId, taskTitle }: ShareTaskModalProps) {
  useLockBodyScroll(isOpen);

  const { shareTask } = useTaskStore();

  const [targetUsername, setTargetUsername] = useState("");
  const [accessLevel, setAccessLevel] = useState<"transfer" | "status_only" | "full_access">("status_only");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPasscode, setGeneratedPasscode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // User search autocomplete state
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = async (val: string) => {
    setTargetUsername(val);
    if (!val.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await usersService.searchUsers(val);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } catch (err) {
      console.error("Failed to search users", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (username: string) => {
    setTargetUsername(username);
    setShowDropdown(false);
  };

  if (!isOpen) return null;

  const handleClose = () => {
    setTargetUsername("");
    setAccessLevel("status_only");
    setGeneratedPasscode(null);
    setCopied(false);
    setSearchResults([]);
    setShowDropdown(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = targetUsername.trim();
    if (!username) {
      toast.error("Please enter target username");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await shareTask(taskId, username, accessLevel);
      if (res.passcode) {
        setGeneratedPasscode(res.passcode);
        toast.success("Share request created! Share the 6-digit passcode with the recipient.");
      }
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to create share request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPasscode = () => {
    if (!generatedPasscode) return;
    navigator.clipboard.writeText(generatedPasscode);
    setCopied(true);
    toast.success("Passcode copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-visible">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Share Task</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">&quot;{taskTitle}&quot;</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {generatedPasscode ? (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                  Security Passcode Generated
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Share this 6-digit passcode with <strong className="text-slate-900 dark:text-white">@{targetUsername}</strong> so they can accept the task.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-indigo-300 dark:border-indigo-700 text-2xl font-mono font-black tracking-widest text-indigo-600 dark:text-indigo-400 shadow-inner">
                    {generatedPasscode}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-11 px-3"
                    onClick={handleCopyPasscode}
                    icon={copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  >
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <Button variant="primary" className="w-full" onClick={handleClose}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Target Username with Search Suggestions */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Username *
                </label>
                <div className="relative">
                  <Input
                    id="share-target-username"
                    placeholder="Search or enter recipient username..."
                    value={targetUsername}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setShowDropdown(true);
                    }}
                    required
                    autoFocus
                    autoComplete="off"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-2.5 text-slate-400">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                    </div>
                  )}
                </div>

                {/* Autocomplete Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto py-1 animate-in fade-in zoom-in duration-150">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      Matching users
                    </div>
                    {searchResults.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleSelectUser(u.username)}
                        className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt={u.username} className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-150 block truncate">
                              @{u.username}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Access Level Option Cards */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Select Access Type *
                </label>
                <div className="space-y-2">
                  {/* Status Only */}
                  <label
                    onClick={() => setAccessLevel("status_only")}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      accessLevel === "status_only"
                        ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mt-0.5">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        Collaborator Access
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        Recipient can view details and toggle completion status, but cannot edit text or delete.
                      </p>
                    </div>
                  </label>

                  {/* Full Access */}
                  <label
                    onClick={() => setAccessLevel("full_access")}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      accessLevel === "full_access"
                        ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mt-0.5">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        Co-Owner
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        Shared control to edit text, priority, due date, and completion status.
                      </p>
                    </div>
                  </label>

                  {/* Transfer Ownership */}
                  <label
                    onClick={() => setAccessLevel("transfer")}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      accessLevel === "transfer"
                        ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-1 ring-amber-500"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mt-0.5">
                      <RefreshCw className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-700 dark:text-amber-400">
                        Transfer Ownership
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        Completely transfers task ownership to recipient once accepted.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  disabled={!targetUsername.trim()}
                  icon={<Key className="h-4 w-4" />}
                >
                  Generate Passcode & Send
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
