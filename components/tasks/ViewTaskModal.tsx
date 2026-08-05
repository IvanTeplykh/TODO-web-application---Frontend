"use client";

import React, { useState, useEffect } from "react";
import { Task, TaskComment } from "../../types/task";
import { useTaskStore } from "../../store/taskStore";
import { useAuthStore } from "../../store/authStore";
import { tasksService } from "../../services/tasks";
import { getTaskFields, formatDate, isOverdue } from "../../lib/taskHelpers";
import { X, Calendar, Clock, Trash2, Edit2, Loader2, History, Share2, MessageSquare, Send, Users, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { Input } from "../ui/Input";
import { ConfirmModal } from "../ui/ConfirmModal";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

interface ViewTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onShare?: (task: Task) => void;
  onHistory?: (task: Task) => void;
}

export function ViewTaskModal({ task, isOpen, onClose, onEdit, onShare, onHistory }: ViewTaskModalProps) {
  useLockBodyScroll(isOpen);

  const { user: currentUser } = useAuthStore();
  const { deleteTask, toggleTask, tasks } = useTaskStore();
  const currentTask = task ? (tasks.find((t) => t.id === task.id) || task) : null;

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Comments state
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    if (isOpen && currentTask) {
      loadComments(currentTask.id);
    }
  }, [isOpen, currentTask?.id]);

  const loadComments = async (taskId: string) => {
    setLoadingComments(true);
    try {
      const data = await tasksService.getComments(taskId);
      setComments(data);
      // Refresh task list to clear unread comments badge
      useTaskStore.getState().fetchTasks();
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTask || !newCommentText.trim()) return;
    setIsPostingComment(true);
    try {
      const newComment = await tasksService.createComment(currentTask.id, newCommentText.trim());
      setComments((prev) => [...prev, newComment]);
      setNewCommentText("");
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to add comment");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleRemoveCollaborator = async (targetUserId: string, username: string) => {
    if (!currentTask) return;
    try {
      await tasksService.removeCollaborator(currentTask.id, targetUserId);
      toast.success(`Removed @${username} from task`);
      useTaskStore.getState().fetchTasks();
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to remove collaborator");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentTask) return;
    try {
      await tasksService.deleteComment(currentTask.id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted");
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to delete comment");
    }
  };

  const handleSaveEditComment = async (commentId: string) => {
    if (!currentTask || !editCommentText.trim()) return;
    try {
      const updated = await tasksService.updateComment(currentTask.id, commentId, editCommentText.trim());
      setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
      setEditingCommentId(null);
      setEditCommentText("");
      toast.success("Comment updated!");
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to update comment");
    }
  };

  if (!isOpen || !currentTask) return null;

  const isOwner = currentTask.my_access_level === "owner" || !currentTask.my_access_level;
  const canEdit = isOwner || currentTask.my_access_level === "full_access";

  const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentTask) return;
    setIsToggling(true);
    try {
      await toggleTask(currentTask.id, e.target.checked);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to toggle task status");
    } finally {
      setIsToggling(false);
    }
  };

  const { title, description, dueDate } = getTaskFields(currentTask);
  const overdue = isOverdue(dueDate, currentTask.completed);

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(currentTask.id);
      setIsDeleteConfirmOpen(false);
      onClose();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to delete task");
      setIsDeleteConfirmOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Priority details
  let priorityLabel = "Low";
  let priorityColor = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
  let priorityDot = "bg-emerald-500";
  if (currentTask.priority >= 8) {
    priorityLabel = "High";
    priorityColor = "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
    priorityDot = "bg-rose-500";
  } else if (currentTask.priority >= 4) {
    priorityLabel = "Medium";
    priorityColor = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
    priorityDot = "bg-amber-500";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl max-w-lg md:max-w-2xl w-full overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/60 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-md font-bold text-slate-800 dark:text-slate-100">
              Task Details
            </h2>
            {currentTask.my_access_level && currentTask.my_access_level !== "owner" && (
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                currentTask.my_access_level === "full_access"
                  ? "bg-indigo-100 text-indigo-600 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400"
                  : "bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400"
              }`}>
                {currentTask.my_access_level === "full_access" ? "Co-owner" : "Status Only"}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col p-6 space-y-5 overflow-y-auto flex-1">
          {/* Title and Priority Badge */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-150 leading-snug break-words">
              {title}
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${priorityColor} flex-shrink-0`}>
              <span className={`h-1.5 w-1.5 rounded-full ${priorityDot}`} />
              {priorityLabel}
            </span>
          </div>

          {/* Description */}
          {description ? (
            <div className="space-y-1.5">
              <span className="block text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Description
              </span>
              <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50/50 dark:bg-slate-955/20 p-3 rounded-xl border border-slate-100/50 dark:border-slate-800/40">
                {description}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <span className="block text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Description
              </span>
              <p className="text-sm text-slate-400 dark:text-slate-550 italic">
                No description provided.
              </p>
            </div>
          )}

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
            {/* Status */}
            <div>
              <span className="block text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Status
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Checkbox
                  checked={currentTask.completed}
                  disabled={isToggling}
                  onChange={handleToggle}
                  id="modal-task-completed"
                />
                <label 
                  htmlFor="modal-task-completed"
                  className={`text-sm font-semibold cursor-pointer select-none ${
                    currentTask.completed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-500"
                  }`}
                >
                  {currentTask.completed ? "Completed" : "In Progress"}
                </label>
                {isToggling && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <span className="block text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Due Date
              </span>
              {dueDate ? (
                <div className="flex items-center gap-1.5">
                  <Calendar className={`h-4 w-4 ${overdue ? "text-rose-500" : "text-slate-450 dark:text-slate-500"}`} />
                  <span className={`text-sm font-medium ${overdue ? "text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300"}`}>
                    {formatDate(dueDate)}
                  </span>
                  {overdue && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
                      Overdue
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-slate-400 dark:text-slate-500 italic">
                  No due date
                </span>
              )}
            </div>

            {/* Owner */}
            <div>
              <span className="block text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Owner
              </span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                @{currentTask.owner_username || "Owner"}
              </span>
            </div>

            {/* Created At */}
            <div>
              <span className="block text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Created
              </span>
              <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>
                  {new Date(currentTask.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>

            {/* Collaborators */}
            <div className="col-span-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
              <span className="block text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-indigo-500" />
                Collaborators ({currentTask.collaborators?.length || 0})
              </span>
              {currentTask.collaborators && currentTask.collaborators.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentTask.collaborators.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <span>@{c.username}</span>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${
                        c.access_level === "full_access"
                          ? "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400"
                          : "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400"
                      }`}>
                        {c.access_level === "full_access" ? "Co-owner" : "Status Only"}
                      </span>
                      {isOwner && (
                        <button
                          onClick={() => handleRemoveCollaborator(c.user_id, c.username)}
                          className="p-0.5 ml-0.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title={`Remove @${c.username}`}
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-400 dark:text-slate-500 italic block">
                  No active collaborators
                </span>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />
                Comments ({comments.length})
              </span>
            </div>

            {/* List of comments */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {loadingComments ? (
                <p className="text-xs text-slate-400 italic text-center py-2">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-2">No comments yet. Leave a comment below!</p>
              ) : (
                comments.map((c) => {
                  const isAuthor = currentUser?.id === c.user_id;
                  const canDeleteComment = isAuthor || isOwner;
                  const isEditing = editingCommentId === c.id;

                  return (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            @{c.author_name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(c.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        {!isEditing && (
                          <div className="flex items-center gap-1">
                            {isAuthor && (
                              <button
                                onClick={() => {
                                  setEditingCommentId(c.id);
                                  setEditCommentText(c.content);
                                }}
                                className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                title="Edit comment"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                            )}
                            {canDeleteComment && (
                              <button
                                onClick={() => handleDeleteComment(c.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                                title="Delete comment"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 pt-1">
                          <Input
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="text-xs h-9"
                            autoFocus
                          />
                          <div className="flex items-center justify-end gap-1.5">
                            <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => setEditingCommentId(null)}>
                              Cancel
                            </Button>
                            <Button size="sm" variant="primary" className="h-7 text-xs px-2" onClick={() => handleSaveEditComment(c.id)}>
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {c.content}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Post new comment form */}
            <form onSubmit={handlePostComment} className="flex gap-2 items-center pt-1">
              <Input
                placeholder="Write a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="text-xs h-9 flex-1"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                className="h-9 px-3 text-xs"
                loading={isPostingComment}
                disabled={!newCommentText.trim()}
                icon={<Send className="h-3.5 w-3.5" />}
              >
                Send
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 flex-shrink-0">
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            {isOwner && (
              <Button
                type="button"
                variant="outline"
                className="text-rose-600 border-rose-100 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:border-rose-950/30 dark:hover:bg-rose-950/20 text-xs sm:text-sm px-2.5 sm:px-3"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                icon={<Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              >
                Delete
              </Button>
            )}

            <div className="flex items-center gap-2">
              {onHistory && (
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs sm:text-sm px-2.5 sm:px-3"
                  onClick={() => onHistory(currentTask)}
                  icon={<History className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                >
                  History
                </Button>
              )}

              {isOwner && onShare && (
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs sm:text-sm px-2.5 sm:px-3"
                  onClick={() => onShare(currentTask)}
                  icon={<Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                >
                  Share
                </Button>
              )}
            </div>
          </div>

          {canEdit && (
            <Button
              type="button"
              variant="primary"
              className="w-full sm:w-auto text-xs sm:text-sm justify-center"
              onClick={() => onEdit(currentTask)}
              icon={<Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            >
              Edit Task
            </Button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
