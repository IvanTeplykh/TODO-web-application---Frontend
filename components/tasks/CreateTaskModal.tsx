"use client";

import React, { useState } from "react";
import { useTaskStore } from "../../store/taskStore";
import { X, Calendar, AlertCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { DatePicker } from "../ui/DatePicker";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitOverride?: (taskData: { title: string; priority: number; description?: string; dueDate?: string }) => void;
}

export function CreateTaskModal({ isOpen, onClose, onSubmitOverride }: CreateTaskModalProps) {
  useLockBodyScroll(isOpen);

  const { createTask } = useTaskStore();
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<number>(5); // Default is Medium (5)
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setTitle("");
    setTitleError("");
    setDescription("");
    setPriority(5);
    setDueDate("");
    onClose();
  };

  const getPriorityText = (val: number) => {
    if (val <= 3) return "Low 🟢";
    if (val >= 8) return "High 🔴";
    return "Medium 🟡";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError("Task title is required");
      return;
    }
    if (title.trim().length > 100) {
      setTitleError("Task title cannot exceed 100 characters");
      return;
    }

    if (onSubmitOverride) {
      onSubmitOverride({
        title: title.trim(),
        priority,
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
      });
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
      handleClose();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl max-w-lg md:max-w-2xl w-full overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/60">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Create New Task
          </h2>
          <button 
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col p-6 space-y-5 overflow-y-auto max-h-[90vh]">
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
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError("");
              }}
              placeholder="What needs to be done? (max 100 chars)"
              maxLength={100}
              error={titleError}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Description (optional)
              </label>
              <span className={`text-[10px] ${description.length > 450 ? "text-amber-500 font-bold" : "text-slate-400"}`}>
                {description.length}/500
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              rows={5}
              maxLength={500}
              className="w-full resize-none rounded-xl border border-slate-200/80 bg-slate-50/30 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
            />
          </div>

          {/* Priority and Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority selection */}
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
                    <div className="absolute left-0 z-20 mt-1 w-full rounded-xl bg-white shadow-xl dark:bg-slate-900 overflow-hidden max-h-[108px] overflow-y-auto border border-slate-100 dark:border-slate-800 outline-none">
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
              <DatePicker
                value={dueDate}
                onChange={(val) => setDueDate(val)}
                className="w-full"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
