"use client";

import React, { useEffect, useState } from "react";
import { X, History, Clock, User, CheckCircle2, Pencil, Share2, RefreshCw, UserMinus } from "lucide-react";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { tasksService } from "../../services/tasks";
import { TaskHistoryItem } from "../../types/task";

interface TaskHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
}

export function TaskHistoryModal({ isOpen, onClose, taskId, taskTitle }: TaskHistoryModalProps) {
  useLockBodyScroll(isOpen);

  const [history, setHistory] = useState<TaskHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && taskId) {
      loadHistory();
    }
  }, [isOpen, taskId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await tasksService.getHistory(taskId);
      setHistory(data);
    } catch (err) {
      console.error("Failed to load task history", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <Clock className="h-4 w-4 text-emerald-500" />;
      case "status_changed":
        return <CheckCircle2 className="h-4 w-4 text-indigo-500" />;
      case "updated":
        return <Pencil className="h-4 w-4 text-cyan-500" />;
      case "share_requested":
        return <Share2 className="h-4 w-4 text-amber-500" />;
      case "ownership_transferred":
        return <RefreshCw className="h-4 w-4 text-amber-600" />;
      case "collaborator_removed":
        return <UserMinus className="h-4 w-4 text-rose-500" />;
      default:
        return <History className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Global Task History</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px]">"{taskTitle}"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Audit Log Timeline */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <p className="text-xs text-slate-400 italic text-center py-6">Loading audit log history...</p>
          ) : history.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-6">No history records found for this task.</p>
          ) : (
            <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 space-y-6">
              {history.map((item) => (
                <div key={item.id} className="relative pl-6">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[17px] top-0.5 p-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    {getActionIcon(item.action)}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        @{item.actor_name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      {item.details || item.action}
                    </p>
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
