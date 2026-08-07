"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="relative w-full border-t border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80 transition-colors py-8 mt-auto">
      {/* Top glowing accent border */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-black text-xs shadow-xs">
            T
          </div>
          <span className="font-extrabold tracking-tight text-slate-900 dark:text-white">
            TODO APP
          </span>
          <span className="text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span>Built with</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-500/20">
            Next.js
          </span>
          <span>&bull;</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20">
            FastAPI
          </span>
          <span>&bull;</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-300 font-bold border border-sky-500/20">
            PostgreSQL
          </span>
        </div>
      </div>
    </footer>
  );
}
