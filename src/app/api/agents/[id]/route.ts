import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface AgentDetails {
  id: string;
  name: string;
  role: string;
  description: string;
  botHandle: string | null;
  skills: string[];
  status: 'online' | 'offline' | 'idle';
  soulContent: string;
  capabilities: string[];
}

function parseCapabilities(soulContent: string): string[] {
  const capabilities: string[] = [];
  const lines = soulContent.split('\n');
  let inCapabilitiesSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.toLowerCase().includes('skills') || trimmed.toLowerCase().includes('ferramentas') || trimmed.toLowerCase().includes('capabilities')) {
      inCapabilitiesSection = true;
      continue;
    }

    if (inCapabilitiesSection && trimmed.startsWith('-')) {
      const capability = trimmed.replace(/^[-*]\s*/, '').trim();
      if (capability) {
        capabilities.push(capability);
      }
    }

    if (trimmed.startsWith('##') && inCapabilitiesSection) {
      break;
    }
  }

  return capabilities;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const workspacePath = '/data/.openclaw/workspace-neo';

    let soulPath: string;

    // Agent principal
    if (id === 'neo') {
      soulPath = join(workspacePath, 'SOUL.md');
    } else {
      // Subagent
      soulPath = join(workspacePath, 'agents', id, 'SOUL.md');
    }

    const soulContent = await readFile(soulPath, 'utf-8');
    const capabilities = parseCapabilities(soulContent);

    const agentDetails: AgentDetails = {
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      role: 'Agent',
      description: '',
      botHandle: `@${id}_bot`,
      skills: [],
      status: 'online',
      soulContent,
      capabilities,
    };

    return NextResponse.json({
      success: true,
      agent: agentDetails,
    });
  } catch (error) {
    console.error('Error fetching agent details:', error);
    return NextResponse.json(
      { error: 'Agent not found' },
      { status: 404 }
    );
  }
}
