import React, { useState } from "react";
import { Task } from "../../types/task";
import { useTaskStore } from "../../store/taskStore";
import { useUIStore } from "../../store/uiStore";
import { getTaskFields, formatDate, isOverdue } from "../../lib/taskHelpers";
import { Checkbox } from "../ui/Checkbox";
import { Badge } from "../ui/Badge";
import { Calendar, ArrowRight, AlertCircle, MessageSquare, Trash2, Eye, Edit3 } from "lucide-react";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskCard({ task, onView, onEdit, onDelete }: TaskCardProps) {
  const { toggleTask, deleteTask } = useTaskStore();
  const { notificationPreferences } = useUIStore();
  const [isToggling, setIsToggling] = useState(false);

  const { title, description, dueDate } = getTaskFields(task);
  const isTaskOverdue = isOverdue(dueDate, task.completed);
  const overdue = notificationPreferences.notifyOverdue ? isTaskOverdue : false;
  const showCommentBadge = notificationPreferences.notifyComments && task.has_unread_comments;
  const showRoleBadge = notificationPreferences.notifyCollaborators && task.my_access_level && task.my_access_level !== "owner";

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(task);
      return;
    }
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task.id);
        toast.success("Task deleted successfully");
      } catch {
        toast.error("Failed to delete task");
      }
    }
  };

  // Determine priority color variant
  let priorityVariant: "success" | "warning" | "danger" = "success";
  let priorityLabel = "Low";
  
  if (task.priority >= 8) {
    priorityLabel = `High (${task.priority})`;
    priorityVariant = "danger";
  } else if (task.priority >= 4) {
    priorityLabel = `Medium (${task.priority})`;
    priorityVariant = "warning";
  } else {
    priorityLabel = `Low (${task.priority})`;
    priorityVariant = "success";
  }

  return (
    <div 
      onClick={() => onView(task)}
      className={`group relative rounded-2xl border p-5 cursor-pointer transition-all duration-200 glass-card ${
        task.completed 
          ? "border-slate-200/50 dark:border-slate-800/40 opacity-70 hover:opacity-95 bg-slate-50/50 dark:bg-slate-900/30" 
          : overdue
            ? "border-rose-300 dark:border-rose-900/60 bg-rose-500/5 dark:bg-rose-950/10 hover:border-rose-400"
            : "hover:border-indigo-500/60 dark:hover:border-indigo-500/60"
      }`}
    >
      {/* Top Header: Checkbox, Title, Badges */}
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
          {/* Role badge (Outlined) */}
          {showRoleBadge && (
            <Badge variant="info" styleType="outlined" className="text-[10px] uppercase tracking-wider py-0 px-2">
              {task.my_access_level === "full_access" ? "Co-owner" : "Collaborator"}
            </Badge>
          )}

          {/* Priority badge (Filled) */}
          <Badge variant={priorityVariant} styleType="filled" className="text-[10px] py-0.5 px-2">
            {priorityLabel}
          </Badge>
        </div>
      </div>

      {/* Description */}
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

      {/* Footer Meta & Quick Actions on Hover */}
      <div className="pl-7 sm:pl-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          {/* Due date */}
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

          {/* Unread / Comments count */}
          {showCommentBadge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white shadow-xs animate-pulse">
              <MessageSquare className="h-2.5 w-2.5" />
              {task.unread_comments_count ? `${task.unread_comments_count}` : "1"}
            </span>
          )}
        </div>

        {/* Quick Actions (Revealed on Hover) */}
        <div className="flex items-center gap-2">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                title="Edit Task"
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(task);
              }}
              title="View Details"
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDelete}
              title="Delete Task"
              className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-semibold transition-colors">
            <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
