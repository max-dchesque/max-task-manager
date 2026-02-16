"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Clock, Target, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "done" | "blocked";
  priority: "alta" | "media" | "baixa";
  deadline?: string;
  metric?: string;
  agent?: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Configurar Prisma com PostgreSQL",
    description: "Conectar Prisma ao banco de dados do Easypanel",
    status: "in_progress",
    priority: "alta",
    deadline: "2026-02-17",
    metric: "Conexão ativa",
    agent: "MAX"
  },
  {
    id: "2",
    title: "Implementar autenticação",
    description: "Adicionar NextAuth ou Clerk para login seguro",
    status: "pending",
    priority: "media",
    agent: "MAX"
  },
  {
    id: "3",
    title: "Pesquisar tendências moda plus size",
    description: "Enviar notícia para Driano sobre última semana",
    status: "done",
    priority: "media",
    metric: "Notícia enviada via Telegram",
    agent: "Ine"
  }
];

const statusLabels = {
  pending: "Pendente",
  in_progress: "Em Progresso",
  done: "Concluído",
  blocked: "Bloqueado"
};

const statusColors = {
  pending: "secondary",
  in_progress: "default",
  done: "success",
  blocked: "destructive"
} as const;

const priorityColors = {
  alta: "destructive",
  media: "warning",
  baixa: "secondary"
} as const;

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: "pending",
      priority: "media"
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
  };

  const updateStatus = (id: string, status: Task["status"]) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            MAX Task Manager
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Sistema de gerenciamento de tarefas para MAX e agentes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl">{tasks.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pendentes</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">
                {tasks.filter(t => t.status === "pending").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Em Progresso</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {tasks.filter(t => t.status === "in_progress").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Concluídos</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {tasks.filter(t => t.status === "done").length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Add Task Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Nova Tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Título da tarefa..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                className="flex-1"
              />
              <Button onClick={addTask} className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <Badge variant={priorityColors[task.priority]}>
                        {task.priority.toUpperCase()}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <Badge variant={statusColors[task.status]}>
                        {statusLabels[task.status]}
                      </Badge>

                      {task.agent && (
                        <span className="text-slate-500">
                          👤 {task.agent}
                        </span>
                      )}

                      {task.deadline && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(task.deadline).toLocaleDateString("pt-BR")}
                        </span>
                      )}

                      {task.metric && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <Target className="w-3 h-3" />
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
                        onClick={() => updateStatus(task.id, task.status === "pending" ? "in_progress" : "done")}
                      >
                        {task.status === "pending" ? "▶️ Iniciar" : "✅ Concluir"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-500">Nenhuma tarefa encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
