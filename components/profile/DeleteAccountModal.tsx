"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Lock, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  isLoading?: boolean;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter your account password to confirm");
      return;
    }
    setError("");
    try {
      await onConfirm(password);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to delete account. Please check your password.");
    }
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-950/20">
          <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5" />
            Delete Account Permanently
          </h2>
          <button 
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
            disabled={isLoading}
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 bg-rose-500/10 rounded-xl border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 space-y-2">
            <p className="font-semibold">⚠️ Danger Zone: Account Deletion</p>
            <p className="leading-relaxed text-[11px] opacity-90">
              This action is permanent and cannot be undone. All personal profile data and unshared tasks will be deleted.
            </p>
            <p className="leading-relaxed text-[11px] opacity-90">
              <strong>Shared Tasks:</strong> Tasks where you are the Owner will automatically transfer ownership to the first Co-Owner or Collaborator in line.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm Your Password
            </label>
            <div className="relative">
              <Input
                type="password"
                placeholder="Enter account password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
                className="pl-9 text-xs"
                autoFocus
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            {error && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium animate-in fade-in duration-150">
                {error}
              </p>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10"
              loading={isLoading}
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Permanently Delete Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
