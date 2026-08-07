"use client";

import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  styleType?: "filled" | "outlined" | "soft";
}

export function Badge({
  children,
  variant = "default",
  styleType = "soft",
  className = "",
  ...props
}: BadgeProps) {
  const softStyles = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60",
    success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20",
    info: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20",
  };

  const filledStyles = {
    default: "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-xs font-black",
    success: "bg-emerald-600 text-white shadow-xs font-black",
    warning: "bg-amber-600 text-white shadow-xs font-black",
    danger: "bg-rose-600 text-white shadow-xs font-black",
    info: "bg-indigo-600 text-white shadow-xs font-black",
  };

  const outlinedStyles = {
    default: "bg-transparent text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold",
    success: "bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold",
    warning: "bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/40 font-bold",
    danger: "bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/40 font-bold",
    info: "bg-transparent text-indigo-600 dark:text-indigo-400 border border-indigo-500/40 font-bold",
  };

  const selectedStyles =
    styleType === "filled"
      ? filledStyles[variant]
      : styleType === "outlined"
      ? outlinedStyles[variant]
      : softStyles[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide transition-all ${selectedStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
