"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Cpu, Network, ChevronRight } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string | null;
  emoji: string | null;
  color: string | null;
  status: string;
  botHandle: string | null;
  children: Agent[];
}

function AgentCard({ agent, level = 0 }: { agent: Agent; level?: number }) {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-slate-400",
    busy: "bg-red-500",
    idle: "bg-yellow-500",
  };

  const indent = level * 2;

  return (
    <div className="space-y-2" style={{ marginLeft: `${indent}rem` }}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
              style={{ backgroundColor: agent.color || '#3B82F6' }}
            >
              {agent.emoji || '🤖'}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <CardDescription>{agent.role}</CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`${statusColors[agent.status as keyof typeof statusColors] || 'bg-slate-400'} text-white border-0`}
            >
              {agent.status?.toUpperCase() || 'OFFLINE'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {agent.description && (
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              {agent.description}
            </p>
          )}

          {agent.botHandle && (
            <div className="text-sm">
              <span className="text-slate-500 dark:text-slate-400">Telegram: </span>
              <code className="rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                {agent.botHandle}
              </code>
            </div>
          )}

          {agent.children && agent.children.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <ChevronRight className="h-4 w-4" />
              <span>{agent.children.length} subagente{agent.children.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {agent.children && agent.children.map((child) => (
        <AgentCard key={child.id} agent={child} level={level + 1} />
      ))}
    </div>
  );
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAgents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/agents");
        const data = await response.json();

        if (data.success) {
          setAgents(data.agents);
        }
      } catch (error) {
        console.error("Error loading agents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadAgents();
  }, []);

  return (
    <AppLayout>
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Agent Tree
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Estrutura hierárquica de todos os agents do OpenClaw
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-slate-500">Carregando agents...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
