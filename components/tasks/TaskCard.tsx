"use client";

import React, { useState } from "react";
import { Task } from "../../types/task";
import { useTaskStore } from "../../store/taskStore";
import { getTaskFields, formatDate, isOverdue } from "../../lib/taskHelpers";
import { Checkbox } from "../ui/Checkbox";
import { Calendar, ArrowRight, AlertCircle, MessageSquare } from "lucide-react";
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
  let priorityStyle = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
  let priorityIcon = "🟢";
  
  if (task.priority >= 8) {
    priorityLabel = "High";
    priorityStyle = "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
    priorityIcon = "🔥";
  } else if (task.priority >= 4) {
    priorityLabel = "Medium";
    priorityStyle = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
    priorityIcon = "🟡";
  }

  return (
    <div 
      onClick={() => onView(task)}
      className={`group relative rounded-2xl border p-5 cursor-pointer transition-all duration-200 glass-card ${
        task.completed 
          ? "border-slate-200/50 dark:border-slate-800/40 opacity-70 hover:opacity-90 bg-slate-50/50 dark:bg-slate-900/30" 
          : overdue
            ? "border-rose-300 dark:border-rose-900/60 bg-rose-500/5 dark:bg-rose-950/10 hover:border-rose-400"
            : "hover:border-indigo-400/80 dark:hover:border-indigo-500/60"
      }`}
    >
      {/* Top row: Checkbox, Title and Priority */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-start gap-3 min-w-0" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={task.completed}
            disabled={isToggling}
            onChange={handleToggle}
            className="mt-0.5 flex-shrink-0"
          />
          <h3 className={`text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 break-words leading-snug line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
            task.completed ? "line-through text-slate-400 dark:text-slate-500 font-medium" : ""
          }`}>
            {title}
          </h3>
        </div>
        
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {task.has_unread_comments && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white shadow-xs animate-pulse">
              <MessageSquare className="h-2.5 w-2.5" />
              {task.unread_comments_count ? `${task.unread_comments_count} new` : "New comment"}
            </span>
          )}
          {task.my_access_level && task.my_access_level !== "owner" && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
              task.my_access_level === "full_access"
                ? "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800"
                : "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800"
            }`}>
              {task.my_access_level === "full_access" ? "Co-owner" : "Collaborator"}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${priorityStyle}`}>
            <span className="text-[10px]">{priorityIcon}</span>
            <span>{priorityLabel}</span>
          </span>
        </div>
      </div>

      {/* Body: Description snippet */}
      <div className="pl-7 sm:pl-8 mb-4 min-h-[38px]">
        {description ? (
          <p className={`text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed ${
            task.completed ? "line-through text-slate-400 dark:text-slate-500" : ""
          }`}>
            {description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">
            No description provided.
          </p>
        )}
      </div>

      {/* Footer: Due date and indicator */}
      <div className="pl-7 sm:pl-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <div>
          {dueDate ? (
            <div className="flex items-center gap-1.5">
              <Calendar className={`h-3.5 w-3.5 ${overdue ? "text-rose-500" : "text-slate-400 dark:text-slate-400"}`} />
              <span className={overdue ? "text-rose-600 dark:text-rose-400 font-bold" : "text-slate-600 dark:text-slate-300"}>
                {formatDate(dueDate)}
              </span>
              {overdue && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <AlertCircle className="h-2.5 w-2.5" />
                  Overdue
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400">No due date</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-semibold transition-colors">
          <span>View</span>
          <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
