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
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600",
    secondary:
      "bg-slate-200 hover:bg-slate-300 text-slate-850 focus:ring-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 focus:ring-rose-500 dark:bg-rose-500 dark:hover:bg-rose-600",
    outline:
      "border border-slate-300 hover:bg-slate-55 text-slate-705 focus:ring-indigo-500 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300",
    ghost:
      "hover:bg-slate-100 text-slate-600 focus:ring-slate-400 dark:hover:bg-slate-800 dark:text-slate-400",
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
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
}
