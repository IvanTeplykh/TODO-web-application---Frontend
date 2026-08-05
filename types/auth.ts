export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  chat_retention_days?: number;
}
