import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  // Criar ReadableStream para SSE
  const stream = new ReadableStream({
    start(controller) {
      // Enviar comentário inicial para manter conexão viva
      const initEvent = `: Connected to MAX Task Manager stream\n\n`;
      controller.enqueue(encoder.encode(initEvent));

      // Heartbeat a cada 15 segundos para manter conexão viva
      const heartbeatInterval = setInterval(() => {
        const heartbeat = `: heartbeat\n\n`;
        controller.enqueue(encoder.encode(heartbeat));
      }, 15000);

      // Polling simulado de mudanças (em produção, usar WebSocket ou Redis Pub/Sub)
      const pollInterval = setInterval(async () => {
        try {
          // Simular evento de task atualizada
          const event = `event: task-update\n`;
          const data = `data: ${JSON.stringify({ timestamp: Date.now() })}\n\n`;
          controller.enqueue(encoder.encode(event + data));
        } catch (error) {
          console.error('Stream error:', error);
          clearInterval(heartbeatInterval);
          clearInterval(pollInterval);
          controller.close();
        }
      }, 10000); // 10 segundos

      // Limpar quando cliente desconectar
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
        clearInterval(pollInterval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Desabilitar buffering no nginx
    },
  });
}
