import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: 'alta' | 'media' | 'baixa';
  deadline?: string;
  metric?: string;
  agent?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskInput = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    let agent = null;
    if (body.agent) {
      const agentName = body.agent.trim();
      agent = await prisma.agent.upsert({
        where: { botHandle: agentName },
        update: { name: agentName },
        create: {
          name: agentName,
          botHandle: agentName,
          role: 'agent',
        },
      });
    }

    const task = await prisma.task.create({
      data: {
        title: body.title.trim(),
        description: body.description || null,
        priority: body.priority || 'media',
        deadline: body.deadline ? new Date(body.deadline) : null,
        metric: body.metric || null,
        agentId: agent?.id,
      },
      include: {
        agent: true,
      },
    });

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentFilter = searchParams.get('agent');
    const statusFilter = searchParams.get('status');
    const priorityFilter = searchParams.get('priority');

    const where: any = {};

    if (agentFilter) {
      where.agent = { name: agentFilter };
    }

    if (statusFilter) {
      where.status = statusFilter;
    }

    if (priorityFilter) {
      where.priority = priorityFilter;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        agent: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      tasks: tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline?.toISOString(),
        metric: task.metric,
        agent: task.agent?.name,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
