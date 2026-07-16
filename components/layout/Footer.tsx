"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/50 bg-white py-6 text-center dark:border-slate-800/50 dark:bg-slate-950">
      <p className="text-xs text-slate-400 dark:text-slate-500">
        &copy; {new Date().getFullYear()} TODO APP. Built with Next.js, FastAPI, and MongoDB.
      </p>
    </footer>
  );
}
