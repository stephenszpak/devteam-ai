defmodule DevteamAiWeb.TaskChannel do
  use DevteamAiWeb, :channel
  alias DevteamAi.Tasks

  @impl true
  def join("tasks:lobby", _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_in("new_task", %{"description" => description}, socket) do
    # Create task via Tasks context
    task_params = %{
      "description" => description,
      "priority" => "medium"
    }
    
    case Tasks.create_task(task_params) do
      {:ok, task} ->
        # Notify the orchestrator about the new task
        DevteamAi.AgentOrchestrator.task_created(task)
        
        # Broadcast to all connected clients
        broadcast(socket, "task_created", %{
          id: task.id,
          description: task.description,
          status: task.status,
          priority: task.priority,
          timestamp: DateTime.to_iso8601(task.inserted_at)
        })
        
        {:reply, {:ok, %{status: "created", task: task}}, socket}
        
      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset.errors}}, socket}
    end
  end

  @impl true
  def handle_in("get_agents", _payload, socket) do
    agents = DevteamAi.AgentOrchestrator.get_agent_status()
    {:reply, {:ok, %{agents: agents}}, socket}
  end
end