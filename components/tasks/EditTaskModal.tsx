"use client";

import React, { useState, useEffect } from "react";
import { Task } from "../../types/task";
import { useTaskStore } from "../../store/taskStore";
import { getTaskFields } from "../../lib/taskHelpers";
import { X, Calendar, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Checkbox } from "../ui/Checkbox";

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditTaskModal({ task, isOpen, onClose }: EditTaskModalProps) {
  const { updateTask } = useTaskStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<number>(5);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPriorityText = (val: number) => {
    if (val <= 3) return "Low 🟢";
    if (val >= 8) return "High 🔴";
    return "Medium 🟡";
  };

  // Initialize values when task changes or modal opens
  useEffect(() => {
    if (task) {
      const parsed = getTaskFields(task);
      setTitle(parsed.title);
      setDescription(parsed.description || "");
      setPriority(task.priority);
      setDueDate(parsed.dueDate || "");
      setCompleted(task.completed);
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

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
      await updateTask(
        task.id,
        title.trim(),
        priority,
        completed,
        description.trim() || undefined,
        dueDate || undefined
      );
      toast.success("Task updated successfully");
      onClose();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to update task");
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
            Edit Task
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
              id="edit-task-title"
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
            {/* Priority */}
            <div className="relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Priority
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/30 px-4 py-2 text-sm text-slate-800 outline-none transition-all hover:bg-slate-50 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950 cursor-pointer"
                >
                  <span>{priority} - {getPriorityText(priority)}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {isPriorityOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsPriorityOpen(false)} 
                    />
                    <div className="absolute left-0 z-20 mt-1 w-full rounded-b-xl bg-white shadow-xl dark:bg-slate-900 overflow-hidden max-h-60 overflow-y-auto border-none outline-none">
                      {[...Array(10)].map((_, i) => {
                        const val = i + 1;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              setPriority(val);
                              setIsPriorityOpen(false);
                            }}
                            className={`flex w-full items-center px-4 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                              priority === val 
                                ? "bg-indigo-50/50 text-indigo-600 font-semibold dark:bg-indigo-950/30 dark:text-indigo-400" 
                                : "text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {val} - {getPriorityText(val)}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
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

          {/* Status (Completed) */}
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="edit-task-completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <label 
              htmlFor="edit-task-completed" 
              className="text-sm font-semibold text-slate-700 dark:text-slate-350 cursor-pointer select-none"
            >
              Mark as completed
            </label>
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
