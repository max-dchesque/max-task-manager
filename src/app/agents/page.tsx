"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
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
    online: "bg-status-online",
    offline: "bg-status-offline",
    busy: "bg-status-busy",
    idle: "bg-status-idle",
  };

  const nodeColor = agent.color || '#3B82F6';
  const hasChildren = agent.children && agent.children.length > 0;

  // Wonder Games gradient style
  const gradientStyle = {
    background: `linear-gradient(to bottom right, ${nodeColor}, ${adjustBrightness(nodeColor, -40)})`,
  };

  return (
    <div className="flex flex-col items-center">
      {/* Wonder Games Gradient Card */}
      <Card
        className="w-72 shadow-card hover:shadow-neon transition-all duration-500 hover:scale-105 overflow-hidden"
        style={gradientStyle}
      >
        {/* Neon Glow Bar at top */}
        <div className={`h-1 w-full bg-neon-400 animate-glow`} />

        <div className="p-6">
          {/* Header with emoji and status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {agent.emoji && (
                <span className="text-4xl drop-shadow-lg">{agent.emoji}</span>
              )}
              <div>
                <h3 className="text-xl font-bold text-white drop-shadow-md">
                  {agent.name}
                </h3>
                <p className="text-white/90 text-sm font-medium">
                  {agent.role}
                </p>
              </div>
            </div>

            {/* Status Badge - Neon Style */}
            <Badge
              className={`${
                statusColors[agent.status as keyof typeof statusColors] || 'bg-neutral-700'
              } text-white border-0 text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
            >
              {agent.status?.toUpperCase() || 'OFFLINE'}
            </Badge>
          </div>

          {/* Description */}
          {agent.description && (
            <p className="text-sm text-white/95 mb-4 line-clamp-2 font-medium drop-shadow">
              {agent.description}
            </p>
          )}

          {/* Footer with children count */}
          {hasChildren && (
            <div className="flex items-center gap-2 pt-3 border-t border-white/20">
              <div className="h-2 w-2 rounded-full bg-neon-400 animate-glow" />
              <span className="text-xs text-white font-semibold">
                {agent.children.length} SUBAGENT{agent.children.length > 1 ? 'S' : ''}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Connection Lines - Wonder Games Style */}
      {hasChildren && (
        <div className="relative mt-6">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 w-0.5 h-6 -translate-x-1/2 bg-gradient-to-b from-white/40 to-transparent" />

          {/* Horizontal line */}
          <div className="absolute left-1/2 top-6 w-full h-0.5 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Children container */}
          <div className="flex justify-center gap-12 mt-6">
            {agent.children.map((child, index) => (
              <div key={child.id} className="relative flex flex-col items-center">
                {/* Vertical connector */}
                <div className="absolute top-0 left-1/2 w-0.5 h-6 -translate-x-1/2 bg-gradient-to-b from-white/40 to-transparent" />

                {/* Child node */}
                <div className="mt-6">
                  <TreeNode agent={child} level={level + 1} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to adjust color brightness
function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
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
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gradient-neon mb-3">
            Agent Tree
          </h1>
          <p className="text-muted-foreground dark:text-dark-muted-foreground text-lg">
            Hierarquia completa dos agentes do OpenClaw
          </p>
        </div>

        {isLoading ? (
          <Card className="bg-card dark:bg-dark-card border-border dark:border-dark-border">
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-border dark:border-dark-border">
                <div className="h-2 w-2 rounded-full bg-neon-400 animate-glow" />
                <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                  Carregando agentes...
                </span>
              </div>
            </div>
          </Card>
        ) : (
          <div className="flex justify-center overflow-x-auto pb-12">
            <div className="flex flex-col items-center gap-16">
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
