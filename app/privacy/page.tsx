"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
  Bell,
  Trash2,
  Users,
  Cookie,
  Share2,
  Key,
  Clock,
  AlertTriangle,
  RefreshCw,
  Mail,
  FileText,
  CheckCircle2,
  Globe,
  Server,
  Layers,
  ArrowLeft,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

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
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-slate-200/80 dark:border-slate-800/80 space-y-12 shadow-saas">
          
          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              1. Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Welcome to <strong className="text-slate-900 dark:text-white">TODO APP</strong>.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Your privacy and the security of your data are important to us. TODO APP is designed to provide a secure environment for managing personal tasks, workspaces, collaborators, and real-time conversations.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              This Privacy Policy explains what information we collect, why we collect it, how it is used, how we protect it, and what rights and controls are available to you.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              By using TODO APP, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              2. Information We Collect
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              We collect only the information necessary to provide and improve the functionality of TODO APP.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* 2.1 */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Key className="h-4 w-4 text-indigo-500" />
                  2.1 Account Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  When you create and use an account, we may collect:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 font-medium pl-1">
                  <li>Username</li>
                  <li>Email address</li>
                  <li>Avatar image or avatar URL</li>
                  <li>Authentication credentials</li>
                  <li>Account creation and account-related metadata</li>
                </ul>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  Passwords are never stored in plain text. Authentication credentials are protected using secure password-hashing mechanisms.
                </p>
              </div>

              {/* 2.2 */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  2.2 Workspace Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  When you create or join a workspace, we may collect and store:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 font-medium pl-1">
                  <li>Workspace name</li>
                  <li>Workspace description</li>
                  <li>Workspace members</li>
                  <li>Collaborator permissions</li>
                  <li>Workspace ownership information</li>
                  <li>Workspace activity required to provide collaboration features</li>
                </ul>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  Workspace information is used to provide task management and collaboration functionality.
                </p>
              </div>

              {/* 2.3 */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  2.3 Task Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  TODO APP stores information that you intentionally create within your workspaces, including:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 font-medium pl-1">
                  <li>Task titles and descriptions</li>
                  <li>Task status and priority levels</li>
                  <li>Due dates</li>
                  <li>Task comments and comment history</li>
                  <li>Assigned users and collaborators</li>
                  <li>Other task-related information provided through the application</li>
                </ul>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  This information is required to provide the core task-management functionality of TODO APP.
                </p>
              </div>

              {/* 2.4 */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-indigo-500" />
                  2.4 Chat & Real-Time Communication
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  If you use the application&apos;s real-time communication features, we may collect and store:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 font-medium pl-1">
                  <li>Chat messages</li>
                  <li>Conversation history</li>
                  <li>Message timestamps</li>
                  <li>Associated workspace or channel information</li>
                  <li>User information associated with messages</li>
                </ul>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  Chat functionality may use persistent WebSocket connections to provide real-time communication between authorized users.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section className="space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              3. How We Use Your Information
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              We use collected information to provide, operate, maintain, and improve TODO APP.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Your information may be used to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Create and manage your account</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Authenticate your identity</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Provide access to your workspaces</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Create, update, and manage tasks</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Assign tasks to collaborators</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Display comments and task history</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Provide real-time chat and collaboration</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Deliver notifications</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Save your application preferences</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Maintain application security</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Detect and prevent unauthorized access</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Diagnose technical problems</span>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Improve application performance and reliability</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium pt-2">
              We do not use your workspace content for purposes unrelated to providing and maintaining the application.
            </p>
          </section>

          {/* Section 4: Authentication & Security */}
          <section className="space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              4. Authentication & Security
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Security is an important part of TODO APP&apos;s architecture.
            </p>

            <div className="space-y-4">
              <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">4.1 Password Protection</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Passwords are never stored as plain text. User passwords are processed using secure, salted password-hashing algorithms before being stored in the database. The original password cannot be retrieved from the stored password hash. Authentication credentials are handled separately from ordinary application data and are used only for account authentication and authorization.
                </p>
              </div>

              <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">4.2 Authentication Tokens</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  TODO APP uses authenticated requests to protect access to private resources. API requests requiring authentication use authorization mechanisms such as Bearer tokens. Authentication credentials and tokens are not intentionally exposed through publicly accessible application data.
                </p>
              </div>

              <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">4.3 Encrypted Connections</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Communication between the client and server is protected using <strong className="text-slate-900 dark:text-white">HTTPS and SSL/TLS encryption</strong> where supported by the deployment environment. Real-time WebSocket connections are also protected through secure WebSocket connections when the application is accessed over HTTPS. This helps protect information while it is transmitted between your device and our servers.
                </p>
              </div>

              <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">4.4 Access Control</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Access to private resources is controlled through authentication and authorization mechanisms. Users can access workspace information only when they have the appropriate permissions. Workspace owners and authorized collaborators may have different levels of access depending on the permissions assigned to them.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Data Storage */}
          <section className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              5. Data Storage
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Information provided through TODO APP may be stored in application databases and supporting infrastructure required to operate the service.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Stored information may include:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 font-medium pl-2">
              <li>Account information</li>
              <li>Authentication data</li>
              <li>Workspace information</li>
              <li>Tasks and comments</li>
              <li>Collaboration data</li>
              <li>Chat messages</li>
              <li>Application preferences</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium pt-1">
              We take reasonable measures to prevent unauthorized access to stored information. However, no internet-based service or storage system can guarantee absolute security. While we work to protect your information, we cannot guarantee that unauthorized access, data loss, or other security incidents will never occur.
            </p>
          </section>

          {/* Section 6: Notifications & Preferences */}
          <section className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              6. Notifications & Preferences
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              TODO APP provides users with control over notification-related preferences.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Depending on the available features, you may be able to configure:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 font-medium pl-2">
              <li>In-app notification badges</li>
              <li>Comment notifications</li>
              <li>Chat notifications</li>
              <li>Sound effects and notification chimes</li>
              <li>Other application preferences</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium pt-1">
              Some preferences may be stored locally on your device using browser or application storage. Preferences that are stored locally remain associated with the device or browser where they were configured unless the application provides synchronization for those settings.
            </p>
          </section>

          {/* Section 7: Chat History & Data Retention */}
          <section className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              7. Chat History & Data Retention
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              TODO APP may provide configurable retention settings for real-time conversations.
            </p>
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/40">
              <p className="text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 font-semibold">
                Retention settings range: 7 to 365 days.
              </p>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              When the configured retention period expires, eligible chat messages may be automatically removed. Retention settings are intended to give users greater control over how long conversation data remains available.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Task and workspace data may follow different retention rules because this information is required to provide the application&apos;s core functionality.
            </p>
          </section>

          {/* Section 8: Account Deletion */}
          <section className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Trash2 className="h-5 w-5 text-rose-500" />
              8. Account Deletion
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              You can request deletion of your TODO APP account through the <strong className="text-rose-600 dark:text-rose-400">Danger Zone</strong> section of your profile settings.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Account deletion is intended to permanently remove your account and associated personal data. Depending on the structure of the workspace and relationships with other users, deletion may affect:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 font-medium pl-2">
              <li>Account credentials</li>
              <li>Personal profile information</li>
              <li>Personal workspace data</li>
              <li>Tasks owned exclusively by the deleted account</li>
              <li>Comments and associated content</li>
              <li>Chat history</li>
              <li>Collaboration information</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium pt-1">
              Some information may remain where it is necessary to preserve the functionality of a shared workspace or where retention is required for security, technical, or legal reasons. Once deleted, account information may not be recoverable.
            </p>
          </section>

          {/* Section 9: Workspace & Collaborator Access */}
          <section className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              9. Workspace & Collaborator Access
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              TODO APP is designed around collaborative workspaces. When you invite another user to a workspace, that user may be able to access information associated with that workspace according to the permissions you provide.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              This may include tasks, task descriptions, comments, due dates, priorities, assigned users, workspace conversations, and other shared workspace information.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              You are responsible for managing workspace membership and granting access only to users you trust.
            </p>
          </section>

          {/* Section 10: Cookies & Local Storage */}
          <section className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Cookie className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              10. Cookies & Local Storage
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              TODO APP may use browser storage technologies such as cookies, local storage, or session storage to provide application functionality.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              These technologies may be used to:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 font-medium pl-2">
              <li>Maintain authentication state</li>
              <li>Store user preferences</li>
              <li>Remember interface settings</li>
              <li>Maintain temporary application state</li>
              <li>Improve application performance</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium pt-1">
              Where possible, these technologies are limited to information necessary for the operation of the application.
            </p>
          </section>

          {/* Section 11: Third-Party Services */}
          <section className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Server className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              11. Third-Party Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              TODO APP may rely on third-party infrastructure or services required to operate the application, including hosting, database infrastructure, file storage, authentication, image storage, application monitoring, error reporting, and network infrastructure.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Third-party providers may process limited information on behalf of TODO APP when necessary to provide their services. We aim to use providers that maintain appropriate security practices and protect information processed through their infrastructure.
            </p>
          </section>

          {/* Section 12: Data Sharing */}
          <section className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Share2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              12. Data Sharing
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              We do not intentionally sell your personal information.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Your information may be shared only when necessary to:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 font-medium pl-2">
              <li>Provide application functionality</li>
              <li>Operate supporting infrastructure</li>
              <li>Maintain application security</li>
              <li>Process technical requests</li>
              <li>Comply with applicable legal requirements</li>
              <li>Protect the rights and safety of users and the service</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium pt-1">
              Information within a workspace may also be visible to other users who have been granted access to that workspace.
            </p>
          </section>

          {/* Section 13: Your Data Rights */}
          <section className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              13. Your Data Rights
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Depending on your location and applicable laws, you may have rights regarding your personal information, including the ability to:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 font-medium pl-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account</li>
              <li>Request deletion of certain personal data</li>
              <li>Manage notification and application preferences</li>
              <li>Control access to your workspaces</li>
              <li>Request information about how your data is processed</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium pt-1">
              Some requests may be subject to technical, legal, or security limitations.
            </p>
          </section>

          {/* Section 14: Children's Privacy */}
          <section className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              14. Children&apos;s Privacy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              TODO APP is not intended to knowingly collect personal information from children where such collection is prohibited by applicable law. If you believe that a child has provided personal information to the service without appropriate authorization, please contact the TODO APP team so that appropriate action can be taken.
            </p>
          </section>

          {/* Section 15: Data Security Incidents */}
          <section className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              15. Data Security Incidents
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              If we become aware of a security incident that materially affects user information, we may take appropriate steps to investigate, contain, and remediate the incident. Where required by applicable law, affected users or relevant authorities may be notified.
            </p>
          </section>

          {/* Section 16: Changes to This Privacy Policy */}
          <section className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <RefreshCw className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              16. Changes to This Privacy Policy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              We may update this Privacy Policy from time to time. Changes may be necessary when new features are introduced, data-processing practices change, security measures are updated, legal or regulatory requirements change, or the application&apos;s infrastructure changes.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              When changes are made, the <strong className="text-slate-900 dark:text-white">Last updated</strong> date at the top of this document will be updated. We encourage users to review this Privacy Policy periodically.
            </p>
          </section>

          {/* Section 17: Contact */}
          <section className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              17. Contact
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              If you have questions about this Privacy Policy, your personal data, account deletion, or data security, please contact the TODO APP team through the support or contact channels provided by the application. We will make reasonable efforts to review and respond to privacy-related requests.
            </p>
          </section>

          {/* Section 18: Summary */}
          <section className="space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              18. Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              In short, TODO APP is designed around the following principles:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                "Your account belongs to you.",
                "Passwords are not stored in plain text.",
                "Private workspace data is protected by authentication and authorization.",
                "Connections are protected using HTTPS/SSL/TLS.",
                "You control workspace collaboration and access.",
                "Chat retention can be configured where supported.",
                "You can request account deletion through your profile settings.",
                "We do not intentionally sell your personal information.",
              ].map((point, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/30 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
