import api from "./api";
import { User } from "../types/auth";

export const usersService = {
  updateProfile: async (username: string, avatarUrl?: string): Promise<User> => {
    const response = await api.put<User>("/users/me", {
      username,
      avatar_url: avatarUrl || null,
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
};
