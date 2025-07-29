import Config

config :devteam_ai,
  ecto_repos: [DevteamAi.Repo]

config :devteam_ai_web, DevteamAiWeb.Endpoint,
  url: [host: "localhost"],
  render_errors: [
    formats: [html: DevteamAiWeb.ErrorHTML, json: DevteamAiWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: DevteamAi.PubSub,
  live_view: [signing_salt: "aBcDeFgH"]

config :devteam_ai, DevteamAi.Repo,
  username: "postgres",
  password: "postgres",
  hostname: System.get_env("DB_HOST", "localhost"),
  database: "devteam_ai_dev",
  stacktrace: true,
  show_sensitive_data_on_connection_error: true,
  pool_size: 10

config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :phoenix, :json_library, Jason

import_config "#{config_env()}.exs"