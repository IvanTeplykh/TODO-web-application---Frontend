"use client";

import React, { useEffect, useState } from "react";
import { tasksService } from "../../services/tasks";
import { useTaskStore } from "../../store/taskStore";
import { Card } from "../ui/Card";
import { CheckCircle2, ListTodo, Flag, Sparkles } from "lucide-react";

export function Statistics() {
  const { tasks, total, status } = useTaskStore();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    remaining: 0,
    percent: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const allRes = await tasksService.getTasks({ limit: 1, status: "all" });
        const doneRes = await tasksService.getTasks({ limit: 1, status: "done" });
        
        const tot = allRes.total;
        const comp = doneRes.total;
        const rem = tot - comp;
        const pct = tot > 0 ? Math.round((comp / tot) * 100) : 0;

        setStats({
          total: tot,
          completed: comp,
          remaining: rem,
          percent: pct,
        });
      } catch (error) {
        console.error("Failed to load statistics", error);
      }
    };

    loadStats();
  }, [tasks, total, status]);

  const statCards = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: ListTodo,
      color: "text-violet-600 bg-violet-50 dark:bg-violet-950/20 dark:text-violet-400",
      isRate: false,
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400",
      isRate: false,
    },
    {
      label: "Remaining",
      value: stats.remaining,
      icon: Sparkles,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
      isRate: false,
    },
    {
      label: "Completion Rate",
      value: `${stats.percent}%`,
      icon: Flag,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400",
      isRate: true,
      percentage: stats.percent,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <Card key={idx} className="!p-4 border border-slate-200/50 dark:border-slate-800/80">
            <div className="flex flex-col w-full gap-2">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.color} flex-shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500">
                    {c.label}
                  </span>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
                    {c.value}
                  </span>
                </div>
              </div>
              {c.isRate && (
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
