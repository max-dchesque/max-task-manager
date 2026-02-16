"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Task, TaskPriority, TaskStatus, TaskUpdateInput } from "@/lib/task-types";

interface EditTaskDialogProps {
  open: boolean;
  task: Task | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (taskId: string, input: TaskUpdateInput) => Promise<void>;
}

interface FormState {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  metric: string;
  agent: string;
}

const defaultFormState: FormState = {
  title: "",
  description: "",
  status: "pending",
  priority: "media",
  deadline: "",
  metric: "",
  agent: "",
};

export function EditTaskDialog({ open, task, isSaving, onClose, onSave }: EditTaskDialogProps) {
  const [form, setForm] = useState<FormState>(defaultFormState);

  useEffect(() => {
    if (!task) {
      setForm(defaultFormState);
      return;
    }

    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      deadline: task.deadline ? task.deadline.slice(0, 10) : "",
      metric: task.metric || "",
      agent: task.agent || "",
    });
  }, [task]);

  if (!open || !task) {
    return null;
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      return;
    }

    await onSave(task.id, {
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      priority: form.priority,
      deadline: form.deadline || null,
      metric: form.metric.trim() || null,
      agent: form.agent.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Editar Tarefa</h2>

        <div className="grid gap-4">
          <Input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Título"
          />

          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Descrição"
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as TaskStatus }))}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Progresso</option>
              <option value="done">Concluida</option>
              <option value="blocked">Bloqueada</option>
            </select>

            <select
              value={form.priority}
              onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as TaskPriority }))}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm((prev) => ({ ...prev, deadline: e.target.value }))}
            />
            <Input
              value={form.agent}
              onChange={(e) => setForm((prev) => ({ ...prev, agent: e.target.value }))}
              placeholder="Agente"
            />
          </div>

          <Input
            value={form.metric}
            onChange={(e) => setForm((prev) => ({ ...prev, metric: e.target.value }))}
            placeholder="Metrica"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !form.title.trim()}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
