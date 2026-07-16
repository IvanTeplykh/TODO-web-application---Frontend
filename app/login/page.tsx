"use client";

import React from "react";
import { LoginForm } from "../../components/auth/LoginForm";
import { Card } from "../../components/ui/Card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#3b0764] via-[#1e1b4b] to-[#0f172a] p-6 relative overflow-hidden">
      {/* Decorative gradient spheres */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
            <span className="text-2xl font-bold bg-gradient-to-tr from-white to-slate-350 bg-clip-text text-transparent">T</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2 tracking-tight">
            TODO APP
          </h2>
          <p className="text-xs text-slate-300 dark:text-slate-400">
            Organize your tasks. Get things done.
          </p>
        </div>

        <Card className="border border-slate-200/50 dark:border-slate-800/80 shadow-2xl !p-8 bg-white dark:bg-slate-900">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5">
            Welcome Back 👋
          </h3>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
