"use client";

import React from "react";
import { Button } from "./Button";
import { Plus, Sparkles } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No tasks today 🎉",
  description = "Enjoy your free time or create a new task to get started.",
  actionLabel = "Create Task",
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="glass-card rounded-3xl p-10 text-center flex flex-col items-center justify-center border border-dashed border-slate-300/80 dark:border-slate-800/80 max-w-md mx-auto my-8 space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-xs">
        {icon || <Sparkles className="h-8 w-8 text-indigo-500" />}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="md"
          className="rounded-2xl font-bold gap-2 mt-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          icon={<Plus className="h-4 w-4" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
