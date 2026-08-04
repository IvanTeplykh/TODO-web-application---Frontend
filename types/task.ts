export interface Task {
  id: string;
  title: string;
  title_hash?: string;
  completed: boolean;
  priority: number;
  description?: string;
  description_hash?: string | null;
  due_date?: string;
  created_at: string;
  updated_at?: string;
}
