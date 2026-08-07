"use client";

import React from "react";
import { useTaskStore } from "../../store/taskStore";

export function FilterBar() {
  const { status, setFilters } = useTaskStore();

  const filters: { label: string; value: "all" | "done" | "undone" | "overdue" }[] = [
    { label: "All", value: "all" },
    { label: "Done", value: "done" },
    { label: "Pending", value: "undone" },
    { label: "Overdue", value: "overdue" },
  ];

  return (
    <div className="flex gap-1.5 bg-slate-200/60 dark:bg-slate-900/60 p-1.5 rounded-2xl w-fit border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-md">
      {filters.map((f) => {
        const isActive = status === f.value;
        return (
          <button
            key={f.value}
            onClick={() => setFilters({ status: f.value })}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              isActive 
                ? "bg-white text-indigo-600 shadow-md shadow-slate-200/50 dark:bg-slate-800 dark:text-indigo-400 dark:shadow-none" 
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
