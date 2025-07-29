class WebSocketService {
  constructor() {
    this.socket = null
    this.connected = false
    this.callbacks = {
      taskCreated: [],
      taskCompleted: [],
      agentStatusChange: []
    }
    this.reconnectInterval = null
  }

  connect() {
    if (this.connected) return Promise.resolve()

    return new Promise((resolve, reject) => {
      try {
        // Connect to Phoenix WebSocket using native WebSocket
        this.socket = new WebSocket('ws://localhost:4000/socket/websocket')
        
        this.socket.onopen = () => {
          console.log('WebSocket connected')
          this.connected = true
          
          // Join channels after connection
          this.joinChannel('tasks:lobby')
          this.joinChannel('agents:lobby')
          
          resolve()
        }

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.handleMessage(data)
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.connected = false
          reject(new Error('WebSocket connection failed'))
        }

        this.socket.onclose = () => {
          console.log('WebSocket connection closed')
          this.connected = false
          this.attemptReconnect()
        }

      } catch (error) {
        reject(error)
      }
    })
  }

  joinChannel(topic) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        topic: topic,
        event: 'phx_join',
        payload: {},
        ref: Date.now().toString()
      }
      this.socket.send(JSON.stringify(message))
    }
  }

  handleMessage(data) {
    // Handle Phoenix channel messages
    if (data.event === 'task_created') {
      this.callbacks.taskCreated.forEach(callback => callback(data.payload))
    } else if (data.event === 'task_completed') {
      this.callbacks.taskCompleted.forEach(callback => callback(data.payload))  
    } else if (data.event === 'agent_status_change') {
      this.callbacks.agentStatusChange.forEach(callback => callback(data.payload))
    }
  }

  attemptReconnect() {
    if (this.reconnectInterval) return

    this.reconnectInterval = setInterval(() => {
      console.log('Attempting to reconnect...')
      this.connect().then(() => {
        clearInterval(this.reconnectInterval)
        this.reconnectInterval = null
      }).catch(() => {
        // Continue trying to reconnect
      })
    }, 5000)
  }

  // Task-related methods
  onTaskCreated(callback) {
    this.callbacks.taskCreated.push(callback)
  }

  onTaskCompleted(callback) {
    this.callbacks.taskCompleted.push(callback)
  }

  createTask(description) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        topic: 'tasks:lobby',
        event: 'new_task',
        payload: { description },
        ref: Date.now().toString()
      }
      this.socket.send(JSON.stringify(message))
      return Promise.resolve()
    }
    return Promise.reject(new Error('Not connected'))
  }

  // Agent-related methods
  onAgentStatusChange(callback) {
    this.callbacks.agentStatusChange.push(callback)
  }

  getAgentStatus() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        topic: 'agents:lobby',
        event: 'get_status',
        payload: {},
        ref: Date.now().toString()
      }
      this.socket.send(JSON.stringify(message))
      return Promise.resolve()
    }
    return Promise.reject(new Error('Not connected'))
  }

  disconnect() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval)
      this.reconnectInterval = null
    }
    
    if (this.socket) {
      this.socket.close()
      this.connected = false
    }
  }
}

// Create singleton instance
const webSocketService = new WebSocketService()

export default webSocketService