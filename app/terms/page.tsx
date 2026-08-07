"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { FileText, ShieldAlert, UserCheck, Scale, AlertOctagon, ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
            <FileText className="h-4 w-4" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Effective date: <span className="font-semibold text-slate-700 dark:text-slate-300">August 7, 2026</span>
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-slate-200/80 dark:border-slate-800/80 space-y-10 shadow-saas">
          {/* Section 1: Acceptance */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              1. Acceptance of Terms
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              By accessing or using <strong className="text-slate-900 dark:text-white">TODO APP</strong>, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you must not access or use our workspace services.
            </p>
          </section>

          {/* Section 2: Account Responsibilities */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <UserCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              2. User Accounts & Security Credentials
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              You are responsible for safeguarding your authentication credentials. All sensitive credentials written to our infrastructure are cryptographically hashed. You must notify us immediately of any unauthorized access to your workspace.
            </p>
          </section>

          {/* Section 3: Collaboration & Usage Rules */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <ShieldAlert className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              3. Workspace Collaboration & Access Governance
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Task owners grant permissions to Co-Owners and Collaborators at their own discretion. You agree not to upload malicious content or attempt to bypass role-based access restrictions.
            </p>
          </section>

          {/* Section 4: Service Availability & Termination */}
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <AlertOctagon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              4. Service Modifications & Termination
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              You may terminate your account at any time via the Profile Danger Zone settings. We reserve the right to suspend or terminate accounts that violate our acceptable use standards.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
