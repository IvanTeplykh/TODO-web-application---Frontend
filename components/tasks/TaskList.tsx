"use client";

import React from "react";
import { useTaskStore } from "../../store/taskStore";
import { TaskCard } from "./TaskCard";
import { Spinner } from "../ui/Spinner";
import { FolderOpen } from "lucide-react";
import { Task } from "../../types/task";

interface TaskListProps {
  onViewTask: (task: Task) => void;
}

export function TaskList({ onViewTask }: TaskListProps) {
  const { tasks, loading } = useTaskStore();

  if (loading && tasks.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start min-h-[360px]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[160px] rounded-2xl border border-slate-200/50 bg-slate-100/50 dark:border-slate-800/60 dark:bg-slate-900/40 animate-pulse p-5"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50/20 dark:bg-slate-900/5 min-h-[360px]">
        <FolderOpen className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">No tasks found</h3>
        <p className="text-xs text-slate-400 dark:text-slate-400 max-w-xs mt-1">
          Create a new task to start organizing your workspace!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start min-h-[360px]">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onView={onViewTask} />
      ))}
    </div>
  );
}
