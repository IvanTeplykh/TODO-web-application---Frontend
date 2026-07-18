"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  className?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_SHORT = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function DatePicker({ value, onChange, className = "" }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial date or default to today's month/year
  const initialDate = value ? new Date(value) : new Date();
  const [currentYear, setCurrentYear] = useState(
    isNaN(initialDate.getTime()) ? new Date().getFullYear() : initialDate.getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    isNaN(initialDate.getTime()) ? new Date().getMonth() : initialDate.getMonth()
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Sync year/month with value if value changes externally
  useEffect(() => {
    if (value) {
      const parts = value.split("-").map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) {
        setCurrentYear(parts[0]);
        setCurrentMonth(parts[1] - 1);
      }
    }
  }, [value]);

  const formatDateLabel = (dateStr: string): string => {
    if (!dateStr) return "Select date...";
    const parts = dateStr.split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return "Select date...";
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Date calculation helpers
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    // Adjust so Monday is 0, Sunday is 6
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSelectDay = (dayNum: number) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const dateString = `${currentYear}-${pad(currentMonth + 1)}-${pad(dayNum)}`;
    onChange(dateString);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const dateString = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    onChange(dateString);
    setIsOpen(false);
  };

  // Render variables
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Total grid slots (prev month days padding + current month days)
  const gridSlots = [];
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1 < 0 ? 11 : currentMonth - 1);
  
  // Padding from previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    gridSlots.push({
      dayNum: prevMonthDays - i,
      isCurrentMonth: false,
      key: `prev-${i}`
    });
  }

  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    gridSlots.push({
      dayNum: i,
      isCurrentMonth: true,
      key: `curr-${i}`
    });
  }

  // Check if a day is currently selected
  const isSelected = (dayNum: number) => {
    if (!value) return false;
    const parts = value.split("-").map(Number);
    return parts[0] === currentYear && parts[1] === (currentMonth + 1) && parts[2] === dayNum;
  };

  // Check if a day is today
  const isToday = (dayNum: number) => {
    const today = new Date();
    return today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === dayNum;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/30 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all hover:bg-slate-50 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950 cursor-pointer"
      >
        <span className={value ? "text-slate-800 dark:text-slate-100 font-medium" : "text-slate-400 font-medium"}>
          {formatDateLabel(value)}
        </span>
        <CalendarIcon className="h-4.5 w-4.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 sm:left-0 z-50 mb-1.5 w-[230px] rounded-2xl border border-slate-200/60 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-1 duration-150 select-none">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 font-sans">
              {MONTHS[currentMonth]} {currentYear}
            </h4>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex h-5.5 w-5.5 items-center justify-center rounded-lg border border-slate-150 text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:text-slate-450 dark:hover:bg-slate-800/80 dark:hover:text-slate-150 transition-colors"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-5.5 w-5.5 items-center justify-center rounded-lg border border-slate-150 text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:text-slate-450 dark:hover:bg-slate-800/80 dark:hover:text-slate-150 transition-colors"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS_SHORT.map((day) => (
              <span key={day} className="text-[10px] font-bold text-slate-400 dark:text-slate-550 font-sans">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {gridSlots.map((slot) => {
              const current = slot.isCurrentMonth;
              const selected = current && isSelected(slot.dayNum);
              const today = current && isToday(slot.dayNum);

              return (
                <button
                  key={slot.key}
                  type="button"
                  disabled={!current}
                  onClick={() => handleSelectDay(slot.dayNum)}
                  className={`flex h-6.5 w-6.5 items-center justify-center rounded-lg text-[10px] font-semibold font-sans transition-all ${
                    !current
                      ? "text-slate-300 dark:text-slate-700 cursor-default pointer-events-none"
                      : selected
                      ? "bg-indigo-650 text-white font-bold dark:bg-indigo-500 shadow-md shadow-indigo-500/20"
                      : today
                      ? "border border-indigo-500 text-indigo-600 font-bold dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/10"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {slot.dayNum}
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-2 mt-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="text-[10px] font-bold text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
