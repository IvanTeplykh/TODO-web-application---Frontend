"use client";

import React, { useState } from "react";
import { useTaskStore } from "../../store/taskStore";
import { ArrowUpDown, ChevronDown } from "lucide-react";

export function SortDropdown() {
  const { sort, order, setFilters } = useTaskStore();
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: "Date: Latest First", sort: "created_at", order: "desc" as const },
    { label: "Date: Oldest First", sort: "created_at", order: "asc" as const },
    { label: "Overdue / Soonest Due", sort: "due_date", order: "asc" as const },
    { label: "Due Date: Latest First", sort: "due_date", order: "desc" as const },
    { label: "Priority ↑ (1-10)", sort: "priority", order: "asc" as const },
    { label: "Priority ↓ (10-1)", sort: "priority", order: "desc" as const },
    { label: "Title: A-Z", sort: "title", order: "asc" as const },
    { label: "Title: Z-A", sort: "title", order: "desc" as const },
  ];

  const currentOption = options.find((o) => o.sort === sort && o.order === order) || options[0];

  const handleSelect = (opt: typeof options[0]) => {
    setFilters({ sort: opt.sort, order: opt.order });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200/60 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <ArrowUpDown className="h-3.5 w-3.5" />
        <span>{currentOption.label}</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-300" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-200/50 bg-white p-1.5 shadow-xl dark:border-slate-800/50 dark:bg-slate-900 z-20">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-medium transition-all ${
                  opt.sort === sort && opt.order === order
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
