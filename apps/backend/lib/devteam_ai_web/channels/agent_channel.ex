defmodule DevteamAiWeb.AgentChannel do
  use DevteamAiWeb, :channel

  @impl true
  def join("agents:lobby", _payload, socket) do
    # Send current agent status on join
    agents = DevteamAi.AgentOrchestrator.get_agent_status()
    {:ok, assign(socket, :agents, agents)}
  end

  @impl true
  def handle_in("get_status", _payload, socket) do
    agents = DevteamAi.AgentOrchestrator.get_agent_status()
    {:reply, {:ok, %{agents: agents}}, socket}
  end
end