"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import { Bell, Sun, Moon, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/80">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-550 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
            <span className="text-lg font-bold">T</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
            TODO APP
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/60 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
            title="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-[18px] w-[18px]" />
            ) : (
              <Sun className="h-[18px] w-[18px]" />
            )}
          </button>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/60 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 rounded-lg border border-slate-200/60 p-1.5 pr-3 text-sm font-medium transition-all hover:bg-slate-55 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <UserIcon className="h-3.5 w-3.5" />
              </div>
              <span className="text-slate-700 dark:text-slate-205 max-w-[100px] truncate">
                {user?.username || "Account"}
              </span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200/50 bg-white p-1.5 shadow-xl dark:border-slate-800/50 dark:bg-slate-900">
                <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                  Signed in as
                  <p className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {user?.email}
                  </p>
                </div>
                <hr className="my-1 border-slate-100 dark:border-slate-800" />
                <Link
                  href="/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-all hover:bg-slate-50 dark:text-slate-305 dark:hover:bg-slate-800/65"
                >
                  <UserIcon className="h-4 w-4" />
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 transition-all hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
