function ChatLog({ messages }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-96 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
      
      <div className="space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${
                message.type === 'system' ? 'text-blue-600' :
                message.type === 'agent' ? 'text-green-600' :
                message.type === 'progress' ? 'text-purple-600' :
                message.type === 'error' ? 'text-red-600' :
                message.type === 'file' ? 'text-orange-600' :
                'text-gray-600'
              }`}>
                {message.type === 'system' ? 'System' :
                 message.type === 'agent' ? 'Agent' :
                 message.type === 'progress' ? 'Progress' :
                 message.type === 'error' ? 'Error' :
                 message.type === 'file' ? 'File' : 'User'}
              </span>
              <span className="text-xs text-gray-500">
                {message.timestamp?.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-800 mt-1">{message.content}</p>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No activity yet. Create a task to get started!
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatLog