"use client";

import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({ children, variant = "default", className = "", ...props }: BadgeProps) {
  const styles = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60",
    success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 dark:bg-emerald-500/15 shadow-xs shadow-emerald-500/5",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:bg-amber-500/15 shadow-xs shadow-amber-500/5",
    danger: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 dark:bg-rose-500/15 shadow-xs shadow-rose-500/5",
    info: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 dark:bg-indigo-500/15 shadow-xs shadow-indigo-500/5",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide transition-colors ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
