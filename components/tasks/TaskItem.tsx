"use client";

import React, { useState } from "react";
import { Task } from "../../types/task";
import { useTaskStore } from "../../store/taskStore";
import { Checkbox } from "../ui/Checkbox";
import { Trash2, Edit3, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTaskStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsToggling(true);
    try {
      await toggleTask(task.id, e.target.checked);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to toggle task status");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to delete task");
      setIsDeleting(false);
    }
  };

  let priorityBg = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
  if (task.priority >= 8) {
    priorityBg = "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
  } else if (task.priority >= 4) {
    priorityBg = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
  }

  return (
    <div className={`grid grid-cols-12 gap-4 items-center px-6 py-4 transition-all duration-200 ${
      task.completed 
        ? "bg-slate-50/30 opacity-70" 
        : "hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
    }`}>
      <div className="col-span-6 md:col-span-8 flex items-center gap-3 min-w-0">
        <Checkbox
          checked={task.completed}
          disabled={isToggling}
          onChange={handleToggle}
          className="flex-shrink-0"
        />
        <div className="flex flex-col min-w-0">
          <span className={`text-sm font-semibold text-slate-700 dark:text-slate-100 truncate ${
            task.completed ? "line-through text-slate-400 dark:text-slate-500 font-normal" : ""
          }`}>
            {task.title}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-300">
            {new Date(task.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="col-span-2 md:col-span-1 flex justify-center">
        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold border ${priorityBg}`}>
          {task.priority}
        </span>
      </div>

      <div className="col-span-2 md:col-span-2 flex justify-center">
        {task.completed ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Done
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-500">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Undone
          </span>
        )}
      </div>

      <div className="col-span-2 md:col-span-1 flex items-center justify-end gap-1">
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-405 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/20 transition-all"
            title="Edit Task"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1.5 rounded-lg text-slate-405 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/20 transition-all"
          title="Delete Task"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
