import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/agents/update - Agent auto-update endpoint
// Chamado por agentes remotamente para atualizar tarefas

interface AgentUpdateRequest {
  agentName: string;
  agentSecret: string; // Simple auth
  updates: Array<{
    taskId: string;
    status: "pending" | "in_progress" | "done" | "blocked";
    note?: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: AgentUpdateRequest = await request.json();
    const { agentName, agentSecret, updates } = body;

    // Simple auth check (you should use a better system in production)
    const validSecret = process.env.AGENT_UPDATE_SECRET || "agent-secret-2026";

    if (agentSecret !== validSecret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Process each update
    const results = await Promise.allSettled(
      updates.map(async ({ taskId, status, note }) => {
        // Verify task belongs to this agent
        const task = await prisma.task.findUnique({
          where: { id: taskId },
        });

        if (!task) {
          throw new Error(`Task ${taskId} not found`);
        }

        // Update task
        const updated = await prisma.task.update({
          where: { id: taskId },
          data: {
            status,
            agent: agentName,
            ...(note && { description: `${task.description}\n\n[Agent Update - ${new Date().toLocaleString("pt-BR")}]\n${note}`.trim() }),
            updatedAt: new Date(),
          },
        });

        return updated;
      })
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      success: true,
      message: `Updated ${succeeded} tasks, ${failed} failed`,
      succeeded,
      failed,
    });
  } catch (error) {
    console.error("Error in agent update:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process agent update" },
      { status: 500 }
    );
  }
}

// GET /api/agents/update - Get update status (health check)
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Agent update endpoint is online",
    timestamp: new Date().toISOString(),
  });
}
