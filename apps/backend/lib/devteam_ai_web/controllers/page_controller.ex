defmodule DevteamAiWeb.PageController do
  use DevteamAiWeb, :controller

  def home(conn, _params) do
    json(conn, %{message: "DevTeam AI Backend", status: "running"})
  end
end