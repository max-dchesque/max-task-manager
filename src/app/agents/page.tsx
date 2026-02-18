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
      {/* Wonder Games Gradient Card - COMPACTO */}
      <Card
        className="w-48 shadow-card hover:shadow-neon transition-all duration-300 hover:scale-105 overflow-hidden"
        style={gradientStyle}
      >
        {/* Neon Glow Bar at top */}
        <div className={`h-0.5 w-full bg-neon-400 animate-glow`} />

        <div className="p-3">
          {/* Header with emoji and status */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {agent.emoji && (
                <span className="text-2xl drop-shadow-lg">{agent.emoji}</span>
              )}
              <div>
                <h3 className="text-sm font-bold text-white drop-shadow-md leading-tight">
                  {agent.name}
                </h3>
                <p className="text-white/90 text-xs font-medium">
                  {agent.role}
                </p>
              </div>
            </div>

            {/* Status Badge - Compact */}
            <Badge
              className={`${
                statusColors[agent.status as keyof typeof statusColors] || 'bg-neutral-700'
              } text-white border-0 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg`}
            >
              {agent.status?.toUpperCase() || 'OFFLINE'}
            </Badge>
          </div>

          {/* Description - Compact */}
          {agent.description && (
            <p className="text-xs text-white/95 mb-2 line-clamp-1 font-medium drop-shadow">
              {agent.description}
            </p>
          )}

          {/* Footer with children count - Compact */}
          {hasChildren && (
            <div className="flex items-center gap-1.5 pt-2 border-t border-white/20">
              <div className="h-1.5 w-1.5 rounded-full bg-neon-400 animate-glow" />
              <span className="text-[10px] text-white font-semibold">
                {agent.children.length}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Connection Lines - Wonder Games Style - COMPACT */}
      {hasChildren && (
        <div className="relative mt-3">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 w-0.5 h-3 -translate-x-1/2 bg-gradient-to-b from-white/40 to-transparent" />

          {/* Horizontal line */}
          <div className="absolute left-1/2 top-3 w-full h-0.5 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Children container - Compact gap */}
          <div className="flex justify-center gap-6 mt-3">
            {agent.children.map((child, index) => (
              <div key={child.id} className="relative flex flex-col items-center">
                {/* Vertical connector */}
                <div className="absolute top-0 left-1/2 w-0.5 h-3 -translate-x-1/2 bg-gradient-to-b from-white/40 to-transparent" />

                {/* Child node */}
                <div className="mt-3">
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
      <div className="container mx-auto max-w-full py-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gradient-neon mb-2">
            Agent Tree
          </h1>
          <p className="text-muted-foreground dark:text-dark-muted-foreground text-sm">
            Hierarquia completa dos agentes do OpenClaw
          </p>
        </div>

        {isLoading ? (
          <Card className="bg-card dark:bg-dark-card border-border dark:border-dark-border">
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-border dark:border-dark-border">
                <div className="h-1.5 w-1.5 rounded-full bg-neon-400 animate-glow" />
                <span className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                  Carregando agentes...
                </span>
              </div>
            </div>
          </Card>
        ) : (
          <div className="flex justify-center overflow-x-auto pb-8">
            <div className="flex flex-col items-center gap-10">
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
