"use client";

import React from "react";
import { Card } from "../../components/ui/Card";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16 w-full border-b border-slate-200/50 bg-white/80 dark:border-slate-800/50 dark:bg-slate-950/80 animate-pulse"></div>

      <div className="flex flex-1">
        <div className="w-64 border-r border-slate-200/50 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-900/10 animate-pulse hidden md:block"></div>

        <main className="flex-1 bg-slate-50/50 dark:bg-slate-950/20 p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
          <div className="space-y-2">
            <div className="h-7 w-48 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            <div className="h-4 w-72 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Card key={idx} className="h-20 border border-slate-200/50 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/50 animate-pulse !p-0" />
            ))}
          </div>

          <Card className="h-32 border border-slate-200/50 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/50 animate-pulse !p-0" />

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="h-10 w-full sm:max-w-xs rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            <div className="h-10 w-48 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          </div>

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-16 w-full rounded-xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse"></div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
