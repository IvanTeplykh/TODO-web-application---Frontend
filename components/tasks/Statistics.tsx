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
    percent: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [allRes, doneRes, overdueRes] = await Promise.all([
          tasksService.getTasks({ limit: 1, status: "all" }),
          tasksService.getTasks({ limit: 1, status: "done" }),
          tasksService.getTasks({ limit: 1, status: "overdue" }),
        ]);
        
        const tot = allRes.total;
        const comp = doneRes.total;
        const pend = tot - comp;
        const overdueCount = overdueRes.total;
        const pct = tot > 0 ? Math.round((comp / tot) * 100) : 0;

        setStats({
          total: tot,
          completed: comp,
          pending: pend,
          overdue: overdueCount,
          percent: pct,
        });
      } catch (error) {
        console.error("Failed to load statistics", error);
      }
    };

    loadStats();
  }, [tasks, total, status]);

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
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-100/30 dark:border-indigo-500/10",
      filterValue: "all",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/30 dark:border-emerald-500/10",
      filterValue: "done",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100/30 dark:border-amber-500/10",
      filterValue: "undone",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      color: stats.overdue > 0 
        ? "text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-450 border-rose-100/50 dark:border-rose-500/20"
        : "text-slate-500 bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400 border-slate-100 dark:border-slate-800/40",
      filterValue: "overdue",
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, idx) => {
          const Icon = c.icon;
          const isActive = status === c.filterValue;
          return (
            <Card
              key={idx}
              onClick={() => setFilters({ status: c.filterValue })}
              className={`!p-4 border transition-all cursor-pointer flex items-center justify-between hover:shadow-md ${
                isActive
                  ? "border-indigo-500/60 ring-2 ring-indigo-500/20 dark:border-indigo-500/50"
                  : "border-slate-200/50 dark:border-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${c.color} flex-shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-300">
                    {c.label}
                  </span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-white truncate">
                    {c.value}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
