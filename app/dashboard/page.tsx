"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Navbar } from "../../components/layout/Navbar";
import { Sidebar } from "../../components/layout/Sidebar";
import { Footer } from "../../components/layout/Footer";
import { Statistics } from "../../components/tasks/Statistics";
import { TaskForm } from "../../components/tasks/TaskForm";
import { SearchBar } from "../../components/tasks/SearchBar";
import { FilterBar } from "../../components/tasks/FilterBar";
import { SortDropdown } from "../../components/tasks/SortDropdown";
import { TaskList } from "../../components/tasks/TaskList";
import { Pagination } from "../../components/ui/Pagination";
import { useTaskStore } from "../../store/taskStore";
import { Task } from "../../types/task";

export default function DashboardPage() {
  const { page, pages, setPage, fetchTasks } = useTaskStore();
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setTaskToEdit(null);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <div className="flex flex-1">
          <Sidebar />
          
          <main className="flex-1 bg-slate-50/50 dark:bg-slate-950/20 p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-805 dark:text-slate-100">
                Task Workspace
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Manage your daily goals, priorities, and monitor performance stats.
              </p>
            </div>

            <TaskForm taskToEdit={taskToEdit} onCancelEdit={handleCancelEdit} />

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-6">
              <div className="w-full sm:max-w-xs">
                <SearchBar />
              </div>
              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <FilterBar />
                <SortDropdown />
              </div>
            </div>

            <TaskList onEditTask={handleEdit} />

            <Statistics />

            <Pagination
              currentPage={page}
              totalPages={pages}
              onPageChange={setPage}
            />
          </main>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
