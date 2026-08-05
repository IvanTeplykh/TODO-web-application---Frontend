import api from "./api";
import { Task, TaskShareRequest, TaskHistoryItem, TaskComment } from "../types/task";
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

  shareTask: async (
    taskId: string,
    payload: { target_username: string; access_level: "transfer" | "status_only" | "full_access" }
  ): Promise<TaskShareRequest> => {
    const response = await api.post<TaskShareRequest>(`/tasks/${taskId}/share`, payload);
    return response.data;
  },

  getPendingShares: async (): Promise<TaskShareRequest[]> => {
    const response = await api.get<TaskShareRequest[]>("/tasks/shares/pending");
    return response.data;
  },

  respondShare: async (
    requestId: string,
    passcode: string,
    action: "accept" | "decline"
  ): Promise<{ message: string; status: string; task_id?: string }> => {
    const response = await api.post<{ message: string; status: string; task_id?: string }>(
      `/tasks/shares/${requestId}/respond`,
      { passcode, action }
    );
    return response.data;
  },

  getHistory: async (taskId: string): Promise<TaskHistoryItem[]> => {
    const response = await api.get<TaskHistoryItem[]>(`/tasks/${taskId}/history`);
    return response.data;
  },

  removeCollaborator: async (taskId: string, targetUserId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/tasks/${taskId}/collaborators/${targetUserId}`);
    return response.data;
  },

  getComments: async (taskId: string): Promise<TaskComment[]> => {
    const response = await api.get<TaskComment[]>(`/tasks/${taskId}/comments`);
    return response.data;
  },

  createComment: async (taskId: string, content: string): Promise<TaskComment> => {
    const response = await api.post<TaskComment>(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },

  updateComment: async (taskId: string, commentId: string, content: string): Promise<TaskComment> => {
    const response = await api.put<TaskComment>(`/tasks/${taskId}/comments/${commentId}`, { content });
    return response.data;
  },

  deleteComment: async (taskId: string, commentId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}/comments/${commentId}`);
  },
};
