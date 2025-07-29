defmodule DevteamAi.AgentOrchestrator do
  use GenServer

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  def init(state) do
    {:ok, state}
  end

  def create_task(task_description) do
    GenServer.cast(__MODULE__, {:create_task, task_description})
  end

  def get_agent_status do
    GenServer.call(__MODULE__, :get_agent_status)
  end

  def handle_cast({:create_task, task_description}, state) do
    task_id = :crypto.strong_rand_bytes(8) |> Base.encode16() |> String.downcase()
    
    task = %{
      id: task_id,
      description: task_description,
      status: "pending",
      created_at: DateTime.utc_now(),
      agents_assigned: []
    }

    new_state = Map.put(state, task_id, task)
    
    Phoenix.PubSub.broadcast(DevteamAi.PubSub, "tasks", {:task_created, task})
    
    {:noreply, new_state}
  end

  def handle_call(:get_agent_status, _from, state) do
    agents = [
      %{name: "frontend_coder", status: "idle", current_task: nil},
      %{name: "backend_coder", status: "idle", current_task: nil},
      %{name: "reviewer", status: "idle", current_task: nil}
    ]
    
    {:reply, agents, state}
  end

  def handle_call({:get_task, task_id}, _from, state) do
    task = Map.get(state, task_id)
    {:reply, task, state}
  end

  def get_task(task_id) do
    GenServer.call(__MODULE__, {:get_task, task_id})
  end
end