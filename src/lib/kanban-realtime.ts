import { RealtimeChannel } from "@supabase/supabase-js";

export interface RealtimeTaskUpdate {
  id: string;
  status: "pending" | "in_progress" | "done" | "blocked";
  agent?: string;
  updated_at?: string;
}

export class KanbanRealtime {
  private channel: RealtimeChannel | null = null;
  private supabase: any;
  private taskId: string | null = null;

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  // Subscribe to task updates
  subscribeToTasks(
    onUpdate: (payload: { data: RealtimeTaskUpdate }) => void,
    onError?: (error: Error) => void
  ) {
    this.channel = this.supabase
      .channel("tasks_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Task",
        },
        (payload: any) => {
          console.log("Task update received:", payload);
          onUpdate(payload);
        }
      )
      .subscribe((status: string) => {
        console.log("Subscription status:", status);
        if (status === "SUBSCRIPTION_ERROR" && onError) {
          onError(new Error("Failed to subscribe to task updates"));
        }
      });

    return this.channel;
  }

  // Unsubscribe
  unsubscribe() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }

  // Manual task update (for agents)
  async updateTask(taskId: string, updates: Partial<RealtimeTaskUpdate>) {
    const { data, error } = await this.supabase
      .from("Task")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select();

    if (error) {
      console.error("Error updating task:", error);
      throw error;
    }

    return data;
  }

  // Agent auto-update (called by agents)
  async agentUpdateTask(
    taskId: string,
    agentName: string,
    status: RealtimeTaskUpdate["status"]
  ) {
    return this.updateTask(taskId, {
      status,
      agent: agentName,
    });
  }

  // Bulk status update (for batch operations)
  async updateMultipleTasks(updates: Array<{ id: string; status: RealtimeTaskUpdate["status"] }>) {
    const promises = updates.map(({ id, status }) =>
      this.updateTask(id, { status })
    );

    return Promise.all(promises);
  }
}
