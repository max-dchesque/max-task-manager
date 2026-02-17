/**
 * SSE (Server-Sent Events) Client para real-time updates
 */
export class SSEClient {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(private url: string) {}

  connect() {
    if (this.eventSource) {
      return;
    }

    this.eventSource = new EventSource(this.url);

    this.eventSource.addEventListener('task-update', (event) => {
      const data = JSON.parse(event.data);
      this.emit('task-update', data);
    });

    this.eventSource.addEventListener('error', (error) => {
      console.error('SSE error:', error);
      this.emit('error', error);
    });

    this.eventSource.addEventListener('open', () => {
      console.log('SSE connected');
      this.emit('connected', {});
    });
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}

// Singleton instance
let sseClient: SSEClient | null = null;

export function getSSEClient() {
  if (!sseClient) {
    sseClient = new SSEClient('/api/stream');
  }
  return sseClient;
}
