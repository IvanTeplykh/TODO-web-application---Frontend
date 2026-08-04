import api from "./api";
import { ChatUser, ChatMessage } from "../types/chat";

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
};
