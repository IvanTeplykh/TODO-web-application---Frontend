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
};
