"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

function TreeNode({ agent, level = 0 }: { agent: Agent; level?: number }) {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-slate-400",
    busy: "bg-red-500",
    idle: "bg-yellow-500",
  };

  const nodeColor = agent.color || '#4A90E2';
  const hasChildren = agent.children && agent.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Card do Agente */}
      <Card
        className="w-64 shadow-lg transition-all hover:shadow-2xl hover:scale-105"
        style={{
          backgroundColor: nodeColor,
          borderColor: nodeColor,
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {agent.emoji && (
                <span className="text-2xl">{agent.emoji}</span>
              )}
              <div>
                <CardTitle className="text-lg font-bold text-white leading-tight">
                  {agent.name}
                </CardTitle>
                <CardDescription className="text-white/80 text-xs">
                  {agent.role}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`${
                statusColors[agent.status as keyof typeof statusColors] || 'bg-slate-400'
              } text-white border-0 text-xs`}
            >
              {agent.status?.toUpperCase() || 'OFFLINE'}
            </Badge>
          </div>
        </CardHeader>
        {agent.description && (
          <CardContent className="pt-0">
            <p className="text-xs text-white/90 line-clamp-2">
              {agent.description}
            </p>
          </CardContent>
        )}
      </Card>

      {/* Linha de conexão para filhos */}
      {hasChildren && (
        <div className="relative mt-4">
          {/* Linha vertical */}
          <div className="absolute left-1/2 top-0 w-0.5 h-4 -translate-x-1/2 bg-slate-300 dark:bg-slate-600" />

          {/* Linha horizontal */}
          <div className="absolute left-1/2 top-4 w-full h-0.5 -translate-x-1/2 bg-slate-300 dark:bg-slate-600" />

          {/* Container dos filhos */}
          <div className="flex justify-center gap-8 mt-4">
            {agent.children.map((child, index, array) => {
              const isFirst = index === 0;
              const isLast = index === array.length - 1;
              const isMiddle = array.length > 2 && index > 0 && index < array.length - 1;

              return (
                <div key={child.id} className="relative flex flex-col items-center">
                  {/* Linhas verticais para cada filho */}
                  {!isMiddle && (
                    <div
                      className="absolute top-0 w-0.5 h-4 bg-slate-300 dark:bg-slate-600"
                      style={{
                        left: isFirst ? '50%' : isLast ? '-50%' : '0',
                      }}
                    />
                  )}

                  {/* Conector horizontal */}
                  <div className="absolute top-4 left-1/2 w-0.5 h-0.5 -translate-x-1/2 bg-slate-300 dark:bg-slate-600" />

                  {/* Recursão para filhos */}
                  <div className="mt-0.5">
                    <TreeNode agent={child} level={level + 1} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
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
      <div className="container mx-auto max-w-full py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Agent Tree
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Estrutura hierárquica de todos os agentes do OpenClaw
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-slate-500">Carregando agentes...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex justify-center overflow-x-auto pb-8">
            <div className="flex flex-col items-center gap-8">
              {agents.map((agent) => (
                <TreeNode key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
