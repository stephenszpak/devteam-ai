defmodule DevteamAi.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :string, autogenerate: false}
  @derive {Phoenix.Param, key: :id}
  @derive {Jason.Encoder, only: [:id, :description, :status, :priority, :assigned_agent, :result, :error_message, :started_at, :completed_at, :files_created, :inserted_at, :updated_at]}

  schema "tasks" do
    field :description, :string
    field :status, :string, default: "pending"
    field :priority, :string, default: "medium"
    field :assigned_agent, :string
    field :result, :map
    field :error_message, :string
    field :started_at, :utc_datetime
    field :completed_at, :utc_datetime
    field :files_created, {:array, :string}, default: []

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [
      :id, :description, :status, :priority, :assigned_agent, 
      :result, :error_message, :started_at, :completed_at, :files_created
    ])
    |> validate_required([:id, :description])
    |> validate_inclusion(:status, ["pending", "in_progress", "completed", "failed"])
    |> validate_inclusion(:priority, ["low", "medium", "high"])
    |> unique_constraint(:id, name: :tasks_pkey)
  end

  @doc """
  Creates a changeset for a new task with auto-generated ID
  """
  def create_changeset(attrs) do
    task_id = generate_task_id()
    
    %__MODULE__{}
    |> changeset(Map.put(attrs, "id", task_id))
  end

  @doc """
  Updates task status and timestamps
  """
  def status_changeset(task, status, additional_attrs \\ %{}) do
    attrs = 
      additional_attrs
      |> Map.put("status", status)
      |> maybe_add_timestamp(status)

    changeset(task, attrs)
  end

  defp maybe_add_timestamp(attrs, "in_progress") do
    Map.put(attrs, "started_at", DateTime.utc_now())
  end

  defp maybe_add_timestamp(attrs, status) when status in ["completed", "failed"] do
    Map.put(attrs, "completed_at", DateTime.utc_now())
  end

  defp maybe_add_timestamp(attrs, _status), do: attrs

  defp generate_task_id do
    :crypto.strong_rand_bytes(8) |> Base.encode16() |> String.downcase()
  end
end