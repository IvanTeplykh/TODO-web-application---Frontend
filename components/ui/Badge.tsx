"use client";

import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({ children, variant = "default", className = "", ...props }: BadgeProps) {
  const styles = {
    default: "bg-slate-100 text-slate-850 dark:bg-slate-800 dark:text-slate-200",
    success: "bg-emerald-50 text-emerald-705 border border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    warning: "bg-amber-55 text-amber-705 border border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    danger: "bg-rose-50 text-rose-705 border border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    info: "bg-indigo-50 text-indigo-705 border border-indigo-200/50 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
