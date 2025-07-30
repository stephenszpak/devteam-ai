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

    get "/tasks", TaskController, :index
    post "/tasks", TaskController, :create
    get "/tasks/stats", TaskController, :stats
    get "/tasks/:id", TaskController, :show
    put "/tasks/:id", TaskController, :update
    delete "/tasks/:id", TaskController, :delete
    
    # Enhanced task communication endpoints
    post "/tasks/:id/progress", TaskProgressController, :update_progress
    post "/tasks/:id/files", TaskProgressController, :notify_file_created
    post "/tasks/:id/complete", TaskProgressController, :complete_task
    post "/tasks/:id/error", TaskProgressController, :report_error
    
    get "/agents", AgentController, :index
    post "/messages", MessageController, :create
    post "/agent_status", AgentController, :update_status
    
    get "/generated-code", GeneratedCodeController, :index
    get "/generated-code/*path", GeneratedCodeController, :show
  end

  if Application.compile_env(:devteam_ai, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: DevteamAiWeb.Telemetry
    end
  end
end