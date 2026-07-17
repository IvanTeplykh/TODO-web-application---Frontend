import { Task } from "../types/task";

/**
 * Unified helper to extract task properties directly from native backend fields.
 */
export function getTaskFields(task: Task): { title: string; description: string; dueDate: string } {
  if (!task) {
    return { title: "", description: "", dueDate: "" };
  }

  let formattedDueDate = "";
  if (task.due_date) {
    try {
      // Extract YYYY-MM-DD from ISO-8601 string
      formattedDueDate = task.due_date.split("T")[0];
    } catch {
      formattedDueDate = task.due_date;
    }
  }

  return {
    title: task.title || "",
    description: task.description || "",
    dueDate: formattedDueDate,
  };
}

/**
 * Format date helper
 */
export function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Check if a date string is in the past (overdue)
 */
export function isOverdue(dateStr?: string, completed?: boolean): boolean {
  if (!dateStr || completed) return false;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    
    // Set hours to 23:59:59 to give users until the end of the due day
    const dueTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59).getTime();
    const nowTime = new Date().getTime();
    
    return dueTime < nowTime;
  } catch {
    return false;
  }
}
