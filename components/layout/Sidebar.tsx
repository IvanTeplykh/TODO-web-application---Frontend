"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTaskStore } from "../../store/taskStore";
import { tasksService } from "../../services/tasks";
import { LayoutDashboard, CheckCircle2, Clock, AlertCircle, User, ChevronLeft, ChevronRight } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { status, setFilters } = useTaskStore();
  const [collapsed, setCollapsed] = React.useState(false);
  const { tasks } = useTaskStore();
  const [completedCount, setCompletedCount] = React.useState(0);

  React.useEffect(() => {
    const fetchCompletedCount = async () => {
      try {
        const res = await tasksService.getTasks({ limit: 1, status: "done" });
        setCompletedCount(res.total);
      } catch {
        // Silently ignore
      }
    };
    fetchCompletedCount();
  }, [tasks]);

  const handleFilterClick = (newStatus: "all" | "done" | "undone" | "overdue") => {
    setFilters({ status: newStatus });
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard" && status === "all",
      onClick: () => handleFilterClick("all"),
    },
    {
      label: "Completed",
      icon: CheckCircle2,
      active: pathname === "/dashboard" && status === "done",
      onClick: () => handleFilterClick("done"),
    },
    {
      label: "Pending",
      icon: Clock,
      active: pathname === "/dashboard" && status === "undone",
      onClick: () => handleFilterClick("undone"),
    },
    {
      label: "Overdue",
      icon: AlertCircle,
      active: pathname === "/dashboard" && status === "overdue",
      onClick: () => handleFilterClick("overdue"),
    },
    {
      label: "Profile",
      icon: User,
      active: pathname === "/profile",
      onClick: () => router.push("/profile"),
    },
  ];

  return (
    <aside
      className={`relative border-r border-slate-200/50 bg-slate-50/50 transition-all duration-300 dark:border-slate-800/50 dark:bg-slate-900/10 flex flex-col ${
        collapsed ? "w-16" : "w-16 md:w-64"
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-955 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white z-20"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      <nav className={`flex-1 space-y-1.5 py-4 ${collapsed ? "px-2" : "px-2 md:px-4"}`}>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.onClick}
              className={`flex w-full items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200 group relative ${
                collapsed ? "justify-center px-0" : "gap-3 px-3 justify-center md:justify-start"
              } ${
                item.active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-semibold"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
              }`}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                item.active ? "text-indigo-600 dark:text-indigo-400" : ""
              }`} />
              {!collapsed && <span className="hidden md:inline">{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-2.5 rounded-lg bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-4 mt-auto hidden md:block">
          <div className="rounded-2xl bg-indigo-50/50 p-4 border border-indigo-100/50 dark:bg-indigo-950/10 dark:border-indigo-900/20 text-center flex flex-col items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-650 text-white shadow-md dark:bg-indigo-500">
              <span className="text-base">🎉</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Stay productive!
              </span>
              <span className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                You&apos;ve completed {completedCount} task{completedCount === 1 ? "" : "s"} today. Keep it up!
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
