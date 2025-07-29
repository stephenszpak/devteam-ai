defmodule DevteamAiWeb.TaskController do
  use DevteamAiWeb, :controller

  def create(conn, %{"task" => task_params}) do
    DevteamAi.AgentOrchestrator.create_task(task_params["description"])
    
    json(conn, %{status: "created", message: "Task created successfully"})
  end

  def show(conn, %{"id" => id}) do
    case DevteamAi.AgentOrchestrator.get_task(id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Task not found"})
      
      task ->
        json(conn, task)
    end
  end
end