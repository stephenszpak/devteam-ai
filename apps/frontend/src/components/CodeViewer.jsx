import { useState, useEffect } from 'react'

function CodeViewer() {
  const [generatedFiles, setGeneratedFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchGeneratedCode()
    // Refresh every 10 seconds to check for new generated code
    const interval = setInterval(fetchGeneratedCode, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchGeneratedCode = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/generated-code')
      if (response.ok) {
        const data = await response.json()
        setGeneratedFiles(data.files || [])
      }
    } catch (error) {
      console.error('Error fetching generated code:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (file) => {
    try {
      const response = await fetch(`/api/generated-code/${file.path}`)
      if (response.ok) {
        const content = await response.text()
        setSelectedFile({ ...file, content })
      }
    } catch (error) {
      console.error('Error fetching file content:', error)
    }
  }

  const getFileIcon = (filename) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) {
      return '⚛️'
    } else if (filename.endsWith('.css')) {
      return '🎨'
    } else if (filename.endsWith('.md')) {
      return '📝'
    } else if (filename.endsWith('.js')) {
      return '📜'
    }
    return '📄'
  }

  const getLanguage = (filename) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) {
      return 'jsx'
    } else if (filename.endsWith('.css')) {
      return 'css'
    } else if (filename.endsWith('.md')) {
      return 'markdown'
    } else if (filename.endsWith('.js')) {
      return 'javascript'
    }
    return 'text'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Generated Code</h2>
        <button
          onClick={fetchGeneratedCode}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {loading ? '🔄' : '↻'} Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* File List */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 border-b">
            <h3 className="text-sm font-medium text-gray-700">Files ({generatedFiles.length})</h3>
          </div>
          <div className="overflow-y-auto h-full">
            {generatedFiles.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {loading ? 'Loading...' : 'No generated code yet. Create a task to get started!'}
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {generatedFiles.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => handleFileSelect(file)}
                    className={`w-full text-left p-2 rounded hover:bg-gray-100 text-sm ${
                      selectedFile?.path === file.path ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{getFileIcon(file.filename)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{file.filename}</div>
                        <div className="text-xs text-gray-500 truncate">{file.taskDescription}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Code Preview */}
        <div className="lg:col-span-2 border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 border-b">
            <h3 className="text-sm font-medium text-gray-700">
              {selectedFile ? selectedFile.filename : 'Code Preview'}
            </h3>
          </div>
          <div className="overflow-y-auto h-full">
            {selectedFile ? (
              <pre className="p-4 text-sm bg-gray-900 text-gray-100 h-full overflow-auto">
                <code className={`language-${getLanguage(selectedFile.filename)}`}>
                  {selectedFile.content}
                </code>
              </pre>
            ) : (
              <div className="p-4 text-center text-gray-500 h-full flex items-center justify-center">
                Select a file to view its content
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              📁 Task: {selectedFile.taskDescription || 'Unknown task'}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(selectedFile.content)}
              className="text-blue-600 hover:text-blue-800"
            >
              📋 Copy Code
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CodeViewer