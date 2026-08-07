"use client";

import React, { useEffect, useState } from "react";
import { tasksService } from "../../services/tasks";
import { useTaskStore } from "../../store/taskStore";
import { Card } from "../ui/Card";
import { CheckCircle2, ListTodo, AlertCircle, Clock, Sparkles } from "lucide-react";

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
      color: "text-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-500/20",
      filterValue: "all",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20",
      filterValue: "done",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 bg-amber-50/80 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20",
      filterValue: "undone",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      color: stats.overdue > 0 
        ? "text-rose-600 bg-rose-50/80 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/30 animate-pulse"
        : "text-slate-500 bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400 border-slate-200/60 dark:border-slate-800/40",
      filterValue: "overdue",
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Overall Progress Banner */}
      <div className="glass-card rounded-2xl p-5 border border-indigo-500/20 dark:border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Task Productivity Score
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You have completed <span className="font-bold text-indigo-600 dark:text-indigo-400">{stats.completed}</span> out of <span className="font-bold text-slate-700 dark:text-slate-200">{stats.total}</span> tasks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:w-48 bg-slate-200/70 dark:bg-slate-800/80 rounded-full h-3.5 p-0.5 overflow-hidden border border-slate-300/40 dark:border-slate-700/40">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out shadow-xs"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 min-w-12 text-right">
            {stats.percent}%
          </span>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, idx) => {
          const Icon = c.icon;
          const isActive = status === c.filterValue;
          return (
            <Card
              key={idx}
              onClick={() => setFilters({ status: c.filterValue })}
              className={`!p-4 transition-all duration-200 cursor-pointer flex items-center justify-between min-h-[76px] ${
                isActive
                  ? "border-indigo-500/80 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-md"
                  : "hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${c.color} flex-shrink-0 shadow-xs`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {c.label}
                  </span>
                  <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate">
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
