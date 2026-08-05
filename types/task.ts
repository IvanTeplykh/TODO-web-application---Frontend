export interface TaskCollaborator {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string | null;
  access_level: "status_only" | "full_access";
  created_at: string;
}

export interface TaskShareRequest {
  id: string;
  task_id: string;
  task_title: string;
  owner_id: string;
  owner_username: string;
  target_user_id: string;
  target_username: string;
  access_level: "transfer" | "status_only" | "full_access";
  passcode?: string | null;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

export interface TaskHistoryItem {
  id: string;
  task_id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  details?: string | null;
  created_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  author_name: string;
  author_avatar_url?: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  title_hash?: string;
  completed: boolean;
  completed_hash?: string;
  priority: number;
  priority_hash?: string;
  description?: string;
  description_hash?: string | null;
  due_date?: string;
  created_at: string;
  updated_at?: string;
  owner_id: string;
  owner_username?: string;
  my_access_level?: "owner" | "full_access" | "status_only";
  collaborators?: TaskCollaborator[];
  has_unread_comments?: boolean;
  unread_comments_count?: number;
}
