"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Cpu, Network } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  botHandle: string | null;
  skills: string[];
  status: 'online' | 'offline' | 'idle';
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

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-slate-400",
    idle: "bg-yellow-500",
  };

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
          <div className="space-y-6">
            {/* Root Node - MAX COO */}
            <Card className="border-2 border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600">
                    <Network className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">MAX COO</CardTitle>
                    <CardDescription>Coordenador da Operação</CardDescription>
                  </div>
                  <Badge className="ml-auto bg-green-500">ONLINE</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Gerencia toda a operação de agents. Coordena tarefas, monitora métricas e otimiza fluxos de trabalho.
                </p>
              </CardContent>
            </Card>

            {/* Agents Level */}
            <div className="ml-8 space-y-4 border-l-2 border-slate-200 pl-8 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Operational Agents
              </h3>

              {agents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.role}</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${statusColors[agent.status]} text-white border-0`}
                      >
                        {agent.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                      {agent.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Cpu className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-900 dark:text-white">Skills:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {agent.skills.slice(0, 5).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {agent.skills.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{agent.skills.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {agent.botHandle && (
                      <div className="mt-4 text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Telegram: </span>
                        <code className="rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                          {agent.botHandle}
                        </code>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
