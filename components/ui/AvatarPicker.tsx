"use client";

import React, { useRef, useState } from "react";
import { Camera, Trash2, Link as LinkIcon, Upload, Hash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./Button";
import { Input } from "./Input";

interface AvatarPickerProps {
  value: string;
  onChange: (url: string) => void;
  fallbackText?: string;
  label?: string;
  shape?: "circle" | "rounded";
}

export function AvatarPicker({
  value,
  onChange,
  fallbackText = "CH",
  label = "Channel Avatar",
  shape = "rounded",
}: AvatarPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPEG, PNG, WEBP)");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const rawUrl = reader.result;
          const img = new Image();
          img.src = rawUrl;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxDim = 300;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxDim) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              }
            } else {
              if (height > maxDim) {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL("image/jpeg", 0.85);
              onChange(compressed);
            } else {
              onChange(rawUrl);
            }
          };
          img.onerror = () => {
            onChange(rawUrl);
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInputValue.trim()) {
      onChange(urlInputValue.trim());
      setUrlInputValue("");
      setShowUrlInput(false);
      toast.success("Image URL applied");
    }
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const shapeClasses = shape === "circle" ? "rounded-full" : "rounded-2xl";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
        {/* Avatar Preview */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative group h-16 w-16 ${shapeClasses} overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center flex-shrink-0 cursor-pointer shadow-xs`}
        >
          {value ? (
            <img src={value} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
              {fallbackText.substring(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/jpg,image/webp"
          className="hidden"
        />

        {/* Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-[11px] px-2.5 font-semibold"
              onClick={() => fileInputRef.current?.click()}
              icon={<Upload className="h-3.5 w-3.5" />}
            >
              Upload Photo
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-[11px] px-2 font-semibold text-slate-600 dark:text-slate-400"
              onClick={() => setShowUrlInput(!showUrlInput)}
              icon={<LinkIcon className="h-3.5 w-3.5" />}
            >
              {showUrlInput ? "Hide Link" : "Image Link"}
            </Button>

            {value && (
              <button
                type="button"
                onClick={handleClear}
                title="Remove photo"
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-auto"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* URL Input Box */}
          {showUrlInput && (
            <div className="flex gap-1.5 pt-1 animate-in fade-in duration-150">
              <Input
                id="avatar-url-input"
                placeholder="Paste image URL (https://...)"
                value={urlInputValue}
                onChange={(e) => setUrlInputValue(e.target.value)}
                className="h-8 text-[11px]"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="h-8 text-[11px] px-2.5"
                onClick={handleApplyUrl}
                disabled={!urlInputValue.trim()}
              >
                Apply
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
