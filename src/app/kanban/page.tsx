"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/lib/task-types";

interface TaskWithAgent extends Task {
  agentName?: string;
}

const columns = [
  { id: "pending", title: "Pending", color: "border-slate-300", bg: "bg-slate-50 dark:bg-slate-800" },
  { id: "in_progress", title: "In Progress", color: "border-blue-300", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "done", title: "Done", color: "border-green-300", bg: "bg-green-50 dark:bg-green-900/20" },
  { id: "blocked", title: "Blocked", color: "border-red-300", bg: "bg-red-50 dark:bg-red-900/20" },
];

function SortableTask({ task }: { task: TaskWithAgent }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    alta: "bg-red-500 text-white",
    media: "bg-yellow-500 text-white",
    baixa: "bg-green-500 text-white",
  };

  const statusBadges = {
    pending: "bg-slate-500",
    "in-progress": "bg-blue-500",
    done: "bg-green-500",
    blocked: "bg-red-500",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-3 cursor-grab active:cursor-grabbing hover:shadow-neon transition-all duration-300">
        <CardContent className="p-3">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h4 className="flex-1 font-semibold text-sm text-slate-900 dark:text-white">{task.title}</h4>
            <Badge className={`text-[10px] ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
              {task.priority.toUpperCase()}
            </Badge>
          </div>

          {task.description && (
            <p className="mb-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <div className={`h-1.5 w-1.5 rounded-full ${statusBadges[task.status]}`} />
              {task.agentName || "Sem agent"}
            </span>
            {task.deadline && (
              <span>{new Date(task.deadline).toLocaleDateString("pt-BR")}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function KanbanPage() {
  const [tasks, setTasks] = useState<TaskWithAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();

      if (data.success) {
        const tasksWithAgent = data.tasks.map((task: Task) => ({
          ...task,
          agentName: task.agent || null,
        }));
        setTasks(tasksWithAgent);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }, []);

  // Initial load + polling for real-time updates
  useEffect(() => {
    loadTasks();

    // Poll every 5 seconds for updates
    pollingInterval.current = setInterval(() => {
      loadTasks();
    }, 5000);

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [loadTasks]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    const newStatus = over.id as Task["status"];

    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === active.id ? { ...task, status: newStatus } : task
      )
    );

    // Send to API
    try {
      const response = await fetch(`/api/tasks/${active.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // Revert on error
        setTasks((prev) =>
          prev.map((task) =>
            task.id === active.id ? { ...task, status: draggedTask.status } : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
      // Revert on error
      setTasks((prev) =>
        prev.map((task) =>
          task.id === active.id ? { ...task, status: draggedTask.status } : task
        )
      );
    }
  };

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((t) => t.status === status);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto max-w-[1400px]">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-border dark:border-dark-border">
                <div className="h-2 w-2 rounded-full bg-neon-400 animate-pulse" />
                <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                  Carregando kanban em tempo real...
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto max-w-[1400px] py-6">
        {/* Header com Wonder Games style */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gradient-neon mb-2">
                Kanban Board
              </h1>
              <p className="text-muted-foreground dark:text-dark-muted-foreground text-sm">
                Atualizações automáticas a cada 5 segundos (Polling)
              </p>
            </div>

            {/* Polling Status */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-neon-400 animate-glow" />
              <span className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                AUTO-SYNC ATIVO
              </span>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => {
              const columnTasks = getTasksByStatus(column.id as Task["status"]);

              return (
                <div
                  key={column.id}
                  id={column.id}
                  className={`rounded-xl border-2 ${column.color} ${column.bg} p-4 dark:bg-neutral-900 transition-all duration-300`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {column.title}
                    </h3>
                    <Badge className="bg-neon-400 text-neon-950 text-xs font-bold">
                      {columnTasks.length}
                    </Badge>
                  </div>

                  <SortableContext
                    items={columnTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {columnTasks.map((task) => (
                      <SortableTask key={task.id} task={task} />
                    ))}
                  </SortableContext>

                  {columnTasks.length === 0 && (
                    <p className="py-8 text-center text-xs text-muted-foreground dark:text-dark-muted-foreground">
                      Nenhuma tarefa
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </DndContext>

        {/* Stats */}
        <div className="mt-8 flex items-center justify-center gap-8 text-xs text-muted-foreground dark:text-dark-muted-foreground">
          <span>Total: {tasks.length}</span>
          <span>•</span>
          <span>Polling: 5 segundos</span>
          <span>•</span>
          <span>Real-time: ATIVO</span>
        </div>
      </div>
    </AppLayout>
  );
}
