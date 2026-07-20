"use client";

import React from "react";
import { useTaskStore } from "../../store/taskStore";
import { Button } from "../ui/Button";

export function FilterBar() {
  const { status, setFilters } = useTaskStore();

  const filters: { label: string; value: "all" | "done" | "undone" | "overdue" }[] = [
    { label: "All", value: "all" },
    { label: "Done", value: "done" },
    { label: "Undone", value: "undone" },
    { label: "Overdue", value: "overdue" },
  ];

  return (
    <div className="flex gap-2 bg-slate-100/55 dark:bg-slate-900/40 p-1 rounded-xl w-fit">
      {filters.map((f) => {
        const isActive = status === f.value;
        return (
          <Button
            key={f.value}
            variant={isActive ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilters({ status: f.value })}
            className={`!py-1.5 px-4 rounded-lg text-xs font-semibold ${
              isActive 
                ? "shadow-sm shadow-indigo-600/20" 
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {f.label}
          </Button>
        );
      })}
    </div>
  );
}
