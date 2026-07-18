"use client";

import React from "react";
import { X, LogOut } from "lucide-react";
import { Button } from "../ui/Button";

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmLogoutModal({ isOpen, onClose, onConfirm, isLoading = false }: ConfirmLogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl max-w-sm w-full overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/60">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <LogOut className="h-4.5 w-4.5 text-red-500" />
            Confirm Logout
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
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
            Are you sure you want to log out of your account? Any unsaved changes may be lost.
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
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/10"
            onClick={onConfirm}
            loading={isLoading}
            size="sm"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
