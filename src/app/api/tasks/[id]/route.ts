import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: 'pending' | 'in_progress' | 'done' | 'blocked';
  priority?: 'alta' | 'media' | 'baixa';
  deadline?: string | null;
  metric?: string | null;
  agent?: string | null;
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body: UpdateTaskInput = await request.json();

    if (body.title !== undefined && !body.title.trim()) {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    }

    const data: {
      title?: string;
      description?: string | null;
      status?: 'pending' | 'in_progress' | 'done' | 'blocked';
      priority?: 'alta' | 'media' | 'baixa';
      deadline?: Date | null;
      metric?: string | null;
      agentId?: string | null;
    } = {};

    if (body.title !== undefined) data.title = body.title.trim();
    if (body.description !== undefined) data.description = body.description || null;
    if (body.status !== undefined) data.status = body.status;
    if (body.priority !== undefined) data.priority = body.priority;
    if (body.deadline !== undefined) data.deadline = body.deadline ? new Date(body.deadline) : null;
    if (body.metric !== undefined) data.metric = body.metric || null;

    if (body.agent !== undefined) {
      const agentName = body.agent?.trim();

      if (!agentName) {
        data.agentId = null;
      } else {
        const agent = await prisma.agent.upsert({
          where: { botHandle: agentName },
          update: { name: agentName },
          create: {
            name: agentName,
            botHandle: agentName,
            role: 'agent',
          },
        });

        data.agentId = agent.id;
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data,
      include: { agent: true },
    });

    return NextResponse.json({
      success: true,
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline?.toISOString(),
        metric: task.metric,
        agent: task.agent?.name,
        createdAt: task.createdAt.toISOString(),
      },
    });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
