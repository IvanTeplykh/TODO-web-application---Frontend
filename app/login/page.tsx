"use client";

import React from "react";
import { LoginForm } from "../../components/auth/LoginForm";
import { Card } from "../../components/ui/Card";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push("/")}
      className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden cursor-pointer"
    >
      {/* Decorative gradient spheres */}
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5"></div>
      <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/5"></div>

      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md relative z-10 cursor-default"
      >
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-550 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
            <span className="text-2xl font-bold">T</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 mt-2 tracking-tight">
            TODO APP
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Organize your tasks. Get things done.
          </p>
        </div>

        <Card className="border border-slate-200/50 dark:border-slate-800/80 shadow-2xl !p-8">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5">
            Welcome Back 👋
          </h3>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
