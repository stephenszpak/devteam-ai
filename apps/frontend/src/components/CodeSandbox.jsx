import { useState, useEffect, useRef } from 'react'
import * as React from 'react'

function CodeSandbox({ code, filename }) {
  const [error, setError] = useState(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [componentOutput, setComponentOutput] = useState(null)
  const iframeRef = useRef(null)

  // Check if the code is a React component
  const isReactComponent = (code) => {
    return code.includes('React') || 
           code.includes('useState') || 
           code.includes('useEffect') ||
           code.includes('export default') ||
           /function\s+[A-Z][a-zA-Z]*\s*\(/.test(code) ||
           /const\s+[A-Z][a-zA-Z]*\s*=/.test(code)
  }

  // Extract component name from code
  const extractComponentName = (code) => {
    const patterns = [
      /export\s+default\s+([A-Z][a-zA-Z0-9]*)/,
      /const\s+([A-Z][a-zA-Z0-9]*)\s*=/,
      /function\s+([A-Z][a-zA-Z0-9]*)\s*\(/
    ]
    
    for (const pattern of patterns) {
      const match = code.match(pattern)
      if (match) return match[1]
    }
    
    // Fallback to filename
    if (filename) {
      return filename.split('.')[0]
    }
    
    return 'Component'
  }

  // Generate sandbox HTML
  const generateSandboxHTML = (code, componentName) => {
    // Clean the code by removing import statements and TypeScript interfaces
    const cleanCode = code
      .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '') // Remove import statements
      .replace(/export\s+default\s+\w+;?\s*$/gm, '') // Remove export default statements
      .replace(/interface\s+\w+\s*{[^}]*}\s*/g, '') // Remove TypeScript interfaces
      .replace(/:\s*React\.FC<[^>]*>/g, '') // Remove React.FC type annotations
      .replace(/:\s*\w+(\[\])?/g, '') // Remove other type annotations
      .trim()

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Component Sandbox</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f8fafc;
    }
    .sandbox-container {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      min-height: 200px;
    }
    .error {
      color: #dc2626;
      background: #fef2f2;
      border: 1px solid #fecaca;
      padding: 12px;
      border-radius: 6px;
      margin: 10px 0;
      font-family: monospace;
      white-space: pre-wrap;
    }
    .preview-header {
      color: #6b7280;
      fontSize: '12px';
      marginBottom: '16px';
      borderBottom: '1px solid #e5e7eb';
      paddingBottom: '8px';
      fontWeight: '500';
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="sandbox-container">
      <div style="color: #6b7280; margin-bottom: 10px;">Loading component...</div>
    </div>
  </div>

  <script type="text/babel">
    const { useState, useEffect, useRef, useCallback, useMemo } = React;
    
    try {
      // Component code (imports removed, React hooks available globally)
      ${cleanCode}
      
      // Create a demo wrapper for components that need props
      const ComponentDemo = () => {
        // Demo props for different component types
        const demoProps = {
          // For Card components
          title: "Demo Card",
          children: "This is a sample card component with some content to demonstrate how it looks and behaves.",
          
          // For Accordion components  
          items: [
            { title: "Section 1", content: "This is the content for the first section." },
            { title: "Section 2", content: "This is the content for the second section." },
            { title: "Section 3", content: "This is the content for the third section." }
          ],
          
          // For Button components
          onClick: () => alert('Button clicked!'),
          
          // Generic props
          className: "demo-component"
        };

        return (
          <div className="sandbox-container">
            <div className="preview-header">
              🔍 Live Preview: ${componentName}
            </div>
            <div style={{padding: '16px', border: '1px dashed #d1d5db', borderRadius: '8px', background: '#f9fafb'}}>
              <${componentName} {...demoProps}>
                <p>Demo content for the component</p>
              </${componentName}>
            </div>
          </div>
        );
      };
      
      ReactDOM.render(<ComponentDemo />, document.getElementById('root'));
      
      // Notify parent of successful execution
      window.parent.postMessage({ type: 'sandbox-success' }, '*');
      
    } catch (error) {
      console.error('Sandbox execution error:', error);
      
      document.getElementById('root').innerHTML = \`
        <div class="sandbox-container">
          <div class="error">
            <strong>Component Execution Error:</strong>\\n\${error.message}
            \\n\\n<strong>Common Issues:</strong>
            \\n• Component may use unsupported imports
            \\n• TypeScript interfaces not supported in sandbox
            \\n• Component may require specific props
          </div>
        </div>
      \`;
      
      // Notify parent of error
      window.parent.postMessage({ 
        type: 'sandbox-error', 
        error: error.message 
      }, '*');
    }
  </script>
</body>
</html>`
  }

  // Execute code in sandbox
  const executeCode = () => {
    if (!code || !isReactComponent(code)) {
      setError('Not a valid React component')
      return
    }

    setIsExecuting(true)
    setError(null)
    
    const componentName = extractComponentName(code)
    const sandboxHTML = generateSandboxHTML(code, componentName)
    
    // Create blob URL for iframe
    const blob = new Blob([sandboxHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    if (iframeRef.current) {
      iframeRef.current.src = url
    }
    
    // Cleanup blob URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(url)
      setIsExecuting(false)
    }, 1000)
  }

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'sandbox-success') {
        setError(null)
        setIsExecuting(false)
      } else if (event.data.type === 'sandbox-error') {
        setError(event.data.error)
        setIsExecuting(false)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Auto-execute when code changes
  useEffect(() => {
    if (code && isReactComponent(code)) {
      executeCode()
    }
  }, [code])

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a React component to preview
      </div>
    )
  }

  if (!isReactComponent(code)) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-lg mb-2">📄</div>
          <div>This file is not a React component</div>
          <div className="text-sm text-gray-400 mt-1">
            Only .jsx and .tsx files with React components can be previewed
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Live Preview</span>
          {isExecuting && (
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <div className="animate-spin w-3 h-3 border border-blue-600 border-t-transparent rounded-full"></div>
              <span>Executing...</span>
            </div>
          )}
        </div>
        <button
          onClick={executeCode}
          disabled={isExecuting}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          🔄 Refresh
        </button>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border-b border-red-200">
          <div className="text-sm text-red-700">
            <strong>Execution Error:</strong> {error}
          </div>
        </div>
      )}
      
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Component Sandbox"
        />
      </div>
    </div>
  )
}

export default CodeSandbox