"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Key, Clock, ShieldAlert, UserCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { useTaskStore } from "../../store/taskStore";
import { TaskShareRequest } from "../../types/task";

interface TaskSharesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskSharesModal({ isOpen, onClose }: TaskSharesModalProps) {
  useLockBodyScroll(isOpen);

  const { pendingTaskShares, fetchPendingShares, respondShare } = useTaskStore();
  const [selectedShare, setSelectedShare] = useState<TaskShareRequest | null>(null);
  const [passcode, setPasscode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPendingShares();
    }
  }, [isOpen, fetchPendingShares]);

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedShare(null);
    setPasscode("");
    onClose();
  };

  const handleDecline = async (reqId: string) => {
    try {
      await respondShare(reqId, "", "decline");
      toast.info("Task invitation declined");
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to decline invitation");
    }
  };

  const handleAcceptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShare) return;
    if (!passcode.trim()) {
      toast.error("Please enter the 6-digit passcode");
      return;
    }

    setIsSubmitting(true);
    try {
      await respondShare(selectedShare.id, passcode.trim(), "accept");
      toast.success(`Joined task "${selectedShare.task_title}"!`);
      setSelectedShare(null);
      setPasscode("");
      if (pendingTaskShares.length <= 1) {
        handleClose();
      }
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to accept task share");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Pending Task Invitations ({pendingTaskShares.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tasks shared or transferred to you
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {selectedShare ? (
            <form onSubmit={handleAcceptSubmit} className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2 text-center">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                  Enter 6-Digit Passcode
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enter the passcode provided by <strong className="text-slate-900 dark:text-white">@{selectedShare.owner_username}</strong> to accept "{selectedShare.task_title}".
                </p>
                <div className="pt-2 max-w-xs mx-auto">
                  <Input
                    id="share-passcode-input"
                    placeholder="e.g. 849201"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="text-center text-lg font-mono font-bold tracking-widest h-11"
                    autoFocus
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setSelectedShare(null)}>
                  Back
                </Button>
                <Button type="submit" variant="primary" loading={isSubmitting} disabled={!passcode.trim()}>
                  Confirm Passcode & Join
                </Button>
              </div>
            </form>
          ) : pendingTaskShares.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs italic">
              No pending task invitations right now.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTaskShares.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {req.task_title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Shared by <strong className="text-slate-700 dark:text-slate-300">@{req.owner_username}</strong>
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        req.access_level === "transfer"
                          ? "bg-amber-100 dark:bg-amber-950 text-amber-600 border-amber-200 dark:border-amber-800"
                          : req.access_level === "full_access"
                          ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-600 border-indigo-200 dark:border-indigo-800"
                          : "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 border-emerald-200 dark:border-emerald-800"
                      }`}
                    >
                      {req.access_level === "transfer"
                        ? "Transfer"
                        : req.access_level === "full_access"
                        ? "Full Access"
                        : "Status Only"}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs text-rose-500 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50"
                      onClick={() => handleDecline(req.id)}
                      icon={<X className="h-3.5 w-3.5" />}
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => {
                        setSelectedShare(req);
                        setPasscode("");
                      }}
                      icon={<Key className="h-3.5 w-3.5" />}
                    >
                      Enter Passcode & Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
