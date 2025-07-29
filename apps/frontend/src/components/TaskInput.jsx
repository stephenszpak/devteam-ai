import { useState } from 'react'

function TaskInput({ onSubmit }) {
  const [taskDescription, setTaskDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskDescription.trim()) {
      onSubmit(taskDescription.trim())
      setTaskDescription('')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-2">
            Task Description
          </label>
          <textarea
            id="task"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Describe the task you want the AI agents to work on..."
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Task
        </button>
      </form>
    </div>
  )
}

export default TaskInput