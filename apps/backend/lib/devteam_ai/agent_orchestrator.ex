defmodule DevteamAi.AgentOrchestrator do
  use GenServer
  alias DevteamAi.Tasks

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, %{agents: %{}}, name: __MODULE__)
  end

  def init(state) do
    # Schedule periodic task processing
    :timer.send_interval(5000, :process_pending_tasks)
    {:ok, state}
  end

  def task_created(task) do
    GenServer.cast(__MODULE__, {:task_created, task})
  end

  def get_agent_status do
    GenServer.call(__MODULE__, :get_agent_status)
  end

  def update_agent_status(agent_id, status, task_id, message) do
    GenServer.cast(__MODULE__, {:update_agent_status, agent_id, status, task_id, message})
  end

  def handle_cast({:task_created, task}, state) do
    # Broadcast via WebSocket
    DevteamAiWeb.Endpoint.broadcast("tasks:lobby", "task_created", %{
      id: task.id,
      description: task.description,
      status: task.status,
      priority: task.priority,
      created_at: DateTime.to_iso8601(task.inserted_at)
    })
    
    # Trigger immediate processing attempt
    send(self(), :process_pending_tasks)
    
    {:noreply, state}
  end

  def handle_cast({:update_agent_status, agent_id, status, task_id, message}, state) do
    # Update agent status in state
    updated_agents = Map.put(state.agents, agent_id, %{
      status: status,
      current_task: task_id,
      last_update: DateTime.utc_now()
    })
    
    # Update task in database if task_id is provided
    if task_id do
      case Tasks.get_task(task_id) do
        nil -> :ok
        task ->
          case status do
            "working" -> Tasks.assign_task(task, agent_id)
            "completed" -> 
              result = %{
                "agent" => agent_id,
                "message" => message,
                "completed_at" => DateTime.utc_now()
              }
              Tasks.complete_task(task, result)
            "failed" -> Tasks.fail_task(task, message)
            _ -> :ok
          end
      end
    end
    
    IO.puts("Agent #{agent_id} status updated: #{status} - #{message}")
    
    # Broadcast via WebSocket
    DevteamAiWeb.Endpoint.broadcast("agents:lobby", "agent_status_change", %{
      agent: agent_id,
      status: status,
      current_task: task_id,
      message: message,
      timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
    })
    
    {:noreply, %{state | agents: updated_agents}}
  end

  def handle_info(:process_pending_tasks, state) do
    # Get next pending task
    case Tasks.get_next_pending_task() do
      nil -> 
        {:noreply, state}
        
      task ->
        # Find available agent
        available_agent = find_available_agent()
        
        if available_agent do
          # Assign task to agent
          case Tasks.assign_task(task, available_agent) do
            {:ok, updated_task} ->
              # Broadcast task assignment
              DevteamAiWeb.Endpoint.broadcast("tasks:lobby", "task_assigned", %{
                id: updated_task.id,
                status: updated_task.status,
                assigned_agent: updated_task.assigned_agent
              })
              
              DevteamAiWeb.Endpoint.broadcast("agents:lobby", "agent_status_change", %{
                agent: available_agent,
                status: "working",
                current_task: updated_task.id,
                message: "Processing task: #{String.slice(updated_task.description, 0, 50)}...",
                timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
              })
              
            {:error, _changeset} ->
              IO.puts("Failed to assign task #{task.id} to agent #{available_agent}")
          end
        end
        
        {:noreply, state}
    end
  end

  def handle_call(:get_agent_status, _from, state) do
    # Return both static agent info and dynamic status
    base_agents = [
      %{name: "frontend_coder", type: "frontend", capabilities: ["React", "JavaScript", "CSS"]},
      %{name: "backend_coder", type: "backend", capabilities: ["Phoenix", "Elixir", "Database"]},
      %{name: "reviewer", type: "qa", capabilities: ["Code Review", "Testing", "Quality Assurance"]}
    ]
    
    agents = Enum.map(base_agents, fn agent ->
      status_info = Map.get(state.agents, agent.name, %{
        status: "idle",
        current_task: nil,
        last_update: nil
      })
      
      Map.merge(agent, status_info)
    end)
    
    {:reply, agents, state}
  end

  # Helper function to find available agent
  defp find_available_agent do
    # Simple round-robin for now, could be enhanced with agent capabilities
    available_agents = ["frontend_coder", "backend_coder", "reviewer"]
    Enum.random(available_agents)
  end
end