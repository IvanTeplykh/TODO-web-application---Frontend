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
                      Manage workspace tasks with segmented controls, differentiated badges, due dates, and quick hover actions.
                    </p>
                  </div>

                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/60 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Filtering & Controls</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Segmented Control Filters
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Filter tasks by <span className="font-bold">All</span>, <span className="font-bold">Pending</span>, <span className="font-bold">Completed</span>, <span className="font-bold">Overdue</span>, <span className="font-bold">Co-Owner</span>, and <span className="font-bold">Collaborator</span>. The segmented control tab bar features an active white pill indicator.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Differentiated Badges
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Priority levels (High, Medium, Low) use <span className="font-bold">Filled Badges</span>. Shared team access roles (Co-owner, Collaborator) use <span className="font-bold">Outlined Badges</span> for immediate visual distinction.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Quick Actions on Hover
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Hovering over any task card reveals inline quick action icons: <span className="font-bold">Eye</span> (View Details), <span className="font-bold">Edit3</span> (Quick Edit), and <span className="font-bold">Trash2</span> (Delete Task).
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Due Dates & Overdue Alerts
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Tasks past their due date display highlighted date text and an animated red <span className="font-bold text-rose-500">Overdue</span> alert badge (can be toggled in Notification Preferences).
                        </p>
                      </div>
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
                      Communicate instantly with team members using public channels, direct messages, and continuous real-time WebSocket updates.
                    </p>
                  </div>

                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/60 pt-6">
                    <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                      <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        Persistent WebSocket Connection Lifecycle
                      </h3>
                      <p className="text-xs text-indigo-800/90 dark:text-indigo-300/90 leading-relaxed">
                        WebSocket connections establish automatically upon user authentication across all protected pages (<code className="font-mono text-[11px]">/dashboard</code>, <code className="font-mono text-[11px]">/profile</code>, <code className="font-mono text-[11px]">/chat</code>). The socket remains connected throughout your workspace session to stream incoming messages, team presence, and pending invites without relying on polling.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Public Channels & DMs
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Create public channels for team discussions or open 1-on-1 direct conversations. Track team online status indicators in real time.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Sound Chimes & Persistence
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Synthesized Web Audio API sound chimes play upon incoming messages when enabled. Unread message counters are saved in <code className="font-mono text-[11px]">localStorage</code> and restored upon browser reload.
                        </p>
                      </div>
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
                      Work seamlessly with team members on shared tasks with strict role-based access control (RBAC).
                    </p>
                  </div>

                  {/* Access Hierarchy Cards */}
                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/60 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Role Access Matrix</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Owner */}
                      <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Owner</h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-600 text-white">Full Control</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          Creator of the task. Has administrative privileges to edit content, manage collaborators, assign roles, transfer primary ownership, or permanently delete the task.
                        </p>
                      </div>

                      {/* Co-Owner */}
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Co-Owner</h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">Full Access</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          Can edit task title, description, priority, due dates, toggle completion status, add collaborators, and post comments. Cannot delete the task or revoke Owner access.
                        </p>
                      </div>

                      {/* Collaborator */}
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Collaborator</h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Status Only</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          Can view task details, toggle completion status (Done / Undone), post task comments, and inspect full change history audit trail.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Invitation Flow */}
                  <div className="space-y-3 border-t border-slate-100 dark:border-slate-800/60 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Inviting & Sharing Tasks</h3>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 font-medium pl-1">
                      <li><strong className="text-slate-900 dark:text-white">Username Invites:</strong> Enter target team member's username to dispatch share requests.</li>
                      <li><strong className="text-slate-900 dark:text-white">Passcode Protection:</strong> Optionally set a secure passcode that recipients must enter to accept shared access.</li>
                      <li><strong className="text-slate-900 dark:text-white">Real-Time Invite Badges:</strong> Pending invitations trigger immediate in-app badges on the sidebar for team recipients.</li>
                    </ul>
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
                      Our platform adheres to enterprise-grade security practices to protect workspace data, user credentials, and communication channels.
                    </p>
                  </div>

                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/60 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Core Security Architecture</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Mandatory Database Hashing
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          All user credentials, authentication secrets, and sensitive workspace identifiers placed in the database are cryptographically hashed before persistent storage. Plaintext passwords or unhashed secrets are strictly prohibited.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Secure In-Transit Data Protection
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          All data transmitted between the client browser, API server, and WebSocket messaging stream is protected via encrypted transport channels with authenticated token verification.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Tenant & Role Isolation
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Strict row-level and workspace scoping ensures users can only read or modify tasks, channels, and records to which they have explicit access permissions.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Automated Retention & Purge
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Configurable message retention rules automatically clean up historic data, and full account deletion permanently purges all associated workspace records.
                        </p>
                      </div>
                    </div>
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
