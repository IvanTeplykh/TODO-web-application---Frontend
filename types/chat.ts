export interface ChatUser {
  id: string;
  username: string;
  avatar_url?: string | null;
  is_online: boolean;
  connection_status?: "accepted" | "pending_sent" | "pending_received" | "none";
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string | null;
  recipient_id: string;
  content: string;
  content_hash?: string;
  created_at: string;
  is_edited?: boolean;
  updated_at?: string | null;
}

export interface ChatRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  requester_avatar?: string | null;
  recipient_id: string;
  recipient_name: string;
  recipient_avatar?: string | null;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string | null;
  avatar_url?: string | null;
  owner_id: string;
  created_at: string;
  my_role?: "owner" | "admin" | "member" | string;
  members_count: number;
}

export interface ChannelMember {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string | null;
  role: "owner" | "admin" | "member" | string;
  status?: "pending" | "accepted";
  joined_at: string;
}

export interface ChannelInvite {
  id: string;
  channel_id: string;
  channel_name: string;
  channel_description?: string | null;
  channel_avatar?: string | null;
  created_at: string;
}

export type ChatRecipient = {
  id: string; // user UUID, 'global', or channel UUID
  name: string;
  avatar_url?: string | null;
  is_global?: boolean;
  is_channel?: boolean;
  description?: string | null;
  my_role?: string | null;
  members_count?: number;
  is_online?: boolean;
  connection_status?: "accepted" | "pending_sent" | "pending_received" | "none";
};
