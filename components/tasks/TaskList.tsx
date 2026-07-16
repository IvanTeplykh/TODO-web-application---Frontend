"use client";

import React from "react";
import { useTaskStore } from "../../store/taskStore";
import { TaskItem } from "./TaskItem";
import { Spinner } from "../ui/Spinner";
import { FolderOpen } from "lucide-react";
import { Task } from "../../types/task";

interface TaskListProps {
  onEditTask?: (task: Task) => void;
}

export function TaskList({ onEditTask }: TaskListProps) {
  const { tasks, loading } = useTaskStore();

  if (loading && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Spinner size="md" />
        <span className="text-sm text-slate-500 dark:text-slate-400">Loading your tasks...</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10">
        <FolderOpen className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No tasks found</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
          Create a task above to start organizing your schedule!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/80 dark:bg-slate-900/50 shadow-sm overflow-hidden flex flex-col">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 text-2xs font-bold text-slate-400 uppercase tracking-wider">
        <div className="col-span-6 md:col-span-8">Task</div>
        <div className="col-span-2 text-center md:col-span-1">Priority</div>
        <div className="col-span-2 text-center md:col-span-2">Status</div>
        <div className="col-span-2 text-right md:col-span-1">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  );
}
