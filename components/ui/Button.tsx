"use client";

import React, { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 focus:ring-indigo-500 hover:-translate-y-0.5",
    secondary:
      "bg-slate-200/80 hover:bg-slate-300/80 text-slate-800 focus:ring-slate-400 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:text-slate-100 hover:-translate-y-0.5",
    danger:
      "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 focus:ring-rose-500 hover:-translate-y-0.5",
    outline:
      "border border-slate-300/80 hover:bg-slate-100/60 text-slate-700 focus:ring-indigo-500 dark:border-slate-700 dark:hover:bg-slate-800/60 dark:text-slate-200 hover:-translate-y-0.5 backdrop-blur-xs",
    ghost:
      "hover:bg-slate-100/80 text-slate-600 focus:ring-slate-400 dark:hover:bg-slate-800/80 dark:text-slate-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        icon && <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">{icon}</span>
      )}
      {children}
    </button>
  );
}
