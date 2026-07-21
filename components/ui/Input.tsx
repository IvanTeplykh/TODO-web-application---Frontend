"use client";

import React, { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className = "", id, type, ...props }, ref) => {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-400">
              {icon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            type={inputType}
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 transition-all duration-200 outline-none placeholder:text-slate-400 focus:ring-2 dark:text-white dark:placeholder:text-slate-400 ${
              icon ? "pl-10" : ""
            } ${
              isPassword && rightElement
                ? "pr-16"
                : isPassword || rightElement
                ? "pr-10"
                : ""
            } ${
              error
                ? "border-rose-500 bg-rose-50 focus:ring-rose-500/25 focus:border-rose-500 dark:border-rose-500 dark:bg-rose-950/20"
                : "bg-white border-slate-200 focus:ring-indigo-500/25 focus:border-indigo-600 dark:bg-slate-900 dark:border-slate-800"
            } ${className}`}
            {...props}
          />
          {isPassword ? (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
              {rightElement}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          ) : (
            rightElement && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {rightElement}
              </div>
            )
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
