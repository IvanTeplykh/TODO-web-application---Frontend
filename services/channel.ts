import api from "./api";
import { Channel, ChannelMember, ChatMessage } from "../types/chat";

export const channelService = {
  createChannel: async (data: { name: string; description?: string; avatar_url?: string }): Promise<Channel> => {
    const response = await api.post<Channel>("/channels", data);
    return response.data;
  },

  getMyChannels: async (): Promise<Channel[]> => {
    const response = await api.get<Channel[]>("/channels");
    return response.data;
  },

  getChannelMembers: async (channelId: string): Promise<ChannelMember[]> => {
    const response = await api.get<ChannelMember[]>(`/channels/${channelId}/members`);
    return response.data;
  },

  updateChannel: async (
    channelId: string,
    data: { name?: string; description?: string; avatar_url?: string }
  ): Promise<Channel> => {
    const response = await api.patch<Channel>(`/channels/${channelId}`, data);
    return response.data;
  },

  deleteChannel: async (channelId: string): Promise<{ message: string; id: string }> => {
    const response = await api.delete<{ message: string; id: string }>(`/channels/${channelId}`);
    return response.data;
  },

  addMember: async (channelId: string, userId: string): Promise<ChannelMember> => {
    const response = await api.post<ChannelMember>(`/channels/${channelId}/members`, { user_id: userId });
    return response.data;
  },

  removeMember: async (channelId: string, userId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/channels/${channelId}/members/${userId}`);
    return response.data;
  },

  updateMemberRole: async (channelId: string, userId: string, role: "admin" | "member"): Promise<ChannelMember> => {
    const response = await api.patch<ChannelMember>(`/channels/${channelId}/members/${userId}/role`, { role });
    return response.data;
  },

  getChannelMessages: async (channelId: string, limit: number = 100): Promise<ChatMessage[]> => {
    const response = await api.get<ChatMessage[]>(`/channels/${channelId}/messages`, { params: { limit } });
    return response.data;
  },

  postChannelMessage: async (channelId: string, content: string): Promise<ChatMessage> => {
    const response = await api.post<ChatMessage>(`/channels/${channelId}/messages`, { content });
    return response.data;
  },

  editChannelMessage: async (channelId: string, messageId: string, content: string): Promise<ChatMessage> => {
    const response = await api.patch<ChatMessage>(`/channels/${channelId}/messages/${messageId}`, { content });
    return response.data;
  },

  deleteChannelMessage: async (channelId: string, messageId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/channels/${channelId}/messages/${messageId}`);
    return response.data;
  },
};
