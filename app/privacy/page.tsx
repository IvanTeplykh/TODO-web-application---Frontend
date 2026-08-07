"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { ShieldCheck, Lock, Database, Eye, Bell, Trash2, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC] dark:bg-[#0B0F19] text-slate-900 dark:text-white transition-colors selection:bg-indigo-500/20 selection:text-indigo-600">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20 space-y-10">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="space-y-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="h-4 w-4" />
            <span>Trust & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Last updated: <span className="font-semibold text-slate-700 dark:text-slate-300">August 7, 2026</span>
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-slate-200/80 dark:border-slate-800/80 space-y-10 shadow-saas">
          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              1. Overview & Commitment
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              At <strong className="text-slate-900 dark:text-white">TODO APP</strong>, your privacy and data security are our top priorities. We design our architecture following strict data protection standards to ensure that your personal workspace, tasks, and real-time team conversations remain confidential, secure, and under your control.
            </p>
          </section>

          {/* Section 2: Data Hashing & Encryption */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              2. Data Hashing & Security Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              All sensitive identifiers and confidential fields written to our databases are encrypted and cryptographically hashed. We employ modern salted hashing mechanisms (e.g., SHA-256 / bcrypt) for credential authentication and token validation:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 font-medium pl-2">
              <li>Passwords and sensitive tokens are strictly hashed prior to storage and never saved in plain text.</li>
              <li>WebSocket connections and HTTP endpoints require authenticated Bearer tokens over SSL/TLS.</li>
              <li>Data access is scoped exclusively to authorized workspace owners and explicit collaborators.</li>
            </ul>
          </section>

          {/* Section 3: Information We Collect */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              3. Information We Collect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Account Information</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Username, email address, avatar image URL, and hashed authentication credentials.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace & Task Data</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Task titles, descriptions, priority levels, due dates, task comment history, and collaborator lists.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Notification Preferences */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              4. Notification & Preference Controls
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              You retain granular control over your notification preferences directly within your Profile page under <span className="font-bold text-indigo-600 dark:text-indigo-400">Notification Preferences</span>. Settings such as in-app badges, comment alerts, and sound chime effects are stored locally and respected in real-time across your workspace.
            </p>
          </section>

          {/* Section 5: Data Retention & Deletion */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Trash2 className="h-5 w-5 text-rose-500" />
              5. Data Retention & Account Deletion
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Chat history retention can be customized in your profile (ranging from 7 to 365 days). You also have the right to request full account deletion at any time via the <span className="font-bold text-rose-500">Danger Zone</span> tab in your profile settings. Upon deletion, your personal workspace data and credentials are permanently purged.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
