import { create } from "zustand";
import axios from "axios";
import { Task } from "../types/task";
import { tasksService, GetTasksParams } from "../services/tasks";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  total: number;
  page: number;
  pages: number;
  limit: number;
  status: "all" | "done" | "undone" | "overdue";
  search: string;
  sort: string;
  order: "asc" | "desc";
  fetchTasks: () => Promise<void>;
  createTask: (title: string, priority: number, description?: string, dueDate?: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, title: string, priority: number, completed: boolean, description?: string, dueDate?: string) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
  setPage: (page: number) => void;
  setFilters: (filters: Partial<Omit<GetTasksParams, "page">>) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  total: 0,
  page: 1,
  pages: 1,
  limit: 10,
  status: "all",
  search: "",
  sort: "created_at",
  order: "desc",

  fetchTasks: async () => {
    set({ loading: true });
    const { page, limit, status, search, sort, order } = get();
    try {
      const response = await tasksService.getTasks({
        page,
        limit,
        status,
        search: search.trim() || undefined,
        sort,
        order,
      });
      set({
        tasks: response.items,
        total: response.total,
        page: response.page,
        pages: response.pages,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.error("Failed to fetch tasks", error);
    }
  },

  createTask: async (title: string, priority: number, description?: string, dueDate?: string) => {
    set({ loading: true });
    try {
      await tasksService.createTask(title, priority, description, dueDate);
      await get().fetchTasks();
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.detail || "Failed to create task";
      }
      throw "Failed to create task";
    }
  },

  deleteTask: async (id: string) => {
    set({ loading: true });
    try {
      await tasksService.deleteTask(id);
      
      const { page, tasks } = get();
      if (tasks.length === 1 && page > 1) {
        set({ page: page - 1 });
      }
      await get().fetchTasks();
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.detail || "Failed to delete task";
      }
      throw "Failed to delete task";
    }
  },

  updateTask: async (id: string, title: string, priority: number, completed: boolean, description?: string, dueDate?: string) => {
    set({ loading: true });
    try {
      await tasksService.updateTask(id, title, priority, completed, description, dueDate);
      await get().fetchTasks();
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.detail || "Failed to update task";
      }
      throw "Failed to update task";
    }
  },

  toggleTask: async (id: string, completed: boolean) => {
    const originalTasks = get().tasks;
    set({
      tasks: originalTasks.map((t) => (t.id === id ? { ...t, completed } : t)),
    });
    try {
      await tasksService.toggleStatus(id, completed);
      await get().fetchTasks();
    } catch (error) {
      set({ tasks: originalTasks });
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.detail || "Failed to toggle task status";
      }
      throw "Failed to toggle task status";
    }
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchTasks();
  },

  setFilters: (filters: Partial<Omit<GetTasksParams, "page">>) => {
    set({ ...filters, page: 1 });
    get().fetchTasks();
  },
}));
