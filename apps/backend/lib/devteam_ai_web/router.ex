defmodule DevteamAiWeb.Router do
  use DevteamAiWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {DevteamAiWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", DevteamAiWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  scope "/api", DevteamAiWeb do
    pipe_through :api

    post "/tasks", TaskController, :create
    get "/tasks/:id", TaskController, :show
    get "/agents", AgentController, :index
    post "/messages", MessageController, :create
    post "/agent_status", AgentController, :update_status
  end

  if Application.compile_env(:devteam_ai, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: DevteamAiWeb.Telemetry
    end
  end
end