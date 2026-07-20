import api from "./api";
import { Task } from "../types/task";
import { PaginatedResponse } from "../types/api";

export interface GetTasksParams {
  page?: number;
  limit?: number;
  status?: "all" | "done" | "undone" | "overdue";
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export const tasksService = {
  getTasks: async (params: GetTasksParams): Promise<PaginatedResponse<Task>> => {
    const response = await api.get<PaginatedResponse<Task>>("/tasks", { params });
    return response.data;
  },

  createTask: async (
    title: string,
    priority: number,
    description?: string,
    dueDate?: string
  ): Promise<Task> => {
    const response = await api.post<Task>("/tasks", {
      title,
      priority,
      description: description || null,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    });
    return response.data;
  },

  updateTask: async (
    id: string,
    title: string,
    priority: number,
    completed: boolean,
    description?: string,
    dueDate?: string
  ): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, {
      title,
      priority,
      completed,
      description: description || null,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    });
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  toggleStatus: async (id: string, completed: boolean): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/status`, { completed });
    return response.data;
  },
};
