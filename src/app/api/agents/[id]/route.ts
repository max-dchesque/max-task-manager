import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AgentDetails {
  id: string;
  name: string;
  role: string;
  description: string | null;
  emoji: string | null;
  color: string | null;
  status: string;
  botHandle: string | null;
  children: any[];
  parent: any;
  tasks: any[];
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Buscar agente com relações
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        tasks: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      agent,
    });
  } catch (error) {
    console.error('Error fetching agent details:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}
