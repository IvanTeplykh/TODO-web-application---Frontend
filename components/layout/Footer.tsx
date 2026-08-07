"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

export function Footer() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const footerLinks = [
    { label: "Documentation", href: "/docs", external: false },
    { label: "GitHub", href: "https://github.com", external: true },
    { label: "Privacy Policy", href: "/privacy", external: false },
    { label: "Terms of Service", href: "/terms", external: false },
    { label: "Contact", href: "mailto:support@todoapp.com", external: true },
  ];

  return (
    <footer className="relative w-full border-t border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80 transition-colors py-6 mt-auto">
      {/* Top glowing accent border */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4 text-xs">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-xs shadow-md shadow-indigo-500/20">
            T
          </div>
          <span className="font-black tracking-tight text-slate-900 dark:text-white">
            TODO APP
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-medium ml-1">
            &copy; {new Date().getFullYear()} Inc.
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 font-semibold text-slate-600 dark:text-slate-400">
          {footerLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Mobile Dropdown Menu (...) */}
        <div className="relative md:hidden" ref={menuRef}>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="More footer links"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-bold active:scale-95 shadow-xs border border-slate-200/60 dark:border-slate-700/60"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {mobileMenuOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-44 rounded-2xl bg-white/95 dark:bg-slate-900/95 p-1.5 shadow-2xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              {footerLinks.map((link) => {
                const content = (
                  <span className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {link.label}
                  </span>
                );

                return link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
