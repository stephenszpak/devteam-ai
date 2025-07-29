defmodule DevteamAiWeb.MessageController do
  use DevteamAiWeb, :controller

  def create(conn, %{"message" => message_params}) do
    Phoenix.PubSub.broadcast(DevteamAi.PubSub, "chat", {:new_message, message_params})
    
    json(conn, %{status: "sent", message: "Message sent successfully"})
  end
end