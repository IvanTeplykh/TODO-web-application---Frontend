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
import { useTaskStore } from "../../store/taskStore";
import { Task } from "../../types/task";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const { page, pages, setPage, fetchTasks, createTask } = useTaskStore();
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTaskForView, setActiveTaskForView] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    const handlePendingTask = async () => {
      const pendingTaskStr = localStorage.getItem("pending_task");
      if (pendingTaskStr) {
        // Clear the item synchronously first to prevent React 18 Strict Mode double-execution
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
    };

    handlePendingTask();
  }, [fetchTasks, createTask]);

  const handleOpenEdit = (task: Task) => {
    setActiveTaskForView(null);
    setTaskToEdit(task);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        
        <div className="flex flex-1">
          <Sidebar />
          
          <main className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                Workspace
              </h1>
            </div>

            {/* Quick stats at the top */}
            <Statistics />

            {/* Controls Bar: Search, Filter, Sort and "+ New Task" */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-t border-b border-slate-100 dark:border-slate-800/80 py-4">
              <div className="w-full md:max-w-xs">
                <SearchBar />
              </div>
              <div className="flex flex-wrap items-center justify-between md:justify-end w-full md:w-auto gap-3">
                <FilterBar />
                <SortDropdown />
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  variant="primary"
                  size="sm"
                  className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 gap-1.5"
                  icon={<Plus className="h-4 w-4" />}
                >
                  New Task
                </Button>
              </div>
            </div>

            {/* Task list layout (Cards grid) */}
            <TaskList onViewTask={setActiveTaskForView} />

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
        />
        
        <EditTaskModal
          task={taskToEdit}
          isOpen={taskToEdit !== null}
          onClose={() => setTaskToEdit(null)}
        />

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
