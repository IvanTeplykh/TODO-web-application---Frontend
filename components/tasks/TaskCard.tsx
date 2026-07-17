"use client";

import React, { useState } from "react";
import { Task } from "../../types/task";
import { useTaskStore } from "../../store/taskStore";
import { getTaskFields, formatDate, isOverdue } from "../../lib/taskHelpers";
import { Checkbox } from "../ui/Checkbox";
import { Calendar, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  onView: (task: Task) => void;
}

export function TaskCard({ task, onView }: TaskCardProps) {
  const { toggleTask } = useTaskStore();
  const [isToggling, setIsToggling] = useState(false);

  const { title, description, dueDate } = getTaskFields(task);
  const overdue = isOverdue(dueDate, task.completed);

  const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setIsToggling(true);
    try {
      await toggleTask(task.id, e.target.checked);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to toggle task status");
    } finally {
      setIsToggling(false);
    }
  };

  // Determine priority color schema
  let priorityLabel = "Low";
  let priorityStyle = "bg-emerald-50 text-emerald-700 dark:bg-emerald-550/10 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-500/20";
  let priorityIcon = "🟢";
  
  if (task.priority >= 8) {
    priorityLabel = "High";
    priorityStyle = "bg-rose-50 text-rose-700 dark:bg-rose-550/10 dark:text-rose-400 border-rose-100/50 dark:border-rose-500/20";
    priorityIcon = "🔥";
  } else if (task.priority >= 4) {
    priorityLabel = "Medium";
    priorityStyle = "bg-amber-50 text-amber-700 dark:bg-amber-550/10 dark:text-amber-400 border-amber-100/50 dark:border-amber-500/20";
    priorityIcon = "🟡";
  }

  return (
    <div 
      onClick={() => onView(task)}
      className={`group relative rounded-2xl border bg-white p-5 cursor-pointer transition-all duration-300 hover:shadow-lg dark:bg-slate-900 ${
        task.completed 
          ? "border-slate-100 dark:border-slate-800/60 opacity-60 hover:opacity-80" 
          : overdue
            ? "border-rose-200 dark:border-rose-900/50 bg-rose-50/5 dark:bg-rose-950/5 shadow-rose-100/10 hover:border-rose-400"
            : "border-slate-200/60 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500/50"
      }`}
    >
      {/* Top row: Checkbox, Title and Priority */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-3 min-w-0" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={task.completed}
            disabled={isToggling}
            onChange={handleToggle}
            className="mt-1 flex-shrink-0"
          />
          <h3 className={`text-base font-bold text-slate-800 dark:text-slate-150 break-words leading-snug line-clamp-1 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors ${
            task.completed ? "line-through text-slate-400 dark:text-slate-500 font-medium" : ""
          }`}>
            {title}
          </h3>
        </div>
        
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityStyle} flex-shrink-0`}>
          <span className="text-[10px]">{priorityIcon}</span>
          <span>{priorityLabel}</span>
        </span>
      </div>

      {/* Body: Description snippet */}
      <div className="pl-8 mb-4 min-h-[40px]">
        {description ? (
          <p className={`text-xs text-slate-500 dark:text-slate-405 line-clamp-2 leading-relaxed ${
            task.completed ? "line-through text-slate-400 dark:text-slate-500" : ""
          }`}>
            {description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-600 italic">
            No description provided.
          </p>
        )}
      </div>

      {/* Footer: Due date and indicator */}
      <div className="pl-8 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 pt-3 text-[11px] font-medium text-slate-400 dark:text-slate-550">
        <div>
          {dueDate ? (
            <div className="flex items-center gap-1.5">
              <Calendar className={`h-3.5 w-3.5 ${overdue ? "text-rose-500" : "text-slate-400"}`} />
              <span className={overdue ? "text-rose-600 dark:text-rose-450 font-bold" : "text-slate-500 dark:text-slate-400"}>
                {formatDate(dueDate)}
              </span>
              {overdue && (
                <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-extrabold bg-rose-50 text-rose-600 border border-rose-100/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
                  <AlertCircle className="h-2 w-2" />
                  Overdue
                </span>
              )}
            </div>
          ) : (
            <span>No due date</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <span>View</span>
          <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
