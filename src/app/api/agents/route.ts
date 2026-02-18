import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string | null;
  emoji: string | null;
  color: string | null;
  status: string;
  botHandle: string | null;
  children?: Agent[];
}

// Cache em memória
let agentsCache: Agent[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 60 segundos

// Função recursiva para construir árvore hierárquica
function buildAgentTree(agents: any[], parentId: string | null = null): Agent[] {
  return agents
    .filter(agent => agent.parentId === parentId)
    .map(agent => ({
      id: agent.id,
      name: agent.name,
      role: agent.role,
      description: agent.description,
      emoji: agent.emoji,
      color: agent.color,
      status: agent.status,
      botHandle: agent.botHandle,
      children: buildAgentTree(agents, agent.id),
    }));
}

async function loadAgentsFromDatabase(): Promise<Agent[]> {
  try {
    // Buscar todos os agentes do banco
    const agents = await prisma.agent.findMany({
      orderBy: [
        { parentId: 'asc' }, // Raízes primeiro
        { name: 'asc' },      // Depois alfabético
      ],
    });

    // Construir árvore hierárquica
    const agentTree = buildAgentTree(agents, null);

    return agentTree;
  } catch (error) {
    console.error('Error loading agents from database:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const now = Date.now();

  // Verificar cache
  if (agentsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return NextResponse.json({
      success: true,
      agents: agentsCache,
      cached: true,
    });
  }

  // Recarregar do banco
  const agents = await loadAgentsFromDatabase();

  // Atualizar cache
  agentsCache = agents;
  cacheTimestamp = now;

  return NextResponse.json({
    success: true,
    agents,
    cached: false,
  });
}
