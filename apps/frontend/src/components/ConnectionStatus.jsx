function ConnectionStatus({ connected }) {
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      connected 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        connected ? 'bg-green-500' : 'bg-red-500'
      }`} />
      {connected ? '🔌 Connected' : '❌ Disconnected'}
    </div>
  )
}

export default ConnectionStatus