"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Navbar } from "../../components/layout/Navbar";
import { Sidebar } from "../../components/layout/Sidebar";
import { Footer } from "../../components/layout/Footer";
import { Statistics } from "../../components/tasks/Statistics";
import { SearchBar } from "../../components/tasks/SearchBar";
import { FilterBar } from "../../components/tasks/FilterBar";
import { SortDropdown } from "../../components/tasks/SortDropdown";
import { TaskList } from "../../components/tasks/TaskList";
import { Pagination } from "../../components/ui/Pagination";
import { Button } from "../../components/ui/Button";
import { CreateTaskModal } from "../../components/tasks/CreateTaskModal";
import { ViewTaskModal } from "../../components/tasks/ViewTaskModal";
import { EditTaskModal } from "../../components/tasks/EditTaskModal";
import { ShareTaskModal } from "../../components/tasks/ShareTaskModal";
import { TaskSharesModal } from "../../components/tasks/TaskSharesModal";
import { TaskHistoryModal } from "../../components/tasks/TaskHistoryModal";
import { useTaskStore } from "../../store/taskStore";
import { Task } from "../../types/task";
import { Plus, Mail } from "lucide-react";

export default function DashboardPage() {
  const { page, pages, setPage, fetchTasks, createTask, pendingTaskShares, fetchPendingShares } = useTaskStore();
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTaskForView, setActiveTaskForView] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToShare, setTaskToShare] = useState<Task | null>(null);
  const [taskForHistory, setTaskForHistory] = useState<Task | null>(null);
  const [isSharesModalOpen, setIsSharesModalOpen] = useState(false);

  useEffect(() => {
    const handlePendingTask = async () => {
      const pendingTaskStr = localStorage.getItem("pending_task");
      if (pendingTaskStr) {
        localStorage.removeItem("pending_task");
        try {
          const pendingTask = JSON.parse(pendingTaskStr);
          await createTask(
            pendingTask.title,
            pendingTask.priority,
            pendingTask.description,
            pendingTask.dueDate
          );
        } catch (err) {
          console.error("Failed to save pending task on dashboard mount:", err);
        }
      }
      fetchTasks();
      fetchPendingShares();
    };

    handlePendingTask();
  }, [fetchTasks, createTask, fetchPendingShares]);

  const handleOpenEdit = (task: Task) => {
    setActiveTaskForView(null);
    setTaskToEdit(task);
  };

  const handleOpenShare = (task: Task) => {
    setActiveTaskForView(null);
    setTaskToShare(task);
  };

  const handleOpenHistory = (task: Task) => {
    setActiveTaskForView(null);
    setTaskForHistory(task);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        
        <div className="flex flex-1">
          <Sidebar />
          
          <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Organize, prioritize, and accomplish your work efficiently.
                </p>
              </div>

              {pendingTaskShares.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="relative rounded-2xl border-amber-300/80 dark:border-amber-700/80 bg-amber-50/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold hover:bg-amber-100 transition-all gap-2 shadow-xs"
                  onClick={() => setIsSharesModalOpen(true)}
                  icon={<Mail className="h-4 w-4 text-amber-600" />}
                >
                  <span>Task Invitations</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white shadow-xs">
                    {pendingTaskShares.length}
                  </span>
                </Button>
              )}
            </div>

            {/* Quick stats at the top */}
            <Statistics />

            {/* Controls Bar: Search, Filter, Sort and "+ New Task" */}
            <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
              <div className="w-full md:max-w-xs">
                <SearchBar />
              </div>
              <div className="flex flex-wrap items-center justify-between md:justify-end w-full md:w-auto gap-3">
                <FilterBar />
                <SortDropdown />
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  variant="primary"
                  size="md"
                  className="rounded-2xl font-bold gap-2"
                  icon={<Plus className="h-4 w-4" />}
                >
                  New Task
                </Button>
              </div>
            </div>

            {/* Task list layout (Cards grid) */}
            <TaskList onViewTask={setActiveTaskForView} onCreateTask={() => setIsCreateOpen(true)} />

            {/* Pagination */}
            {pages > 1 && (
              <div className="pt-4 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={pages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </main>
        </div>

        {/* Modals */}
        <CreateTaskModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
        
        <ViewTaskModal
          task={activeTaskForView}
          isOpen={activeTaskForView !== null}
          onClose={() => setActiveTaskForView(null)}
          onEdit={handleOpenEdit}
          onShare={handleOpenShare}
          onHistory={handleOpenHistory}
        />
        
        <EditTaskModal
          task={taskToEdit}
          isOpen={taskToEdit !== null}
          onClose={() => setTaskToEdit(null)}
        />

        {taskToShare && (
          <ShareTaskModal
            isOpen={taskToShare !== null}
            onClose={() => {
              const currentTask = taskToShare;
              setTaskToShare(null);
              if (currentTask) setActiveTaskForView(currentTask);
            }}
            taskId={taskToShare.id}
            taskTitle={taskToShare.title}
          />
        )}

        {taskForHistory && (
          <TaskHistoryModal
            isOpen={taskForHistory !== null}
            onClose={() => {
              const currentTask = taskForHistory;
              setTaskForHistory(null);
              if (currentTask) setActiveTaskForView(currentTask);
            }}
            taskId={taskForHistory.id}
            taskTitle={taskForHistory.title}
          />
        )}

        <TaskSharesModal
          isOpen={isSharesModalOpen}
          onClose={() => setIsSharesModalOpen(false)}
        />

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
