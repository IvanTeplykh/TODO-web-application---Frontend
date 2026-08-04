import api from "./api";
import { ChatUser, ChatMessage, ChatRequest } from "../types/chat";

export const chatService = {
  getUsers: async (): Promise<ChatUser[]> => {
    const response = await api.get<ChatUser[]>("/chat/users");
    return response.data;
  },

  getMessages: async (recipientId: string = "global", limit: number = 100): Promise<ChatMessage[]> => {
    const response = await api.get<ChatMessage[]>("/chat/messages", {
      params: { recipient_id: recipientId, limit },
    });
    return response.data;
  },

  sendRequest: async (recipientId: string): Promise<ChatRequest> => {
    const response = await api.post<ChatRequest>("/chat/requests", {
      recipient_id: recipientId,
    });
    return response.data;
  },

  getRequests: async (): Promise<ChatRequest[]> => {
    const response = await api.get<ChatRequest[]>("/chat/requests");
    return response.data;
  },

  respondRequest: async (requestId: string, action: "accept" | "decline"): Promise<ChatRequest> => {
    const response = await api.patch<ChatRequest>(`/chat/requests/${requestId}`, {
      action,
    });
    return response.data;
  },
};
