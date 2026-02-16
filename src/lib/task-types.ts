export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'blocked';
export type TaskPriority = 'alta' | 'media' | 'baixa';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: string | null;
  metric?: string | null;
  agent?: string | null;
  createdAt?: string;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  deadline?: string | null;
  metric?: string | null;
  agent?: string | null;
}
