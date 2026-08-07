"use client";

import React from "react";
import { useTaskStore } from "../../store/taskStore";
import { TaskCard } from "./TaskCard";
import { TaskCardSkeleton } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";
import { Task } from "../../types/task";

interface TaskListProps {
  onViewTask: (task: Task) => void;
  onCreateTask?: () => void;
}

export function TaskList({ onViewTask, onCreateTask }: TaskListProps) {
  const { tasks, loading } = useTaskStore();

  if (loading && tasks.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start min-h-[360px]">
        {[1, 2, 3, 4].map((i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks today 🎉"
        description="Enjoy your free time or create a new task to get started with your workflow."
        actionLabel="Create New Task"
        onAction={onCreateTask}
      />
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
