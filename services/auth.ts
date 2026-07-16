import api from "./api";
import { LoginInput, RegisterInput } from "../lib/validators";
import { User } from "../types/auth";

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  message: string;
}

export const authService = {
  login: async (data: LoginInput): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>("/auth/login", {
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  register: async (data: RegisterInput): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", {
      username: data.username,
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/logout");
    return response.data;
  },
};
