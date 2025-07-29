"""
Agent Orchestration Runner - Simulates a coding task loop with AI agents
"""

import time
import json
import asyncio
from frontend_coder import FrontendCoder
from typing import List, Dict, Any


class AgentOrchestrator:
    def __init__(self):
        self.agents = {
            "frontend_coder": FrontendCoder(),
        }
        self.task_queue = []
        self.completed_tasks = []
        self.running = False
    
    def add_task(self, task: Dict[str, Any]):
        """Add a new task to the queue"""
        task_id = f"task_{len(self.task_queue) + 1}"
        task["id"] = task_id
        task["status"] = "pending"
        task["created_at"] = time.time()
        
        self.task_queue.append(task)
        print(f"📋 Task added: {task['description'][:50]}...")
    
    def assign_task_to_agent(self, task: Dict[str, Any]) -> str:
        """Assign task to the most suitable agent"""
        
        # Simple assignment logic - can be enhanced with AI
        description = task.get("description", "").lower()
        
        if any(keyword in description for keyword in ["frontend", "react", "ui", "component", "css"]):
            return "frontend_coder"
        
        # Default to frontend coder for now
        return "frontend_coder"
    
    async def process_task_queue(self):
        """Process tasks in the queue"""
        while self.running and self.task_queue:
            task = self.task_queue.pop(0)
            task["status"] = "in_progress"
            
            # Assign to appropriate agent
            agent_name = self.assign_task_to_agent(task)
            agent = self.agents[agent_name]
            
            print(f"🤖 Assigning task {task['id']} to {agent_name}")
            
            # Process the task
            result = agent.process_task(task)
            
            # Send update to backend
            agent.send_message_to_backend(
                f"Task {task['id']} completed by {agent_name}: {result['message']}"
            )
            
            # Mark as completed
            task["status"] = "completed"
            task["result"] = result
            task["completed_at"] = time.time()
            
            self.completed_tasks.append(task)
            
            print(f"✅ Task {task['id']} completed successfully!")
            
            # Wait before processing next task
            await asyncio.sleep(2)
    
    def start(self):
        """Start the agent orchestrator"""
        self.running = True
        print("🚀 Agent Orchestrator started!")
        
        # Add some sample tasks for demonstration
        sample_tasks = [
            {
                "description": "Create a new React component for user profile display",
                "priority": "medium",
                "type": "frontend"
            },
            {
                "description": "Implement responsive navigation bar with Tailwind CSS",
                "priority": "high", 
                "type": "frontend"
            },
            {
                "description": "Add form validation to the contact form component",
                "priority": "low",
                "type": "frontend"
            }
        ]
        
        for task in sample_tasks:
            self.add_task(task)
    
    def stop(self):
        """Stop the agent orchestrator"""
        self.running = False
        print("🛑 Agent Orchestrator stopped!")
    
    def get_status(self) -> Dict[str, Any]:
        """Get current status of all agents and tasks"""
        return {
            "agents": {name: {"status": agent.status, "capabilities": agent.get_capabilities()} 
                     for name, agent in self.agents.items()},
            "pending_tasks": len(self.task_queue),
            "completed_tasks": len(self.completed_tasks),
            "running": self.running
        }


async def main():
    """Main entry point for the agent system"""
    orchestrator = AgentOrchestrator()
    
    try:
        orchestrator.start()
        
        # Run the task processing loop
        await orchestrator.process_task_queue()
        
        # Keep running and waiting for new tasks
        while orchestrator.running:
            print("⏳ Waiting for new tasks...")
            await asyncio.sleep(10)
            
            # In a real implementation, this would listen for tasks from the backend
            # For now, we'll just process what we have and then wait
            
    except KeyboardInterrupt:
        print("\n🔄 Shutting down gracefully...")
        orchestrator.stop()
    
    print("👋 Agent system shutdown complete!")


if __name__ == "__main__":
    print("🌟 DevTeam AI - Agent System Starting...")
    asyncio.run(main())