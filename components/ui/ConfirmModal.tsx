"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "primary" | "warning";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  isLoading = false,
  variant = "primary"
}: ConfirmModalProps) {
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  let confirmButtonClass = "bg-indigo-650 hover:bg-indigo-750 text-white shadow-md shadow-indigo-600/10";
  if (variant === "danger") {
    confirmButtonClass = "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10";
  } else if (variant === "warning") {
    confirmButtonClass = "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/10";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl max-w-sm w-full overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/60">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
            disabled={isLoading}
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-xs text-slate-550 dark:text-slate-405 leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            size="sm"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            className={confirmButtonClass}
            onClick={onConfirm}
            loading={isLoading}
            size="sm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
