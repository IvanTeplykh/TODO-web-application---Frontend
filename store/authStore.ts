import { create } from "zustand";
import axios from "axios";
import { User } from "../types/auth";
import { authService } from "../services/auth";
import { LoginInput, RegisterInput } from "../lib/validators";
import { getToken, setToken, removeToken } from "../lib/auth";
import { usersService } from "../services/users";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (username: string, avatarUrl?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  initialize: async () => {
    set({ loading: true });
    const token = getToken();
    if (token) {
      try {
        const user = await authService.me();
        set({ user, token, isAuthenticated: true, loading: false });
      } catch {
        removeToken();
        set({ user: null, token: null, isAuthenticated: false, loading: false });
      }
    } else {
      set({ loading: false });
    }
  },

  login: async (data: LoginInput) => {
    set({ loading: true });
    try {
      const response = await authService.login(data);
      const token = response.access_token;
      setToken(token, data.rememberMe);
      const user = await authService.me();
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.detail || "Invalid login credentials";
      }
      throw "Invalid login credentials";
    }
  },

  register: async (data: RegisterInput) => {
    set({ loading: true });
    try {
      await authService.register(data);
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.detail || "Registration failed";
      }
      throw "Registration failed";
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
    } catch {
      // Ignore logout request errors (token might have already expired)
    } finally {
      removeToken();
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },

  updateProfile: async (username: string, avatarUrl?: string) => {
    set({ loading: true });
    try {
      const updatedUser = await usersService.updateProfile(username, avatarUrl);
      set({ user: updatedUser, loading: false });
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.detail || "Failed to update profile";
      }
      throw "Failed to update profile";
    }
  },
}));
