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

  def update_agent_status(agent_id, status, task_id, message) do
    GenServer.cast(__MODULE__, {:update_agent_status, agent_id, status, task_id, message})
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
    
    # Broadcast via PubSub and WebSocket
    Phoenix.PubSub.broadcast(DevteamAi.PubSub, "tasks", {:task_created, task})
    DevteamAiWeb.Endpoint.broadcast("tasks:lobby", "task_created", %{
      id: task_id,
      description: task_description,
      status: "pending",
      created_at: DateTime.to_iso8601(task.created_at)
    })
    
    # Simulate agent status change
    Process.send_after(self(), {:simulate_agent_work, task_id}, 2000)
    
    {:noreply, new_state}
  end

  def handle_cast({:update_agent_status, agent_id, status, task_id, message}, state) do
    # Store agent status in state if needed
    IO.puts("Agent #{agent_id} status updated: #{status} - #{message}")
    
    # Broadcast via WebSocket
    DevteamAiWeb.Endpoint.broadcast("agents:lobby", "agent_status_change", %{
      agent: agent_id,
      status: status,
      current_task: task_id,
      message: message,
      timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
    })
    
    {:noreply, state}
  end

  def handle_info({:simulate_agent_work, task_id}, state) do
    # Simulate agent picking up task
    DevteamAiWeb.Endpoint.broadcast("agents:lobby", "agent_status_change", %{
      agent: "frontend_coder",
      status: "working",
      current_task: task_id,
      message: "Started working on task: #{task_id}"
    })
    
    # Simulate work completion after 5 seconds
    Process.send_after(self(), {:simulate_completion, task_id}, 5000)
    
    {:noreply, state}
  end

  def handle_info({:simulate_completion, task_id}, state) do
    # Update task status
    updated_state = case Map.get(state, task_id) do
      nil -> state
      task -> 
        updated_task = %{task | status: "completed"}
        Map.put(state, task_id, updated_task)
    end
    
    # Broadcast completion
    DevteamAiWeb.Endpoint.broadcast("tasks:lobby", "task_completed", %{
      id: task_id,
      status: "completed",
      completed_at: DateTime.utc_now() |> DateTime.to_iso8601()
    })
    
    DevteamAiWeb.Endpoint.broadcast("agents:lobby", "agent_status_change", %{
      agent: "frontend_coder", 
      status: "idle",
      current_task: nil,
      message: "Completed task: #{task_id}"
    })
    
    {:noreply, updated_state}
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