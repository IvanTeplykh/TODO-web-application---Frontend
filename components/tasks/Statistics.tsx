"use client";

import React, { useEffect, useState } from "react";
import { tasksService } from "../../services/tasks";
import { useTaskStore } from "../../store/taskStore";
import { Card } from "../ui/Card";
import { CheckCircle2, ListTodo, AlertCircle, Clock, Sparkles, TrendingUp, TrendingDown } from "lucide-react";

export function Statistics() {
  const { tasks, total, status, setFilters } = useTaskStore();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    percent: 0,
  });

  const [weeklyTrend, setWeeklyTrend] = useState<{ percent: number; isUp: boolean }>({
    percent: 0,
    isUp: true,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [allRes, doneRes, overdueRes, listRes] = await Promise.all([
          tasksService.getTasks({ limit: 1, status: "all" }),
          tasksService.getTasks({ limit: 1, status: "done" }),
          tasksService.getTasks({ limit: 1, status: "overdue" }),
          tasksService.getTasks({ limit: 100, status: "all" }),
        ]);
        
        const tot = allRes.total;
        const comp = doneRes.total;
        const pend = tot - comp;
        const overdueCount = overdueRes.total;
        const pct = tot > 0 ? Math.round((comp / tot) * 100) : 0;

        // Calculate real weekly comparison percentage
        const now = new Date().getTime();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

        const thisWeekTasks = listRes.tasks.filter((t) => {
          const createdTime = new Date(t.created_at).getTime();
          return now - createdTime <= sevenDaysMs;
        }).length;

        const lastWeekTasks = listRes.tasks.filter((t) => {
          const createdTime = new Date(t.created_at).getTime();
          const age = now - createdTime;
          return age > sevenDaysMs && age <= fourteenDaysMs;
        }).length;

        let trendPct = 0;
        let isUp = true;

        if (lastWeekTasks === 0) {
          trendPct = thisWeekTasks > 0 ? 100 : 0;
          isUp = true;
        } else {
          const diff = thisWeekTasks - lastWeekTasks;
          trendPct = Math.round((diff / lastWeekTasks) * 100);
          isUp = trendPct >= 0;
        }

        setStats({
          total: tot,
          completed: comp,
          pending: pend,
          overdue: overdueCount,
          percent: pct,
        });

        setWeeklyTrend({
          percent: Math.abs(trendPct),
          isUp,
        });
      } catch (error) {
        console.error("Failed to load statistics", error);
      }
    };

    loadStats();
  }, [tasks, total, status]);

  // Determine productivity status badge
  let statusText = "Needs Attention";
  let statusBadgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  if (stats.percent >= 75) {
    statusText = "Excellent";
    statusBadgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  } else if (stats.percent >= 40) {
    statusText = "Good";
    statusBadgeStyle = "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
  }

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
    <div className="flex flex-col gap-5 w-full">
      {/* SaaS Productivity Banner */}
      <div className="glass-card rounded-2xl p-6 border border-indigo-500/20 dark:border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-emerald-500/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Productivity Overview
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadgeStyle}`}>
                  {statusText}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Completed <span className="font-bold text-slate-800 dark:text-slate-200">{stats.completed}</span> of <span className="font-bold text-slate-800 dark:text-slate-200">{stats.total}</span> tasks
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold self-start sm:self-auto border ${
              weeklyTrend.isUp
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
            }`}
          >
            {weeklyTrend.isUp ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-rose-500" />
            )}
            <span>
              {weeklyTrend.isUp ? "+" : "-"}
              {weeklyTrend.percent}% this week
            </span>
          </div>
        </div>

        {/* Large Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Overall Completion Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">{stats.percent}%</span>
          </div>
          <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-full h-4 p-0.5 overflow-hidden border border-slate-300/40 dark:border-slate-700/40">
            <div
              className="bg-gradient-to-r from-indigo-600 via-violet-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out shadow-xs"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid Cards (Numbers as Visual Focus) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  );
}
