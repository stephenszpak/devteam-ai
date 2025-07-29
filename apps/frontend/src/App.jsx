import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TaskDetail from './pages/TaskDetail'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">DevTeam AI</h1>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task/:id" element={<TaskDetail />} />
      </Routes>
    </div>
  )
}

export default App