function AgentsList({ agents }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">AI Agents</h2>
      
      <div className="space-y-3">
        {agents.map((agent, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <h3 className="font-medium text-gray-900">{agent.name}</h3>
              {agent.current_task && (
                <p className="text-sm text-gray-600">Task: {agent.current_task}</p>
              )}
            </div>
            
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              agent.status === 'idle' ? 'bg-green-100 text-green-800' :
              agent.status === 'working' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {agent.status}
            </span>
          </div>
        ))}
        
        {agents.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No agents available
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentsList