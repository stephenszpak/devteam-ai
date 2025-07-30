defmodule DevteamAi.GeneratedFile do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :string, autogenerate: false}
  @foreign_key_type :string

  schema "generated_files" do
    field :task_id, :string
    field :filename, :string
    field :file_path, :string
    field :content, :string
    field :file_type, :string
    field :description, :string
    field :agent_name, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(generated_file, attrs) do
    generated_file
    |> cast(attrs, [:id, :task_id, :filename, :file_path, :content, :file_type, :description, :agent_name])
    |> validate_required([:id, :task_id, :filename, :file_path, :content, :file_type])
    |> unique_constraint([:id])
  end
end