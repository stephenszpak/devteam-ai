import Config

config :devteam_ai, DevteamAi.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "devteam_ai_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

config :devteam_ai_web, DevteamAiWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "Hu4qQN3iKzTV4fJxhorPQlA/3nDtgTCm+V2af1/9LEaT3NAVhHtRoJeAMlG6idXQ",
  server: false

config :logger, level: :warning

config :phoenix, :plug_init_mode, :runtime