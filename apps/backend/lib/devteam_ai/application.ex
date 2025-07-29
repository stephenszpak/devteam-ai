defmodule DevteamAi.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      DevteamAi.Repo,
      {DNSCluster, query: Application.get_env(:devteam_ai, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: DevteamAi.PubSub},
      {Finch, name: DevteamAi.Finch},
      DevteamAiWeb.Endpoint,
      DevteamAi.AgentOrchestrator
    ]

    opts = [strategy: :one_for_one, name: DevteamAi.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    DevteamAiWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end