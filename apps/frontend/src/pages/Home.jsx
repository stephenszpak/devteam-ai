import { useState, useEffect } from 'react'
import TaskInput from '../components/TaskInput'
import AgentsList from '../components/AgentsList'
import ChatLog from '../components/ChatLog'
import CodeViewer from '../components/CodeViewer'
import ConnectionStatus from '../components/ConnectionStatus'
import webSocketService from '../services/websocket'

function Home() {
  const [agents, setAgents] = useState([
    { name: "frontend_coder", status: "idle", current_task: null },
    { name: "backend_coder", status: "idle", current_task: null },
    { name: "reviewer", status: "idle", current_task: null }
  ])
  const [messages, setMessages] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    initializeWebSocket()
    
    return () => {
      webSocketService.disconnect()
    }
  }, [])

  const initializeWebSocket = async () => {
    try {
      await webSocketService.connect()
      setConnected(true)
      
      // Add initial connection message
      addMessage('system', '🔌 Connected to DevTeam AI server')
      
      // Set up WebSocket event listeners
      webSocketService.onTaskCreated((task) => {
        addMessage('system', `📋 Task created: ${task.description}`)
      })
      
      webSocketService.onTaskCompleted((task) => {
        addMessage('system', `✅ Task completed: ${task.task_id} - ${task.files_created?.length || 0} files created`)
      })

      webSocketService.onTaskProgress((progress) => {
        addMessage('progress', `📈 ${progress.agent}: ${progress.stage} (${progress.progress}%) - ${progress.details}`)
      })

      webSocketService.onTaskFailed((error) => {
        addMessage('error', `❌ Task failed: ${error.task_id} - ${error.error_message}`)
      })

      webSocketService.onFileCreated((file) => {
        addMessage('file', `📄 File created: ${file.file_path} (${file.file_type})`)
      })
      
      webSocketService.onAgentStatusChange((agentUpdate) => {
        // Update agent status
        setAgents(prev => prev.map(agent => 
          agent.name === agentUpdate.agent 
            ? { 
                ...agent, 
                status: agentUpdate.status, 
                current_task: agentUpdate.current_task 
              }
            : agent
        ))
        
        // Add message about agent status change
        if (agentUpdate.message) {
          addMessage('agent', `🤖 ${agentUpdate.agent}: ${agentUpdate.message}`)
        }
      })
      
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      addMessage('system', '❌ Failed to connect to server. Using fallback mode.')
    }
  }

  const addMessage = (type, content) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      type,
      content,
      timestamp: new Date()
    }])
  }

  const handleTaskSubmit = async (taskDescription) => {
    try {
      if (connected) {
        // Use WebSocket for real-time task creation
        await webSocketService.createTask(taskDescription)
      } else {
        // Fallback to HTTP API
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: { description: taskDescription } })
        })
        
        if (response.ok) {
          addMessage('system', `📋 Task created: ${taskDescription}`)
        }
      }
    } catch (error) {
      console.error('Error creating task:', error)
      addMessage('system', `❌ Error creating task: ${error.message}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">AI Development Team</h2>
        <ConnectionStatus connected={connected} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TaskInput onSubmit={handleTaskSubmit} />
          <div className="mt-8">
            <AgentsList agents={agents} />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <ChatLog messages={messages} />
        </div>
      </div>
      
      {/* Full width Generated Code section */}
      <div className="mt-8">
        <CodeViewer />
      </div>
    </div>
  )
}

export default Home