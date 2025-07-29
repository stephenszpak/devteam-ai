defmodule DevteamAiWeb.TaskChannel do
  use DevteamAiWeb, :channel

  @impl true
  def join("tasks:lobby", _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_in("new_task", %{"description" => description}, socket) do
    # Create task via AgentOrchestrator
    DevteamAi.AgentOrchestrator.create_task(description)
    
    # Broadcast to all connected clients
    broadcast(socket, "task_created", %{
      description: description,
      timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
    })
    
    {:reply, {:ok, %{status: "created"}}, socket}
  end

  @impl true
  def handle_in("get_agents", _payload, socket) do
    agents = DevteamAi.AgentOrchestrator.get_agent_status()
    {:reply, {:ok, %{agents: agents}}, socket}
  end
end