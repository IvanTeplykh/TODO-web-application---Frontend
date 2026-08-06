import api from "./api";
import { User } from "../types/auth";

export const usersService = {
  updateProfile: async (username: string, avatarUrl?: string, chatRetentionDays?: number): Promise<User> => {
    const response = await api.put<User>("/users/me", {
      username,
      avatar_url: avatarUrl || null,
      chat_retention_days: chatRetentionDays ?? 180,
    });
    return response.data;
  },
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/users/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
  verifyPassword: async (password: string): Promise<boolean> => {
    const response = await api.post<{ valid: boolean }>("/users/verify-password", {
      password,
    });
    return response.data.valid;
  },
  searchUsers: async (query: string): Promise<User[]> => {
    if (!query.trim()) return [];
    const response = await api.get<User[]>(`/users/search?q=${encodeURIComponent(query.trim())}`);
    return response.data;
  },
  deleteAccount: async (password: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>("/users/me", {
      data: { password },
    });
    return response.data;
  },
};
