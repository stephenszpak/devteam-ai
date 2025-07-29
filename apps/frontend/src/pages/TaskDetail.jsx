import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function TaskDetail() {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    try {
      const response = await axios.get(`/api/tasks/${id}`)
      setTask(response.data)
    } catch (error) {
      console.error('Error fetching task:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading task details...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Task not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Task Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID</label>
            <p className="text-gray-900">{task.id}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <p className="text-gray-900">{task.description}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              task.status === 'completed' ? 'bg-green-100 text-green-800' :
              task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {task.status}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Created At</label>
            <p className="text-gray-900">{new Date(task.created_at).toLocaleString()}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned Agents</label>
            <p className="text-gray-900">
              {task.agents_assigned?.length > 0 ? task.agents_assigned.join(', ') : 'None'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail