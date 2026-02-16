import { NextRequest, NextResponse } from 'next/server';

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

    // Validação básica
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // TODO: Salvar no PostgreSQL via Prisma
    // Por enquanto, retorna sucesso simbólico
    const task = {
      id: Math.random().toString(36).substr(2, 9),
      title: body.title,
      description: body.description || '',
      status: 'pending',
      priority: body.priority || 'media',
      deadline: body.deadline || null,
      metric: body.metric || null,
      agent: body.agent || 'Unknown',
      createdAt: new Date().toISOString(),
    };

    // TODO: Prisma.create({ data: task })

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  );
}

export async function GET() {
  // TODO: Buscar tasks do PostgreSQL
  return NextResponse.json({
    tasks: [],
    message: 'Prisma integration pending'
  });
}
