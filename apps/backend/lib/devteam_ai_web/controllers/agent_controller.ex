defmodule DevteamAiWeb.AgentController do
  use DevteamAiWeb, :controller

  def index(conn, _params) do
    agents = DevteamAi.AgentOrchestrator.get_agent_status()
    json(conn, %{agents: agents})
  end
end