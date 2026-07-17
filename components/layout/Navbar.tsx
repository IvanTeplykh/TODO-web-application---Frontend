"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { ConfirmLogoutModal } from "../auth/ConfirmLogoutModal";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-950">
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

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-250/80 bg-slate-50 transition-all hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900"
              >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2.5 w-48 origin-top-right rounded-xl border border-slate-150 bg-white p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-none dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-205 truncate">
                      {user?.username}
                    </p>
                    <p className="text-3xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-all hover:bg-slate-50 dark:text-slate-305 dark:hover:bg-slate-800/65"
                  >
                    <UserIcon className="h-4 w-4" />
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogoutClick}
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
      
      <ConfirmLogoutModal 
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
