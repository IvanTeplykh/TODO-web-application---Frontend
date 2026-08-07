"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { BookOpen, Rocket, CheckSquare, MessageSquare, Users, Shield, Zap, ArrowLeft, Search, ChevronRight } from "lucide-react";

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    { id: "getting-started", label: "Getting Started", icon: Rocket },
    { id: "task-management", label: "Task Management", icon: CheckSquare },
    { id: "realtime-chat", label: "Real-time Team Chat", icon: MessageSquare },
    { id: "collaboration", label: "Collaboration & Roles", icon: Users },
    { id: "security", label: "Security & Data Hashing", icon: Shield },
  ];

  const filteredSections = sections.filter((s) =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC] dark:bg-[#0B0F19] text-slate-900 dark:text-white transition-colors selection:bg-indigo-500/20 selection:text-indigo-600">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 md:py-16 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200/80 dark:border-slate-800/80 pb-8">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors group mb-2"
            >
              <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <BookOpen className="h-4 w-4" />
              <span>Knowledge Base</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Documentation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Everything you need to master task organization, real-time collaboration, and workspace security.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shadow-xs transition-all"
            />
          </div>
        </div>

        {/* Docs Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Docs Navigation Sidebar */}
          <div className="space-y-2 lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-3">
              Guides & Reference
            </h3>
            {filteredSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 text-left cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 font-black"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{sec.label}</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 opacity-60 ${isActive ? "text-white" : ""}`} />
                </button>
              );
            })}
          </div>

          {/* Docs Content Panel */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-3xl p-8 md:p-12 border border-slate-200/80 dark:border-slate-800/80 space-y-8 shadow-saas min-h-[500px]">
              {/* 1. GETTING STARTED */}
              {activeSection === "getting-started" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                      <Rocket className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      Getting Started with TODO APP
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      Welcome to TODO APP — a high-performance, modern SaaS workspace designed for individuals and teams to organize tasks, track productivity metrics, and communicate in real-time.
                    </p>
                  </div>

                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/60 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quick Start Guide</h3>
                    <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3 font-medium pl-1">
                      <li>
                        <strong className="text-slate-900 dark:text-white">Create an Account:</strong> Register your email and username under <Link href="/register" className="text-indigo-600 font-bold hover:underline">Register</Link>.
                      </li>
                      <li>
                        <strong className="text-slate-900 dark:text-white">Access your Dashboard:</strong> View your personalized productivity overview, task statistics, and weekly comparison.
                      </li>
                      <li>
                        <strong className="text-slate-900 dark:text-white">Create your First Task:</strong> Click <span className="font-bold text-indigo-600 dark:text-indigo-400">+ New Task</span> to set priority levels, due dates, and descriptions.
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              {/* 2. TASK MANAGEMENT */}
              {activeSection === "task-management" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                      <CheckSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      Task Management & Filtering
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      Manage tasks efficiently using segmented controls, priority badges, due dates, and quick hover actions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-6">
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Segmented Filters</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Filter by <span className="font-bold">All</span>, <span className="font-bold">Pending</span>, <span className="font-bold">Completed</span>, <span className="font-bold">Overdue</span>, <span className="font-bold">Co-Owner</span>, and <span className="font-bold">Collaborator</span>.
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Priority & Badges</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Visual priority indicators (High, Medium, Low) with filled badges and outlined role badges for shared tasks.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. REAL-TIME TEAM CHAT */}
              {activeSection === "realtime-chat" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                      <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      Real-time Team Chat & WebSockets
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      Communicate instantly with team members using public channels, direct messages, and real-time WebSocket updates.
                    </p>
                  </div>

                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/60 pt-6">
                    <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                      <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        Persistent WebSocket Connection
                      </h3>
                      <p className="text-xs text-indigo-800/90 dark:text-indigo-300/90 leading-relaxed">
                        WebSocket connections connect automatically upon user login and remain active across all protected pages to deliver real-time unread badges and sound chime alerts.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. COLLABORATION & ROLES */}
              {activeSection === "collaboration" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                      <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      Collaboration & Access Levels
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      Share tasks with team members using granular access levels: <span className="font-bold">Owner</span>, <span className="font-bold">Co-Owner</span>, and <span className="font-bold">Collaborator</span>.
                    </p>
                  </div>
                </div>
              )}

              {/* 5. SECURITY & DATA HASHING */}
              {activeSection === "security" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                      <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      Security & Data Hashing Standards
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      All sensitive user credentials and tokens written to the database are cryptographically hashed and encrypted following security best practices.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
