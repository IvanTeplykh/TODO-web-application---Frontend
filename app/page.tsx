"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { CreateTaskModal } from "../components/tasks/CreateTaskModal";
import { Footer } from "../components/layout/Footer";
import {
  ListTodo,
  Clock,
  BarChart3,
  Shield,
  ArrowRight,
  Zap,
  Sparkles,
  Plus,
  Users,
  MessageSquare,
  Send,
} from "lucide-react";

import { ThemeToggle } from "../components/ui/ThemeToggle";

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuthStore();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const features = [
    {
      title: "Smart Task Management",
      desc: "Organize tasks seamlessly with flexible priority scales, due date tracking, and search filters.",
      icon: ListTodo,
      color: "text-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-500/20",
    },
    {
      title: "Priority Scale System",
      desc: "Categorize tasks dynamically by numerical priority (1-10) with visual High, Medium, and Low badges.",
      icon: Zap,
      color: "text-rose-600 bg-rose-50/80 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20",
    },
    {
      title: "Real-time Collaboration",
      desc: "Share tasks securely with team members as collaborators or co-owners with customizable permissions.",
      icon: Users,
      color: "text-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20",
    },
    {
      title: "Deadline Detection",
      desc: "Never miss a deadline. Automatic overdue warnings highlight pending items automatically.",
      icon: Clock,
      color: "text-amber-600 bg-amber-50/80 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20",
    },
    {
      title: "Productivity Analytics",
      desc: "Track task completion rates with visual progress bars and category counter metrics.",
      icon: BarChart3,
      color: "text-sky-600 bg-sky-50/80 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200/50 dark:border-sky-500/20",
    },
    {
      title: "Encrypted Security",
      desc: "JWT authentication paired with field-level encryption for complete privacy and data safety.",
      icon: Shield,
      color: "text-violet-600 bg-violet-50/80 dark:bg-violet-950/40 dark:text-violet-400 border-violet-200/50 dark:border-violet-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80 transition-colors">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <span className="text-xl font-black">T</span>
            </div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 bg-clip-text text-transparent dark:from-white dark:via-slate-100 dark:to-indigo-200">
              TODO APP
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {loading ? (
              <div className="h-9 w-20 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            ) : isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors px-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden mx-auto max-w-6xl px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Next-Gen Task Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            Master Your Workflow. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-400 bg-clip-text text-transparent">
              Achieve Your Goals.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            Streamline your personal and team tasks with intuitive priority tracking, real-time sharing, and an ultra-responsive glassmorphic workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            <Link
              href={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 font-bold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all gap-2 text-sm"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 backdrop-blur-md px-7 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:-translate-y-0.5 active:scale-[0.98] transition-all gap-2 text-sm cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4 text-indigo-500" />
              <span>Create Note</span>
            </button>
          </div>
        </div>

        {/* Hero Dual Preview Stack: Chat Card (Angled behind) & Main Workspace Card (Front) */}
        <div className="lg:col-span-6 relative w-full select-none flex items-center justify-center py-6 sm:py-10">
          
          {/* Background Chat Window (Angled Behind) */}
          <div className="absolute top-0 right-2 sm:-right-4 w-[88%] sm:w-[92%] rounded-3xl p-5 border border-indigo-500/30 dark:border-indigo-500/40 bg-slate-900/90 text-white shadow-2xl backdrop-blur-2xl transform rotate-[7deg] translate-y-3 sm:translate-y-4 hover:rotate-[4deg] transition-transform duration-500 ease-out z-0 opacity-90 hover:opacity-100">
            {/* Chat Top Header */}
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-xs">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Team Channel #devs</h4>
                  <p className="text-[10px] text-indigo-300 font-medium">3 members online</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Live Chat
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="space-y-2.5 text-[11px] pb-1">
              {/* Incoming message */}
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 border border-cyan-500/30">
                  A
                </div>
                <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-xs px-3 py-2 text-slate-200 shadow-xs">
                  <p className="font-semibold text-cyan-400 text-[10px] mb-0.5">Alex Johnson</p>
                  <p>Have you verified the task sharing permissions API?</p>
                </div>
              </div>

              {/* Outgoing message */}
              <div className="flex items-start justify-end gap-2 ml-auto max-w-[85%]">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl rounded-tr-xs px-3 py-2 text-white shadow-md">
                  <p>Yes! PostgreSQL integration & E2E tests pass 100% 🚀</p>
                </div>
                <div className="h-6 w-6 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 border border-indigo-500/40">
                  You
                </div>
              </div>
            </div>

            {/* Input Bar Mockup */}
            <div className="mt-3 pt-2.5 border-t border-indigo-500/20 flex items-center gap-2">
              <div className="flex-1 bg-slate-800/70 border border-indigo-500/20 rounded-xl px-3 py-1 text-slate-400 text-[10px] truncate">
                Type a message...
              </div>
              <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs flex-shrink-0">
                <Send className="h-3 w-3" />
              </div>
            </div>
          </div>

          {/* Main Foreground Workspace Preview Card */}
          <div className="glass-card w-full max-w-[480px] rounded-3xl p-6 sm:p-7 space-y-3.5 border border-slate-200/90 dark:border-slate-800/90 shadow-2xl relative z-10 transform -rotate-[3deg] hover:rotate-0 transition-transform duration-500 ease-out">
            {/* Top Bar Mockup */}
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Workspace Preview
              </span>
            </div>

            {/* Task Item 1 */}
            <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/90 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-lg border-2 border-indigo-500/40 flex items-center justify-center text-indigo-500" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Design API Architecture
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Due in 2 days
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                🔥 High (9)
              </span>
            </div>

            {/* Task Item 2 */}
            <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/90 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 line-through">
                    Setup PostgreSQL Database
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Completed
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Low (3)
              </span>
            </div>

            {/* Task Item 3 */}
            <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/90 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-lg border-2 border-indigo-500/40" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Implement Real-time Chat
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Shared with 3 co-owners
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                🟡 Medium (6)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60 py-20 md:py-28 backdrop-blur-xs">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Built for Maximum Productivity
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Everything you need to plan, collaborate, and execute tasks seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="glass-card group p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-500/40 transition-all duration-300 relative overflow-hidden"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl mb-4 border ${f.color} shadow-xs group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28 w-full relative">
        {/* Soft Radial Glow behind CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl pointer-events-none rounded-full" />

        <div className="glass-card rounded-3xl p-10 md:p-16 border border-indigo-500/30 dark:border-indigo-500/40 bg-gradient-to-r from-indigo-600/10 via-purple-600/5 to-cyan-600/10 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Ready to elevate your productivity?
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto font-medium">
            Join thousands of professionals organizing tasks efficiently with TODO APP.
          </p>
          <div className="flex justify-center pt-3">
            <Link
              href={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex h-13 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-9 font-bold text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all text-sm gap-2.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />

      {/* Quick Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitOverride={(taskData) => {
          setIsCreateModalOpen(false);
          localStorage.setItem("pending_task", JSON.stringify(taskData));
          router.push("/register");
        }}
      />
    </div>
  );
}
