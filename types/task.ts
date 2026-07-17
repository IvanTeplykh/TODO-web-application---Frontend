export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  description?: string;
  due_date?: string;
  created_at: string;
  updated_at?: string;
}
