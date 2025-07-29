import Config

config :devteam_ai, DevteamAi.Repo,
  username: "postgres",
  password: "postgres",
  hostname: System.get_env("DB_HOST", "postgres"),
  database: "devteam_ai_dev",
  stacktrace: true,
  show_sensitive_data_on_connection_error: true,
  pool_size: 10

config :devteam_ai, DevteamAiWeb.Endpoint,
  http: [ip: {0, 0, 0, 0}, port: 4000],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: "Hu4qQN3iKzTV4fJxhorPQlA/3nDtgTCm+V2af1/9LEaT3NAVhHtRoJeAMlG6idXQ",
  watchers: [],
  live_reload: [
    patterns: [
      ~r"priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$",
      ~r"priv/gettext/.*(po)$",
      ~r"lib/devteam_ai_web/(controllers|live|components)/.*(ex|heex)$"
    ]
  ]

config :logger, :console, format: "[$level] $message\n"

config :phoenix, :stacktrace_depth, 20

config :phoenix, :plug_init_mode, :runtime

config :devteam_ai, dev_routes: true