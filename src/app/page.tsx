"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task, CheckCircle2, Clock, AlertCircle, TrendingUp, Zap } from "lucide-react";

interface Metric {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  color: string;
}

interface TaskItem {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Load tasks
        const tasksRes = await fetch("/api/tasks");
        const tasksData = await tasksRes.json();

        if (tasksData.success) {
          setTasks(tasksData.tasks || []);

          // Calculate metrics
          const total = tasksData.tasks?.length || 0;
          const completed = tasksData.tasks?.filter((t: TaskItem) => t.status === "done").length || 0;
          const pending = tasksData.tasks?.filter((t: TaskItem) => t.status === "pending").length || 0;
          const inProgress = tasksData.tasks?.filter((t: TaskItem) => t.status === "in-progress").length || 0;

          setMetrics([
            {
              label: "Total Tasks",
              value: total,
              change: "+12%",
              icon: Task,
              color: "bg-neon-400 text-neon-950",
            },
            {
              label: "Completed",
              value: completed,
              change: "+8%",
              icon: CheckCircle2,
              color: "bg-status-online text-white",
            },
            {
              label: "In Progress",
              value: inProgress,
              change: "Active",
              icon: Clock,
              color: "bg-status-idle text-white",
            },
            {
              label: "Pending",
              value: pending,
              change: "Action needed",
              icon: AlertCircle,
              color: "bg-status-busy text-white",
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const statusColors: Record<string, string> = {
    pending: "bg-status-idle text-white",
    "in-progress": "bg-status-online text-white",
    done: "bg-status-offline text-white",
    blocked: "bg-status-busy text-white",
  };

  const priorityColors: Record<string, string> = {
    alta: "bg-priority-alta text-white",
    media: "bg-priority-media text-white",
    baixa: "bg-priority-baixa text-white",
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-1 rounded-full bg-neon-400 animate-glow" />
            <div>
              <h1 className="text-4xl font-bold text-foreground dark:text-dark-foreground">
                Vision Dashboard
              </h1>
              <p className="text-muted-foreground dark:text-dark-muted-foreground mt-1">
                Task Manager v2.0 — Wonder Games Design System
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid - Wonder Games Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card
                key={index}
                className="card-elevated bg-card dark:bg-dark-card border-border dark:border-dark-border overflow-hidden group hover:shadow-neon transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-border dark:border-dark-border">
                      <Icon className="h-6 w-6 text-muted-foreground dark:text-dark-muted-foreground" />
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-white/5 border-0 text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground"
                    >
                      {metric.change}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground dark:text-dark-foreground">
                      {metric.value}
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                </CardContent>
                {/* Neon Glow Bar */}
                <div className={`h-1 w-full ${metric.color} animate-glow`} />
              </Card>
            );
          })}
        </div>

        {/* Recent Tasks - Wonder Games Project Card Style */}
        <Card className="card-elevated bg-card dark:bg-dark-card border-border dark:border-dark-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground dark:text-dark-foreground">
                Recent Tasks
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-neon-400 animate-glow" />
                <span className="text-xs font-semibold text-neon-400">
                  LIVE
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="p-12 text-center">
                <Zap className="h-8 w-8 animate-pulse mx-auto text-neon-400" />
                <p className="mt-4 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                  Loading dashboard...
                </p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="p-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground dark:text-dark-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-2">
                  No tasks yet
                </p>
                <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                  Create your first task to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-border dark:border-dark-border hover:bg-white/10 hover:border-neon-400/50 transition-all duration-300 group"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground dark:text-dark-foreground group-hover:text-neon-400 transition-colors">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground mt-1">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold border-0 ${
                          priorityColors[task.priority] || "bg-neutral-700 text-white"
                        }`}
                      >
                        {task.priority}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold border-0 ${
                          statusColors[task.status] || "bg-neutral-700 text-white"
                        }`}
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
