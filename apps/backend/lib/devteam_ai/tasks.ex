defmodule DevteamAi.Tasks do
  @moduledoc """
  The Tasks context for managing development tasks.
  """

  import Ecto.Query, warn: false
  alias DevteamAi.Repo
  alias DevteamAi.Tasks.Task

  @doc """
  Returns the list of tasks, optionally filtered by status.
  """
  def list_tasks(opts \\ []) do
    query = from(t in Task, order_by: [desc: t.inserted_at])
    
    query = 
      case Keyword.get(opts, :status) do
        nil -> query
        status -> from(t in query, where: t.status == ^status)
      end

    query =
      case Keyword.get(opts, :agent) do
        nil -> query  
        agent -> from(t in query, where: t.assigned_agent == ^agent)
      end

    Repo.all(query)
  end

  @doc """
  Gets a single task.
  """
  def get_task(id) do
    Repo.get(Task, id)
  end

  @doc """
  Gets a single task, raising if not found.
  """
  def get_task!(id) do
    Repo.get!(Task, id)
  end

  @doc """
  Creates a task.
  """
  def create_task(attrs \\ %{}) do
    Task.create_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a task.
  """
  def update_task(%Task{} = task, attrs) do
    task
    |> Task.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Updates task status with automatic timestamp handling.
  """
  def update_task_status(%Task{} = task, status, additional_attrs \\ %{}) do
    task
    |> Task.status_changeset(status, additional_attrs)
    |> Repo.update()
  end

  @doc """
  Assigns a task to an agent and marks it as in_progress.
  """
  def assign_task(%Task{} = task, agent_name) do
    update_task_status(task, "in_progress", %{"assigned_agent" => agent_name})
  end

  @doc """
  Marks a task as completed with result data.
  """
  def complete_task(%Task{} = task, result) do
    update_task_status(task, "completed", %{"result" => result})
  end

  @doc """
  Marks a task as failed with error message.
  """
  def fail_task(%Task{} = task, error_message) do
    update_task_status(task, "failed", %{"error_message" => error_message})
  end

  @doc """
  Deletes a task.
  """
  def delete_task(%Task{} = task) do
    Repo.delete(task)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking task changes.
  """
  def change_task(%Task{} = task, attrs \\ %{}) do
    Task.changeset(task, attrs)
  end

  @doc """
  Gets the next pending task for processing.
  """
  def get_next_pending_task do
    from(t in Task, 
      where: t.status == "pending",
      order_by: [asc: t.inserted_at],
      limit: 1
    )
    |> Repo.one()
  end

  @doc """
  Gets tasks by status with pagination.
  """
  def get_tasks_by_status(status, opts \\ []) do
    limit = Keyword.get(opts, :limit, 50)
    offset = Keyword.get(opts, :offset, 0)

    from(t in Task,
      where: t.status == ^status,
      order_by: [desc: t.inserted_at],
      limit: ^limit,
      offset: ^offset
    )
    |> Repo.all()
  end

  @doc """
  Gets task statistics.
  """
  def get_task_stats do
    stats_query = from(t in Task,
      group_by: t.status,
      select: {t.status, count(t.id)}
    )

    stats = Repo.all(stats_query) |> Enum.into(%{})

    %{
      total: Map.values(stats) |> Enum.sum(),
      pending: Map.get(stats, "pending", 0),
      in_progress: Map.get(stats, "in_progress", 0),
      completed: Map.get(stats, "completed", 0),
      failed: Map.get(stats, "failed", 0)
    }
  end
end