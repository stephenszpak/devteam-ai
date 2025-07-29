defmodule DevteamAiWeb.AgentController do
  use DevteamAiWeb, :controller

  def index(conn, _params) do
    agents = DevteamAi.AgentOrchestrator.get_agent_status()
    json(conn, %{agents: agents})
  end

  def update_status(conn, %{"agent_id" => agent_id, "status" => status} = params) do
    task_id = Map.get(params, "task_id")
    message = Map.get(params, "message", "Status updated")
    
    # Update the orchestrator with agent status
    DevteamAi.AgentOrchestrator.update_agent_status(agent_id, status, task_id, message)
    
    # Broadcast status update via WebSocket
    DevteamAiWeb.Endpoint.broadcast("agents:lobby", "agent_status_updated", %{
      agent_id: agent_id,
      status: status,
      task_id: task_id,
      message: message,
      timestamp: DateTime.utc_now()
    })
    
    json(conn, %{success: true, message: "Agent status updated"})
  end
end