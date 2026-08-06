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

  sendMessage: async (recipientId: string, content: string): Promise<ChatMessage> => {
    const response = await api.post<ChatMessage>("/chat/messages", {
      recipient_id: recipientId,
      content,
    });
    return response.data;
  },

  editMessage: async (messageId: string, content: string): Promise<ChatMessage> => {
    const response = await api.patch<ChatMessage>(`/chat/messages/${messageId}`, {
      content,
    });
    return response.data;
  },

  deleteMessage: async (messageId: string): Promise<{ message: string; id: string }> => {
    const response = await api.delete<{ message: string; id: string }>(`/chat/messages/${messageId}`);
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

  removeContact: async (targetUserId: string): Promise<{ message: string; user_id: string }> => {
    const response = await api.delete<{ message: string; user_id: string }>(`/chat/contacts/${targetUserId}`);
    return response.data;
  },
};
