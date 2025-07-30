defmodule DevteamAi.Repo.Migrations.CreateTasks do
  use Ecto.Migration

  def change do
    create table(:tasks, primary_key: false) do
      add :id, :string, primary_key: true
      add :description, :text, null: false
      add :status, :string, null: false, default: "pending"
      add :priority, :string, default: "medium"
      add :assigned_agent, :string
      add :result, :map
      add :error_message, :text
      add :started_at, :utc_datetime
      add :completed_at, :utc_datetime
      add :files_created, {:array, :string}, default: []

      timestamps(type: :utc_datetime)
    end

    create index(:tasks, [:status])
    create index(:tasks, [:assigned_agent])
    create index(:tasks, [:inserted_at])
  end
end
