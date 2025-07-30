defmodule DevteamAiWeb.TaskController do
  use DevteamAiWeb, :controller
  alias DevteamAi.Tasks

  def index(conn, params) do
    status = Map.get(params, "status")
    agent = Map.get(params, "agent")
    
    tasks = Tasks.list_tasks(status: status, agent: agent)
    json(conn, %{tasks: tasks})
  end

  def create(conn, %{"task" => task_params}) do
    case Tasks.create_task(task_params) do
      {:ok, task} ->
        # Notify the orchestrator about the new task
        DevteamAi.AgentOrchestrator.task_created(task)
        
        conn
        |> put_status(:created)
        |> json(%{
          task: task,
          status: "created", 
          message: "Task created successfully"
        })
        
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: changeset.errors})
    end
  end

  def create(conn, %{"description" => description} = params) do
    task_params = %{
      "description" => description,
      "priority" => Map.get(params, "priority", "medium")
    }
    
    case Tasks.create_task(task_params) do
      {:ok, task} ->
        # Notify the orchestrator about the new task
        DevteamAi.AgentOrchestrator.task_created(task)
        
        conn
        |> put_status(:created)
        |> json(%{
          task: task,
          status: "created", 
          message: "Task created successfully"
        })
        
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: changeset.errors})
    end
  end

  def show(conn, %{"id" => id}) do
    case Tasks.get_task(id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Task not found"})
      
      task ->
        json(conn, %{task: task})
    end
  end

  def update(conn, %{"id" => id, "task" => task_params}) do
    case Tasks.get_task(id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Task not found"})
        
      task ->
        case Tasks.update_task(task, task_params) do
          {:ok, updated_task} ->
            json(conn, %{task: updated_task, message: "Task updated successfully"})
            
          {:error, changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{errors: changeset.errors})
        end
    end
  end

  def delete(conn, %{"id" => id}) do
    case Tasks.get_task(id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Task not found"})
        
      task ->
        case Tasks.delete_task(task) do
          {:ok, _task} ->
            json(conn, %{message: "Task deleted successfully"})
            
          {:error, _changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{error: "Could not delete task"})
        end
    end
  end

  def stats(conn, _params) do
    stats = Tasks.get_task_stats()
    json(conn, %{stats: stats})
  end
end