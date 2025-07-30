defmodule DevteamAiWeb.TaskProgressController do
  use DevteamAiWeb, :controller
  alias DevteamAi.{Tasks, Repo, GeneratedFile}

  def update_progress(conn, %{"id" => task_id, "progress_percentage" => progress, "current_stage" => stage} = params) do
    agent_id = Map.get(params, "agent_id")
    stage_details = Map.get(params, "stage_details", "")
    timestamp = Map.get(params, "timestamp", DateTime.utc_now() |> DateTime.to_unix())
    
    case Tasks.get_task(task_id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Task not found"})
      
      task ->
        # Update task with progress information
        progress_data = %{
          "progress_percentage" => progress,
          "current_stage" => stage,
          "stage_details" => stage_details,
          "last_updated_by" => agent_id,
          "last_updated_at" => DateTime.from_unix!(trunc(timestamp))
        }
        
        # Store progress in task result or metadata
        updated_result = Map.merge(task.result || %{}, %{"progress" => progress_data})
        
        case Tasks.update_task(task, %{"result" => updated_result}) do
          {:ok, updated_task} ->
            # Broadcast progress update via WebSocket
            DevteamAiWeb.Endpoint.broadcast("tasks:lobby", "task_progress", %{
              task_id: task_id,
              progress: progress,
              stage: stage,
              details: stage_details,
              agent: agent_id,
              timestamp: DateTime.to_iso8601(DateTime.from_unix!(trunc(timestamp)))
            })
            
            json(conn, %{status: "progress_updated", progress: progress, stage: stage})
            
          {:error, _changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{error: "Failed to update task progress"})
        end
    end
  end

  def notify_file_created(conn, %{"id" => task_id, "file_path" => file_path, "file_type" => file_type} = params) do
    agent_id = Map.get(params, "agent_id")
    description = Map.get(params, "description", "")
    content = Map.get(params, "content", "")
    timestamp = Map.get(params, "timestamp", DateTime.utc_now() |> DateTime.to_unix())
    
    case Tasks.get_task(task_id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Task not found"})
      
      task ->
        # Store file content in generated_files table
        filename = Path.basename(file_path)
        file_id = "#{task_id}_#{filename}_#{:os.system_time(:millisecond)}"
        
        file_attrs = %{
          id: file_id,
          task_id: task_id,
          filename: filename,
          file_path: file_path,
          content: content,
          file_type: file_type,
          description: description,
          agent_name: agent_id
        }
        
        case Repo.insert(GeneratedFile.changeset(%GeneratedFile{}, file_attrs)) do
          {:ok, _generated_file} ->
            # Add file to task's files_created array
            updated_files = [file_path | (task.files_created || [])]
            Tasks.update_task(task, %{"files_created" => updated_files})
            
            # Broadcast file creation via WebSocket
            DevteamAiWeb.Endpoint.broadcast("tasks:lobby", "file_created", %{
              task_id: task_id,
              file_path: file_path,
              file_type: file_type,
              description: description,
              agent: agent_id,
              timestamp: DateTime.to_iso8601(DateTime.from_unix!(trunc(timestamp)))
            })
            
            json(conn, %{status: "file_recorded", file_path: file_path})
            
          {:error, _changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{error: "Failed to store file content"})
        end
    end
  end

  def complete_task(conn, %{"id" => task_id, "result" => result, "files_created" => files_created} = params) do
    agent_id = Map.get(params, "agent_id")
    completion_time = Map.get(params, "completion_time", DateTime.utc_now() |> DateTime.to_unix())
    metadata = Map.get(params, "metadata", %{})
    
    case Tasks.get_task(task_id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Task not found"})
      
      task ->
        # Prepare completion data
        completion_result = Map.merge(result, %{
          "completed_by" => agent_id,
          "completion_timestamp" => completion_time,
          "metadata" => metadata
        })
        
        completion_attrs = %{
          "status" => "completed",
          "result" => completion_result,
          "files_created" => files_created,
          "completed_at" => DateTime.from_unix!(trunc(completion_time))
        }
        
        case Tasks.update_task(task, completion_attrs) do
          {:ok, updated_task} ->
            # Broadcast task completion via WebSocket
            DevteamAiWeb.Endpoint.broadcast("tasks:lobby", "task_completed", %{
              task_id: task_id,
              status: "completed",
              files_created: files_created,
              result: completion_result,
              agent: agent_id,
              completed_at: DateTime.to_iso8601(DateTime.from_unix!(trunc(completion_time)))
            })
            
            json(conn, %{
              status: "task_completed", 
              files_created: length(files_created),
              processing_time: Map.get(metadata, "processing_time", 0)
            })
            
          {:error, _changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{error: "Failed to complete task"})
        end
    end
  end

  def report_error(conn, %{"id" => task_id, "error_message" => error_message} = params) do
    agent_id = Map.get(params, "agent_id")
    error_type = Map.get(params, "error_type", "general")
    error_details = Map.get(params, "error_details", %{})
    timestamp = Map.get(params, "timestamp", DateTime.utc_now() |> DateTime.to_unix())
    metadata = Map.get(params, "metadata", %{})
    
    case Tasks.get_task(task_id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Task not found"})
      
      task ->
        # Prepare error data
        error_result = %{
          "error_type" => error_type,
          "error_message" => error_message,
          "error_details" => error_details,
          "failed_by" => agent_id,
          "failure_timestamp" => timestamp,
          "metadata" => metadata
        }
        
        error_attrs = %{
          "status" => "failed",
          "error_message" => error_message,
          "result" => error_result,
          "completed_at" => DateTime.from_unix!(trunc(timestamp))
        }
        
        case Tasks.update_task(task, error_attrs) do
          {:ok, updated_task} ->
            # Broadcast task failure via WebSocket
            DevteamAiWeb.Endpoint.broadcast("tasks:lobby", "task_failed", %{
              task_id: task_id,
              status: "failed",
              error_type: error_type,
              error_message: error_message,
              agent: agent_id,
              failed_at: DateTime.to_iso8601(DateTime.from_unix!(trunc(timestamp)))
            })
            
            json(conn, %{status: "error_reported", error_type: error_type})
            
          {:error, _changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{error: "Failed to report task error"})
        end
    end
  end
end