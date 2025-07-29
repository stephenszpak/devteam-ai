import Config

config :devteam_ai_web, DevteamAiWeb.Endpoint,
  cache_static_manifest: "priv/static/cache_manifest.json"

config :logger, level: :info