/**
 * MAX Task Manager - Client Helper
 * 
 * Uso para agentes enviar tasks:
 * 
 * import { createTask } from '@/lib/task-manager';
 * await createTask({
 *   title: 'Atualizar estoque',
 *   description: 'Sincronizar com Mitryus',
 *   priority: 'alta',
 *   agent: 'Ine',
 *   metric: 'Estoque sincronizado'
 * });
 */

const API_URL = process.env.NEXT_PUBLIC_TASK_API_URL || 'http://localhost:3000';

export interface TaskInput {
  title: string;
  description?: string;
  priority?: 'alta' | 'media' | 'baixa';
  deadline?: string;
  metric?: string;
  agent?: string;
}

export interface TaskResponse {
  success: boolean;
  task?: {
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
  };
  error?: string;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string | null;
  status?: 'pending' | 'in_progress' | 'done' | 'blocked';
  priority?: 'alta' | 'media' | 'baixa';
  deadline?: string | null;
  metric?: string | null;
  agent?: string | null;
}

/**
 * Cria uma nova task no sistema MAX Task Manager
 * 
 * @param task - Dados da task
 * @returns Promise com resultado da criação
 */
export async function createTask(task: TaskInput): Promise<TaskResponse> {
  try {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to create task',
      };
    }

    return {
      success: true,
      task: data.task,
    };
  } catch (error) {
    console.error('Error creating task:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Lista todas as tasks
 */
export async function listTasks(): Promise<TaskResponse> {
  try {
    const response = await fetch(`${API_URL}/api/tasks`);
    const data = await response.json();

    return {
      success: true,
      task: data.tasks,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Atualiza uma task existente
 */
export async function updateTask(taskId: string, input: TaskUpdateInput): Promise<TaskResponse> {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to update task',
      };
    }

    return {
      success: true,
      task: data.task,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Remove uma task
 */
export async function deleteTask(taskId: string): Promise<TaskResponse> {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to delete task',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
