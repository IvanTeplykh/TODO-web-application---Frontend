"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTaskStore } from "../../store/taskStore";
import { useUIStore } from "../../store/uiStore";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import { LayoutDashboard, Users, ShieldCheck, MessageSquare, User, ChevronLeft, ChevronRight } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { status, setFilters } = useTaskStore();
  const { isSidebarCollapsed, toggleSidebar, notificationPreferences } = useUIStore();
  const { unreadCounts, chatRequests, channelInvites } = useChatStore();
  const { user } = useAuthStore();
  const collapsed = isSidebarCollapsed;

  const unreadMessagesCount = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0);
  const pendingRequestsCount =
    (chatRequests ? chatRequests.filter((r) => r.recipient_id === user?.id && r.status === "pending").length : 0) +
    (channelInvites ? channelInvites.length : 0);
  const totalChatBadge = notificationPreferences.notifyBadges
    ? unreadMessagesCount + pendingRequestsCount
    : 0;

  const handleFilterClick = (newStatus: "all" | "done" | "undone" | "overdue" | "collaborator" | "co_owner") => {
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
      label: "Collaborator",
      icon: Users,
      active: pathname === "/dashboard" && status === "collaborator",
      onClick: () => handleFilterClick("collaborator"),
    },
    {
      label: "Co-owner",
      icon: ShieldCheck,
      active: pathname === "/dashboard" && status === "co_owner",
      onClick: () => handleFilterClick("co_owner"),
    },
    {
      label: "Chat",
      icon: MessageSquare,
      active: pathname === "/chat",
      onClick: () => router.push("/chat"),
      badge: totalChatBadge,
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
      className={`relative border-r border-slate-200/60 bg-white/50 dark:border-slate-800/60 dark:bg-slate-950/20 backdrop-blur-md transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-16 md:w-64"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-3.5 top-6 hidden md:flex h-7 w-7 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-md transition-all hover:bg-slate-100 hover:text-slate-900 hover:scale-110 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white z-20 cursor-pointer"
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      <nav className={`flex-1 space-y-1.5 py-5 ${collapsed ? "px-2" : "px-2 md:px-3.5"}`}>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.onClick}
              className={`flex w-full items-center rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 group relative cursor-pointer ${
                collapsed ? "justify-center px-0" : "gap-3 px-3.5 justify-center md:justify-start"
              } ${
                item.active
                  ? "bg-slate-200/70 text-slate-900 dark:bg-slate-800/70 dark:text-white font-bold"
                  : "text-slate-500 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-white"
              }`}
            >
              {item.active && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-600 dark:bg-indigo-500" />
              )}
              <div className="relative flex-shrink-0">
                <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
                  item.active ? "text-indigo-600 dark:text-indigo-400" : ""
                }`} />
                {item.badge != null && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-900 shadow-xs">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              {!collapsed && <span className="hidden md:inline">{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-3 rounded-xl bg-slate-900 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white shadow-xl opacity-0 transition-all duration-200 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
