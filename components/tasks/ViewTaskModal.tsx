"use client";

import React, { useState } from "react";
import { Task } from "../../types/task";
import { useTaskStore } from "../../store/taskStore";
import { getTaskFields, formatDate, isOverdue } from "../../lib/taskHelpers";
import { X, Calendar, Clock, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/Button";

import { ConfirmModal } from "../ui/ConfirmModal";

interface ViewTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export function ViewTaskModal({ task, isOpen, onClose, onEdit }: ViewTaskModalProps) {
  const { deleteTask } = useTaskStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!isOpen || !task) return null;

  const { title, description, dueDate } = getTaskFields(task);
  const overdue = isOverdue(dueDate, task.completed);

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Task deleted successfully");
      setIsDeleteConfirmOpen(false);
      onClose();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to delete task");
      setIsDeleteConfirmOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Get priority display details
  let priorityLabel = "Low";
  let priorityColor = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
  let priorityDot = "bg-emerald-500";
  if (task.priority >= 8) {
    priorityLabel = "High";
    priorityColor = "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
    priorityDot = "bg-rose-500";
  } else if (task.priority >= 4) {
    priorityLabel = "Medium";
    priorityColor = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
    priorityDot = "bg-amber-500";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/60">
          <h2 className="text-md font-bold text-slate-800 dark:text-slate-100">
            Task Details
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Title and Priority Badge */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-150 leading-snug break-words">
              {title}
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${priorityColor} flex-shrink-0`}>
              <span className={`h-1.5 w-1.5 rounded-full ${priorityDot}`} />
              {priorityLabel}
            </span>
          </div>

          {/* Description */}
          {description ? (
            <div className="space-y-1.5">
              <span className="block text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Description
              </span>
              <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-100/50 dark:border-slate-800/40">
                {description}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <span className="block text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Description
              </span>
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                No description provided.
              </p>
            </div>
          )}

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
            {/* Status */}
            <div>
              <span className="block text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Status
              </span>
              {task.completed ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Completed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-500">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  In Progress
                </span>
              )}
            </div>

            {/* Due Date */}
            <div>
              <span className="block text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Due Date
              </span>
              {dueDate ? (
                <div className="flex items-center gap-1.5">
                  <Calendar className={`h-4 w-4 ${overdue ? "text-rose-500" : "text-slate-450 dark:text-slate-500"}`} />
                  <span className={`text-sm font-medium ${overdue ? "text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300"}`}>
                    {formatDate(dueDate)}
                  </span>
                  {overdue && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
                      Overdue
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-slate-400 dark:text-slate-500 italic">
                  No due date
                </span>
              )}
            </div>

            {/* Created At */}
            <div>
              <span className="block text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Created
              </span>
              <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>
                  {new Date(task.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>

            {/* Last Updated At */}
            <div>
              <span className="block text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Last Updated
              </span>
              <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>
                  {new Date(task.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
          <Button
            type="button"
            variant="outline"
            className="text-rose-600 border-rose-100 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:border-rose-950/30 dark:hover:bg-rose-950/20"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            icon={<Trash2 className="h-4 w-4" />}
          >
            Delete Task
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => onEdit(task)}
              icon={<Edit2 className="h-4 w-4" />}
            >
              Edit Task
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
