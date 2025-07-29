defmodule DevteamAi.Repo do
  use Ecto.Repo,
    otp_app: :devteam_ai,
    adapter: Ecto.Adapters.Postgres
end