"use client";

import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import { Plus, Trash2, Clock, Target, AlertCircle, Pencil } from "lucide-react";
import type { Task, TaskUpdateInput } from "@/lib/task-types";

const statusLabels = {
  pending: "Pendente",
  in_progress: "Em Progresso",
  done: "Concluido",
  blocked: "Bloqueado",
};

const statusColors = {
  pending: "secondary",
  in_progress: "default",
  done: "success",
  blocked: "destructive",
} as const;

const priorityColors = {
  alta: "destructive",
  media: "warning",
  baixa: "secondary",
} as const;

function parseTask(payload: Partial<Task>): Task {
  return {
    id: payload.id || "",
    title: payload.title || "",
    description: payload.description || null,
    status: payload.status || "pending",
    priority: payload.priority || "media",
    deadline: payload.deadline || null,
    metric: payload.metric || null,
    agent: payload.agent || null,
    createdAt: payload.createdAt,
  };
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [pendingTaskIds, setPendingTaskIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/tasks", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Falha ao buscar tarefas");
        }

        const parsedTasks = (data.tasks as Partial<Task>[]).map(parseTask);
        setTasks(parsedTasks);
        setError(null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    void loadTasks();
  }, []);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      inProgress: tasks.filter((t) => t.status === "in_progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    }),
    [tasks]
  );

  const setTaskPending = (taskId: string, pending: boolean) => {
    setPendingTaskIds((prev) => {
      const next = { ...prev };
      if (pending) {
        next[taskId] = true;
      } else {
        delete next[taskId];
      }
      return next;
    });
  };

  const addTask = async () => {
    const title = newTaskTitle.trim();
    if (!title) return;

    setError(null);
    const tempId = `temp-${Date.now()}`;
    const optimisticTask: Task = {
      id: tempId,
      title,
      status: "pending",
      priority: "media",
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [optimisticTask, ...prev]);
    setNewTaskTitle("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao criar tarefa");
      }

      setTasks((prev) => prev.map((task) => (task.id === tempId ? parseTask(data.task) : task)));
    } catch (createError) {
      setTasks((prev) => prev.filter((task) => task.id !== tempId));
      setError(createError instanceof Error ? createError.message : "Erro desconhecido");
    }
  };

  const updateTask = async (taskId: string, input: TaskUpdateInput) => {
    const previousTask = tasks.find((task) => task.id === taskId);
    if (!previousTask) {
      return;
    }

    setError(null);
    setTaskPending(taskId, true);

    const optimisticTask: Task = {
      ...previousTask,
      ...input,
      description: input.description !== undefined ? input.description : previousTask.description,
      deadline: input.deadline !== undefined ? input.deadline : previousTask.deadline,
      metric: input.metric !== undefined ? input.metric : previousTask.metric,
      agent: input.agent !== undefined ? input.agent : previousTask.agent,
    };

    setTasks((prev) => prev.map((task) => (task.id === taskId ? optimisticTask : task)));

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao atualizar tarefa");
      }

      setTasks((prev) => prev.map((task) => (task.id === taskId ? parseTask(data.task) : task)));
    } catch (updateError) {
      setTasks((prev) => prev.map((task) => (task.id === taskId ? previousTask : task)));
      setError(updateError instanceof Error ? updateError.message : "Erro desconhecido");
      throw updateError;
    } finally {
      setTaskPending(taskId, false);
    }
  };

  const updateStatus = async (taskId: string, status: Task["status"]) => {
    try {
      await updateTask(taskId, { status });
    } catch {
      // rollback handled in updateTask
    }
  };

  const saveEditedTask = async (taskId: string, input: TaskUpdateInput) => {
    setIsSavingEdit(true);
    try {
      await updateTask(taskId, input);
      setEditingTask(null);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    const previousIndex = tasks.findIndex((task) => task.id === taskId);
    const removedTask = tasks[previousIndex];
    if (!removedTask) {
      return;
    }

    setError(null);
    setTaskPending(taskId, true);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao excluir tarefa");
      }
    } catch (deleteError) {
      setTasks((prev) => {
        const restored = [...prev];
        restored.splice(previousIndex, 0, removedTask);
        return restored;
      });
      setError(deleteError instanceof Error ? deleteError.message : "Erro desconhecido");
    } finally {
      setTaskPending(taskId, false);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto max-w-7xl">
        {/* Vision Dashboard v2.0 */}
        {/* Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pendentes</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Em Progresso</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.inProgress}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Concluidos</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.done}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Nova Tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Titulo da tarefa..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void addTask()}
                className="flex-1"
              />
              <Button onClick={() => void addTask()} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-300">
            <CardContent className="p-4 text-sm text-red-700">{error}</CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task) => {
            const isPending = Boolean(pendingTaskIds[task.id]);

            return (
              <Card key={task.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <Badge variant={priorityColors[task.priority]}>{task.priority.toUpperCase()}</Badge>
                      </div>

                      {task.description && (
                        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <Badge variant={statusColors[task.status]}>{statusLabels[task.status]}</Badge>

                        {task.agent && <span className="text-slate-500">Agent: {task.agent}</span>}

                        {task.deadline && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Clock className="h-3 w-3" />
                            {new Date(task.deadline).toLocaleDateString("pt-BR")}
                          </span>
                        )}

                        {task.metric && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <Target className="h-3 w-3" />
                            {task.metric}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {task.status !== "done" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() =>
                            void updateStatus(task.id, task.status === "pending" ? "in_progress" : "done")
                          }
                        >
                          {task.status === "pending" ? "Iniciar" : "Concluir"}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => setEditingTask(task)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => void deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {!isLoading && tasks.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <p className="text-slate-500">Nenhuma tarefa encontrada</p>
            </CardContent>
          </Card>
        )}

        <EditTaskDialog
          open={Boolean(editingTask)}
          task={editingTask}
          isSaving={isSavingEdit}
          onClose={() => setEditingTask(null)}
          onSave={saveEditedTask}
        />
      </div>
    </AppLayout>
  );
}
