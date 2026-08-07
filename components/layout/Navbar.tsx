"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { ConfirmLogoutModal } from "../auth/ConfirmLogoutModal";
import { ThemeToggle } from "../ui/ThemeToggle";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogoutClick = () => {
    setShowDropdown(false);
    setIsLogoutOpen(true);
  };

  const handleConfirmLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80 transition-colors">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <span className="text-xl font-black tracking-tight">T</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 bg-clip-text text-transparent dark:from-white dark:via-slate-100 dark:to-indigo-200">
                TODO APP
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                Workspace
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 rounded-2xl p-1 pr-2.5 border border-slate-200/80 bg-slate-50/80 hover:bg-slate-100/80 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-slate-700">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-4 w-4" />
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-200 max-w-28 truncate">
                  {user?.username}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2.5 w-52 origin-top-right rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xl p-1.5 shadow-xl shadow-slate-900/10 focus:outline-none dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-slate-950/50 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800/80">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {user?.username}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-slate-800/80"
                    >
                      <UserIcon className="h-4 w-4 text-indigo-500" />
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ConfirmLogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
