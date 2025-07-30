defmodule DevteamAi.Repo.Migrations.CreateGeneratedFiles do
  use Ecto.Migration

  def change do
    create table(:generated_files, primary_key: false) do
      add :id, :string, primary_key: true
      add :task_id, :string, null: false
      add :filename, :string, null: false
      add :file_path, :string, null: false
      add :content, :text, null: false
      add :file_type, :string, null: false
      add :description, :text
      add :agent_name, :string

      timestamps(type: :utc_datetime)
    end

    create index(:generated_files, [:task_id])
    create index(:generated_files, [:file_type])
    create index(:generated_files, [:inserted_at])
  end
end
