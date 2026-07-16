"use client";

import React, { forwardRef, InputHTMLAttributes } from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className={`flex flex-col ${className}`}>
        <label className="inline-flex items-center cursor-pointer select-none gap-2.5">
          <div className="relative flex items-center justify-center">
            <input
              id={id}
              ref={ref}
              type="checkbox"
              className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white transition-all duration-200 checked:border-indigo-650 checked:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-905 dark:checked:border-indigo-500 dark:checked:bg-indigo-500"
              {...props}
            />
            <Check className="absolute h-3.5 w-3.5 text-white scale-0 transition-transform duration-200 peer-checked:scale-100 pointer-events-none" />
          </div>
          {label && (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {label}
            </span>
          )}
        </label>
        {error && (
          <span className="mt-1 text-xs text-rose-500 font-medium">{error}</span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
