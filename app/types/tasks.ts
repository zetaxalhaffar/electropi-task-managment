export type TaskStatus = "pending" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskAssignee {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  assignee: TaskAssignee;
  category: string;
  tags: string[];
  estimatedHours: number;
  completedHours: number;
  progress: number;
  details: string;
  acceptanceCriteria: string[];
  attachments: TaskAttachment[];
  commentsCount: number;
}

export interface TaskPayload {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}
