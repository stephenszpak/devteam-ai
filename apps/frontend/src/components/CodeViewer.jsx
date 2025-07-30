import { useState, useEffect } from 'react'
import CodeSandbox from './CodeSandbox'

function CodeViewer() {
  const [generatedFiles, setGeneratedFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState(new Set())
  const [viewMode, setViewMode] = useState('code') // 'code', 'preview', 'split'

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

  const organizeFilesByFolder = (files) => {
    const organized = {}
    
    files.forEach(file => {
      const pathParts = file.path.split('/')
      if (pathParts.length > 1) {
        // File is in a folder
        const folderPath = pathParts.slice(0, -1).join('/')
        if (!organized[folderPath]) {
          organized[folderPath] = []
        }
        organized[folderPath].push(file)
      } else {
        // File is in root
        if (!organized['__root__']) {
          organized['__root__'] = []
        }
        organized['__root__'].push(file)
      }
    })
    
    return organized
  }

  const toggleFolder = (folderPath) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath)
    } else {
      newExpanded.add(folderPath)
    }
    setExpandedFolders(newExpanded)
  }

  const getFolderIcon = (isExpanded) => {
    return isExpanded ? '📂' : '📁'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Generated Code</h2>
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                viewMode === 'code' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📄 Code
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                viewMode === 'preview' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔍 Preview
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                viewMode === 'split' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ⚡ Split
            </button>
          </div>
          
          <button
            onClick={fetchGeneratedCode}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
          >
            {loading ? '🔄' : '↻'} Refresh
          </button>
        </div>
      </div>

      <div className={`flex gap-6 h-[600px] ${
        viewMode === 'preview' ? 'flex-row' : 'flex-row'
      }`}>
        {/* File List - Always visible but smaller in preview mode */}
        <div className={`border rounded-lg overflow-hidden ${
          viewMode === 'preview' ? 'w-80' : 'flex-shrink-0 w-80'
        }`}>
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
                {(() => {
                  const organizedFiles = organizeFilesByFolder(generatedFiles)
                  return Object.entries(organizedFiles).map(([folderPath, files]) => (
                    <div key={folderPath}>
                      {folderPath !== '__root__' && (
                        <button
                          onClick={() => toggleFolder(folderPath)}
                          className="w-full text-left p-2 hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center space-x-2"
                        >
                          <span>{getFolderIcon(expandedFolders.has(folderPath))}</span>
                          <span>{folderPath.split('/').pop()}</span>
                          <span className="text-xs text-gray-400">({files.length})</span>
                        </button>
                      )}
                      
                      {(folderPath === '__root__' || expandedFolders.has(folderPath)) && (
                        <div className={folderPath !== '__root__' ? 'ml-4' : ''}>
                          {files.map((file, index) => (
                            <button
                              key={`${folderPath}-${index}`}
                              onClick={() => handleFileSelect(file)}
                              className={`w-full text-left p-2 rounded hover:bg-gray-100 text-sm ${
                                selectedFile?.path === file.path ? 'bg-blue-50 border border-blue-200' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span>{getFileIcon(file.filename)}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{file.filename}</div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {file.taskDescription} {file.agent && `• ${file.agent}`}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Content Area - Dynamic based on view mode */}
        <div className="flex-1 flex gap-6">
          {/* Code Panel */}
          {(viewMode === 'code' || viewMode === 'split') && (
            <div className={`border rounded-lg overflow-hidden ${
              viewMode === 'split' ? 'flex-1' : 'w-full'
            }`}>
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
          )}

          {/* Sandbox Panel */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`border rounded-lg overflow-hidden ${
              viewMode === 'split' ? 'flex-1' : 'w-full'
            }`}>
              <CodeSandbox 
                code={selectedFile?.content} 
                filename={selectedFile?.filename}
              />
            </div>
          )}
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