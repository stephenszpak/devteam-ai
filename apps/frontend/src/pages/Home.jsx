import { useState, useEffect } from 'react'
import axios from 'axios'
import TaskInput from '../components/TaskInput'
import AgentsList from '../components/AgentsList'
import ChatLog from '../components/ChatLog'

function Home() {
  const [agents, setAgents] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await axios.get('/api/agents')
      setAgents(response.data.agents)
    } catch (error) {
      console.error('Error fetching agents:', error)
    }
  }

  const handleTaskSubmit = async (taskDescription) => {
    try {
      const response = await axios.post('/api/tasks', {
        task: { description: taskDescription }
      })
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        content: `Task created: ${taskDescription}`,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
    </div>
  )
}

export default Home