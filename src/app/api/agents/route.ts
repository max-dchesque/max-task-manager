import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  botHandle: string | null;
  skills: string[];
  status: 'online' | 'offline' | 'idle';
}

// Cache em memória
let agentsCache: Agent[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 60 segundos

function parseSOUL(content: string): { name: string; role: string; description: string; botHandle?: string } {
  const lines = content.split('\n');
  const result: any = {};

  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Detectar seções markdown
    if (trimmed.startsWith('##')) {
      currentSection = trimmed.replace('##', '').trim().toLowerCase();
      continue;
    }

    // Extrair nome
    if (trimmed.toLowerCase().startsWith('**nome:**') || trimmed.toLowerCase().startsWith('nome:')) {
      result.name = trimmed.split(':')[1].trim();
      continue;
    }

    // Extrair role/função
    if (trimmed.toLowerCase().includes('função') || trimmed.toLowerCase().includes('cargo')) {
      result.role = trimmed.split(':')[1]?.trim() || trimmed.split('-')[1]?.trim() || 'Agent';
      continue;
    }

    // Extrair bot handle do Telegram
    if (trimmed.includes('@') && trimmed.includes('bot')) {
      const match = trimmed.match(/@[\w]+_bot/);
      if (match) {
        result.botHandle = match[0];
      }
    }
  }

  return {
    name: result.name || 'Unknown',
    role: result.role || 'Agent',
    description: result.description || '',
    botHandle: result.botHandle || null,
  };
}

function parseSkill(content: string): string {
  const lines = content.split('\n');

  for (const line of lines) {
    if (line.toLowerCase().startsWith('description:') || line.toLowerCase().startsWith('descrição:')) {
      return line.split(':')[1].trim();
    }
  }

  return 'Skill';
}

async function loadAgentsFromWorkspace(): Promise<Agent[]> {
  const agents: Agent[] = [];
  const workspacePath = '/data/.openclaw/workspace-neo';
  const agentsPath = join(workspacePath, 'agents');
  const skillsPath = join(workspacePath, 'skills');

  try {
    // Ler skills disponíveis
    const skillsDirs = await readdir(skillsPath).catch(() => []);
    const availableSkills: string[] = [];

    for (const skillDir of skillsDirs) {
      try {
        const skillMdPath = join(skillsPath, skillDir, 'SKILL.md');
        const content = await readFile(skillMdPath, 'utf-8');
        const skillName = parseSkill(content);
        availableSkills.push(skillName);
      } catch {
        // Ignore skills sem SKILL.md
      }
    }

    // Agents principais (definidos no SOUL.md da workspace)
    const mainAgents = [
      { id: 'neo', soulFile: join(workspacePath, 'SOUL.md') },
    ];

    for (const agentConfig of mainAgents) {
      try {
        const soulContent = await readFile(agentConfig.soulFile, 'utf-8');
        const parsed = parseSOUL(soulContent);

        agents.push({
          id: agentConfig.id,
          name: parsed.name,
          role: parsed.role,
          description: parsed.description || 'Dev full-stack da operação',
          botHandle: parsed.botHandle || `@${agentConfig.id}_bot`,
          skills: availableSkills,
          status: 'online', // Hardcoded por enquanto
        });
      } catch (error) {
        console.error(`Error loading agent ${agentConfig.id}:`, error);
      }
    }

    // Tentar ler subagents se existirem
    try {
      const subAgentsDirs = await readdir(agentsPath);
      for (const agentDir of subAgentsDirs) {
        try {
          const soulPath = join(agentsPath, agentDir, 'SOUL.md');
          const soulContent = await readFile(soulPath, 'utf-8');
          const parsed = parseSOUL(soulContent);

          agents.push({
            id: agentDir,
            name: parsed.name,
            role: parsed.role,
            description: parsed.description || '',
            botHandle: parsed.botHandle || null,
            skills: availableSkills,
            status: 'offline',
          });
        } catch {
          // Ignore agents sem SOUL.md
        }
      }
    } catch {
      // Pasta agents não existe
    }

    return agents;
  } catch (error) {
    console.error('Error loading agents:', error);
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

  // Recarregar
  const agents = await loadAgentsFromWorkspace();

  // Atualizar cache
  agentsCache = agents;
  cacheTimestamp = now;

  return NextResponse.json({
    success: true,
    agents,
    cached: false,
  });
}
