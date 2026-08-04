export interface ChatUser {
  id: string;
  username: string;
  email: string;
  avatar_url?: string | null;
  is_online: boolean;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string | null;
  recipient_id: string;
  content: string;
  created_at: string;
}

export type ChatRecipient = {
  id: string; // user UUID or 'global'
  name: string;
  avatar_url?: string | null;
  is_global?: boolean;
  is_online?: boolean;
};
