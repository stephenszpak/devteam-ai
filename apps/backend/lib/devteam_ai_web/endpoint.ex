defmodule DevteamAiWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :devteam_ai

  @session_options [
    store: :cookie,
    key: "_devteam_ai_key",
    signing_salt: "uZ1YjGzG",
    same_site: "Lax"
  ]

  socket "/live", Phoenix.LiveView.Socket, websocket: [connect_info: [session: @session_options]]
  socket "/socket", DevteamAiWeb.UserSocket, websocket: true, longpoll: false

  plug CORSPlug,
    origin: ["http://localhost:5173"],
    credentials: true

  plug Plug.Static,
    at: "/",
    from: :devteam_ai,
    gzip: false,
    only: DevteamAiWeb.static_paths()

  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
    plug Phoenix.Ecto.CheckRepoStatus, otp_app: :devteam_ai
  end

  plug Phoenix.LiveDashboard.RequestLogger,
    param_key: "request_logger",
    cookie_key: "request_logger"

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.MethodOverride
  plug Plug.Head
  plug Plug.Session, @session_options
  plug DevteamAiWeb.Router
end