"use client";

import React, { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-all duration-200 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-650 ${
              icon ? "pl-10" : ""
            } ${
              error
                ? "border-rose-550 focus:ring-rose-500/25 focus:border-rose-500"
                : "border-slate-200 dark:border-slate-800 focus:ring-indigo-550/20"
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
