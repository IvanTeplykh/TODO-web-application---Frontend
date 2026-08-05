"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string | number;
  label: string;
  badge?: React.ReactNode;
}

interface SelectProps {
  id?: string;
  label?: React.ReactNode;
  value: string | number;
  options: SelectOption[];
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = "Select option",
  className = "",
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optValue: string | number) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-all duration-200 cursor-pointer outline-none ${
          isOpen
            ? "border-indigo-500 ring-2 ring-indigo-500/25 dark:border-indigo-500 shadow-xs"
            : "hover:border-slate-300 dark:hover:border-slate-700"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      >
        <span className="truncate font-medium flex items-center gap-2">
          {selectedOption ? selectedOption.label : placeholder}
          {selectedOption?.badge}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        />
      </button>

      {/* Dropdown Options Popup */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl shadow-slate-900/10 dark:shadow-black/50 backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="truncate">{opt.label}</span>
                    {opt.badge}
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
