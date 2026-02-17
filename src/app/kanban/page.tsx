"use client";

import { useEffect, useState } from "react";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/lib/task-types";

interface TaskWithAgent extends Task {
  agentName?: string;
}

const columns = [
  { id: "pending", title: "Pending", color: "border-slate-300" },
  { id: "in_progress", title: "In Progress", color: "border-blue-300" },
  { id: "done", title: "Done", color: "border-green-300" },
  { id: "blocked", title: "Blocked", color: "border-red-300" },
];

function SortableTask({ task, onStatusChange }: { task: TaskWithAgent; onStatusChange: (id: string, status: Task["status"]) => void }) {
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

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h4 className="flex-1 font-medium text-slate-900 dark:text-white">{task.title}</h4>
            <Badge className={`text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
              {task.priority.toUpperCase()}
            </Badge>
          </div>

          {task.description && (
            <p className="mb-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{task.agentName || "Sem agent"}</span>
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    void loadTasks();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Find the task being dragged
    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    // Get the new status from the column ID
    const newStatus = over.id as Task["status"];

    // Update local state optimistically
    setTasks((prev) =>
      prev.map((task) =>
        task.id === active.id ? { ...task, status: newStatus } : task
      )
    );

    // Send update to API
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
        <div className="container mx-auto max-w-7xl">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-slate-500">Carregando kanban...</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Kanban Board
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Visualize e gerencie todas as tarefas em tempo real
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => {
              const columnTasks = getTasksByStatus(column.id as Task["status"]);

              return (
                <div
                  key={column.id}
                  className={`rounded-lg border-2 ${column.color} bg-white p-4 dark:bg-slate-900`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {column.title}
                    </h3>
                    <Badge variant="secondary">{columnTasks.length}</Badge>
                  </div>

                  <SortableContext
                    items={columnTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {columnTasks.map((task) => (
                      <SortableTask
                        key={task.id}
                        task={task}
                        onStatusChange={() => {}}
                      />
                    ))}
                  </SortableContext>

                  {columnTasks.length === 0 && (
                    <p className="py-8 text-center text-sm text-slate-400">
                      Nenhuma tarefa
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </DndContext>
      </div>
    </AppLayout>
  );
}
