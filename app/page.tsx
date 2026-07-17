"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import { 
  CheckCircle2, 
  ListTodo, 
  Clock, 
  Search, 
  BarChart3, 
  Shield, 
  ArrowRight, 
  Zap, 
  Sparkles 
} from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuthStore();

  const features = [
    {
      title: "Task Management",
      desc: "Organize everything in one place with simple list structures.",
      icon: ListTodo,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400",
    },
    {
      title: "Priority Levels",
      desc: "Set priorities (Low, Medium, High) to focus on what matters most.",
      icon: Zap,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-450",
    },
    {
      title: "Due Dates",
      desc: "Assign deadlines and get visual warnings when a task is overdue.",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
    },
    {
      title: "Fast Search",
      desc: "Find any task instantly with real-time title query filters.",
      icon: Search,
      color: "text-sky-600 bg-sky-50 dark:bg-sky-950/20 dark:text-sky-400",
    },
    {
      title: "Statistics",
      desc: "Monitor your completion rates and track daily performance stats.",
      icon: BarChart3,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400",
    },
    {
      title: "Secure Authentication",
      desc: "Your tasks are private and securely stored with JWT encryption.",
      icon: Shield,
      color: "text-violet-600 bg-violet-50 dark:bg-violet-950/20 dark:text-violet-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-955 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-900/55 dark:bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-550 text-white shadow-md shadow-indigo-500/20">
              <span className="text-lg font-bold">T</span>
            </div>
            <span className="text-lg font-black bg-gradient-to-r from-slate-905 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
              TODO APP
            </span>
          </div>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-8 w-16 bg-slate-100 dark:bg-slate-900 rounded-lg animate-pulse" />
            ) : isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/50 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Smart Task Management</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-slate-450">
            Organize your work. <br />
            <span className="bg-gradient-to-r from-indigo-650 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-cyan-400">
              Focus on what matters.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            Manage your daily tasks, priority levels, and due dates in a clean workspace designed to keep you focused.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            <Link
              href={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-xl bg-indigo-650 px-6 font-bold text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#preview"
              className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white px-6 font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Live Demo
            </a>
          </div>
        </div>

        {/* Hero Dashboard Preview Mockup (Aesthetic CSS Representation) */}
        <div className="lg:col-span-6 relative w-full overflow-hidden select-none">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative rounded-2xl border border-slate-200/60 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-2xl p-6 overflow-hidden">
            {/* Mock Dashboard Top Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <div className="w-6" /> {/* Spacer */}
              <div className="h-5 w-32 bg-slate-100 dark:bg-slate-800 rounded-full" />
              <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950" />
            </div>

            {/* Mock Dashboard Body */}
            <div className="space-y-4">
              {/* Task Item 1 */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-md border border-slate-200 dark:border-slate-800 flex-shrink-0" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 ml-3">Finish Backend API</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30 flex items-center gap-1">
                  <span>🔥</span> High
                </span>
              </div>
              
              {/* Task Item 2 */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-md bg-indigo-650 flex items-center justify-center text-white text-[10px] flex-shrink-0">✓</div>
                  <span className="text-sm font-medium text-slate-300/40 dark:text-slate-700/40 line-through ml-3">Buy groceries</span>
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                  Low
                </span>
              </div>
              
              {/* Task Item 3 */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-md border border-slate-200 dark:border-slate-800 flex-shrink-0" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 ml-3">Design UI components</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">
                  Medium
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-100/30 dark:bg-slate-900/10 border-y border-slate-200/40 dark:border-slate-900 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">
              Features Built for Productivity
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Everything you need to focus, optimize your schedule, and execute your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div 
                  key={idx} 
                  className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl mb-4 border ${f.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-150 mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Large Dashboard Preview Mockup Section */}
      <section id="preview" className="mx-auto max-w-6xl px-6 py-16 md:py-24 text-center">
        <div className="max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            A Clean Workspace
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Take a look at the dashboard workflow interface. Manage your lifecycle in real-time.
          </p>
        </div>

        {/* HTML Mockup styled exactly like our actual app page */}
        <div className="rounded-2xl border border-slate-200/70 bg-white dark:border-slate-850 dark:bg-slate-900 shadow-2xl p-4 md:p-6 text-left max-w-4xl mx-auto overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-650 flex items-center justify-center text-white text-xs font-bold">
                T
              </div>
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">TODO APP</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-7 w-48 bg-slate-100 dark:bg-slate-800 rounded-lg hidden sm:block" />
              <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>

          {/* Quick stats grid mockup */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/10">
              <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Tasks</span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-100">12</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/10">
              <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completed</span>
              <span className="text-base font-extrabold text-slate-850 dark:text-slate-100">5</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/10">
              <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending</span>
              <span className="text-base font-extrabold text-slate-850 dark:text-slate-100">7</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/10">
              <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completion Rate</span>
              <span className="text-base font-extrabold text-slate-850 dark:text-slate-100">42%</span>
            </div>
          </div>

          {/* Tasks listing mockup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border border-slate-200" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Finish Backend API</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30">🔥 High</span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3 ml-6 line-clamp-1">Implement jwt token authentication and database setup.</p>
              <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-550 border-t border-slate-50 dark:border-slate-800/50 pt-2 ml-6">
                <span>📅 Jul 25, 2026</span>
                <span className="text-indigo-650 dark:text-indigo-400 font-bold">View →</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-slate-900 shadow-sm opacity-70">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-indigo-600 text-white flex items-center justify-center text-[8px]">✓</div>
                  <span className="text-xs font-medium text-slate-550 dark:text-slate-400 line-through">Buy groceries</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">Low</span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3 ml-6 line-clamp-1">Milk, bread, eggs and fresh apples.</p>
              <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-550 border-t border-slate-50 dark:border-slate-800/50 pt-2 ml-6">
                <span>📅 Jul 18, 2026</span>
                <span className="text-indigo-650 dark:text-indigo-400 font-bold">View →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/50 bg-white py-8 dark:border-slate-900 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} TODO APP. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-600 dark:hover:text-slate-300">Login</Link>
            <Link href="/register" className="hover:text-slate-600 dark:hover:text-slate-300">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
