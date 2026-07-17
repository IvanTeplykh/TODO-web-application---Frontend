"use client";

import React, { useState } from "react";
import { useTaskStore } from "../../store/taskStore";
import { X, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const { createTask } = useTaskStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<number>(5); // Default is Medium (5)
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    if (title.trim().length > 100) {
      toast.error("Task title cannot exceed 100 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTask(
        title.trim(),
        priority,
        description.trim() || undefined,
        dueDate || undefined
      );
      toast.success("Task created successfully");
      
      // Reset form
      setTitle("");
      setDescription("");
      setPriority(5);
      setDueDate("");
      
      onClose();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/60">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Create New Task
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Title <span className="text-rose-500">*</span>
              </label>
              <span className={`text-[10px] ${title.length > 90 ? "text-amber-500 font-bold" : "text-slate-400"}`}>
                {title.length}/100
              </span>
            </div>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done? (max 100 chars)"
              required
              maxLength={100}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              rows={3}
              maxLength={500}
              className="w-full rounded-xl border border-slate-200/80 bg-slate-50/30 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
            />
            <div className="flex justify-end text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              {description.length}/500
            </div>
          </div>

          {/* Priority and Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Priority
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPriority(3)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                    priority <= 3
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400"
                      : "bg-white border-slate-200/85 text-slate-600 hover:bg-slate-50 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => setPriority(5)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                    priority > 3 && priority < 8
                      ? "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400"
                      : "bg-white border-slate-200/85 text-slate-600 hover:bg-slate-50 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => setPriority(9)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                    priority >= 8
                      ? "bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400"
                      : "bg-white border-slate-200/85 text-slate-600 hover:bg-slate-50 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  High
                </button>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Due Date
              </label>
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/30 pl-4 pr-10 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950 [color-scheme:light] dark:[color-scheme:dark]"
                />
                <Calendar className="absolute right-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
            >
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
