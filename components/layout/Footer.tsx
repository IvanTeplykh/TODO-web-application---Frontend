"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative w-full border-t border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80 transition-colors py-8 mt-auto">
      {/* Top glowing accent border */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-xs shadow-md shadow-indigo-500/20">
            T
          </div>
          <span className="font-black tracking-tight text-slate-900 dark:text-white">
            TODO APP
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-medium ml-1">
            &copy; {new Date().getFullYear()} Inc. All rights reserved.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-slate-600 dark:text-slate-400">
          <Link href="/docs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Documentation
          </Link>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            GitHub
          </a>
          <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Privacy Policy
          </Link>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
