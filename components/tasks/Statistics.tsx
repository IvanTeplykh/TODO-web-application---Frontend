"use client";

import React, { useEffect, useState } from "react";
import { tasksService } from "../../services/tasks";
import { useTaskStore } from "../../store/taskStore";
import { Card } from "../ui/Card";
import { CheckCircle2, ListTodo, AlertCircle, Clock } from "lucide-react";

export function Statistics() {
  const { tasks, total, status, setFilters } = useTaskStore();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [doneRes, overdueRes] = await Promise.all([
          tasksService.getTasks({ limit: 1, status: "done" }),
          tasksService.getTasks({ limit: 1, status: "overdue" }),
        ]);

        const tot = total;
        const comp = doneRes.total;
        const pend = Math.max(0, tot - comp);
        const overdueCount = overdueRes.total;

        setStats({
          total: tot,
          completed: comp,
          pending: pend,
          overdue: overdueCount,
        });
      } catch (error) {
        console.error("Failed to load statistics", error);
      }
    };

    if (total > 0 || tasks.length > 0) {
      loadStats();
    }
  }, [total]);

  const statCards: {
    label: string;
    value: number;
    icon: React.ElementType;
    color: string;
    filterValue: "all" | "done" | "undone" | "overdue";
  }[] = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: ListTodo,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      filterValue: "all",
    },
    {
      label: "Completed Tasks",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      filterValue: "done",
    },
    {
      label: "Pending Tasks",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
      filterValue: "undone",
    },
    {
      label: "Overdue Tasks",
      value: stats.overdue,
      icon: AlertCircle,
      color: stats.overdue > 0 
        ? "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse"
        : "text-slate-400 dark:text-slate-500 bg-slate-500/10 border-slate-500/20",
      filterValue: "overdue",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statCards.map((c, idx) => {
        const Icon = c.icon;
        const isActive = status === c.filterValue;
        return (
          <Card
            key={idx}
            onClick={() => setFilters({ status: c.filterValue })}
            className={`!p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] ${
              isActive
                ? "border-indigo-500/80 ring-2 ring-indigo-500/20 bg-indigo-500/5 shadow-md"
                : "hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                {c.value}
              </span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${c.color} flex-shrink-0 shadow-xs`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-3">
              {c.label}
            </span>
          </Card>
        );
      })}
    </div>
  );
}

