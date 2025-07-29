"""
AI Agent Orchestration Runner - Real AI-powered coding task processing
"""

import os
import time
import asyncio
from typing import List, Dict, Any
from frontend_coder import FrontendCoder


class AIAgentOrchestrator:
    def __init__(self):
        # Initialize AI-powered agents
        ai_provider = os.getenv("AI_PROVIDER", "openai")
        print(f"🤖 Initializing agents with {ai_provider.upper()} AI...")
        
        self.agents = {
            "frontend_coder": FrontendCoder("frontend_coder", ai_provider),
        }
        
        self.task_queue = []
        self.completed_tasks = []
        self.running = False
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:4000")
        
        # Check AI configuration
        self._check_ai_config()
    
    def _check_ai_config(self):
        """Check if AI APIs are properly configured"""
        ai_provider = os.getenv("AI_PROVIDER", "openai")
        
        if ai_provider == "openai":
            if not os.getenv("OPENAI_API_KEY"):
                print("⚠️  WARNING: OPENAI_API_KEY not found. Agents will run in fallback mode.")
                print("   Set OPENAI_API_KEY environment variable to enable AI features.")
            else:
                print("✅ OpenAI API key configured")
                
        elif ai_provider == "anthropic":
            if not os.getenv("ANTHROPIC_API_KEY"):
                print("⚠️  WARNING: ANTHROPIC_API_KEY not found. Agents will run in fallback mode.")
                print("   Set ANTHROPIC_API_KEY environment variable to enable AI features.")
            else:
                print("✅ Anthropic API key configured")
    
    def add_task(self, task: Dict[str, Any]):
        """Add a new task to the queue"""
        task_id = f"task_{int(time.time())}"
        task["id"] = task_id
        task["status"] = "pending"
        task["created_at"] = time.time()
        
        self.task_queue.append(task)
        print(f"📋 Task queued: {task_id} - {task['description'][:60]}...")
    
    def assign_task_to_agent(self, task: Dict[str, Any]) -> str:
        """Assign task to the most suitable agent based on content analysis"""
        description = task.get("description", "").lower()
        
        # Enhanced assignment logic
        frontend_keywords = [
            "react", "component", "ui", "frontend", "css", "tailwind", "javascript", 
            "typescript", "jsx", "tsx", "styling", "responsive", "form", "button",
            "modal", "navigation", "layout", "design", "interface", "webpage"
        ]
        
        if any(keyword in description for keyword in frontend_keywords):
            return "frontend_coder"
        
        # Default to frontend coder for now (can add more agents later)
        return "frontend_coder"
    
    async def process_task_queue(self):
        """Process tasks in the queue using AI agents"""
        while self.running:
            if self.task_queue:
                task = self.task_queue.pop(0)
                task["status"] = "in_progress"
                
                # Assign to appropriate agent
                agent_name = self.assign_task_to_agent(task)
                agent = self.agents[agent_name]
                
                print(f"\n🎯 Assigning task {task['id']} to {agent_name}")
                print(f"   Task: {task['description']}")
                
                try:
                    # Process the task with AI
                    result = agent.process_task(task)
                    
                    # Mark as completed
                    task["status"] = result.get("status", "completed")
                    task["result"] = result
                    task["completed_at"] = time.time()
                    
                    self.completed_tasks.append(task)
                    
                    if result.get("status") == "completed":
                        files_created = result.get("files_created", [])
                        print(f"✅ Task {task['id']} completed! Generated {len(files_created)} files.")
                        if files_created:
                            print("   Files created:")
                            for file_path in files_created:
                                print(f"   - {file_path}")
                    else:
                        print(f"❌ Task {task['id']} failed: {result.get('error', 'Unknown error')}")
                        
                except Exception as e:
                    print(f"❌ Error processing task {task['id']}: {str(e)}")
                    task["status"] = "failed"
                    task["error"] = str(e)
                    task["completed_at"] = time.time()
                    self.completed_tasks.append(task)
            
            # Wait before checking for more tasks
            await asyncio.sleep(2)
    
    async def listen_for_backend_tasks(self):
        """Listen for new tasks from the backend via WebSocket"""
        import websockets
        import json
        
        websocket_url = self.backend_url.replace("http://", "ws://") + "/socket/websocket"
        
        while self.running:
            try:
                print(f"🔌 Connecting to backend WebSocket: {websocket_url}")
                
                async with websockets.connect(websocket_url) as websocket:
                    # Join the tasks channel
                    join_message = {
                        "topic": "tasks:lobby",
                        "event": "phx_join",
                        "payload": {},
                        "ref": "1"
                    }
                    await websocket.send(json.dumps(join_message))
                    
                    print("✅ Connected to backend, listening for tasks...")
                    
                    async for message in websocket:
                        try:
                            data = json.loads(message)
                            
                            if data.get("event") == "task_created":
                                payload = data.get("payload", {})
                                task = {
                                    "id": payload.get("id"),
                                    "description": payload.get("description"),
                                    "status": payload.get("status", "pending")
                                }
                                
                                print(f"📨 Received new task from backend: {task['id']}")
                                self.add_task(task)
                                
                        except json.JSONDecodeError:
                            continue
                        except Exception as e:
                            print(f"⚠️ Error processing WebSocket message: {e}")
                            
            except Exception as e:
                print(f"⚠️ WebSocket connection error: {e}")
                print("🔄 Retrying connection in 10 seconds...")
                await asyncio.sleep(10)
    
    def start(self):
        """Start the AI agent orchestrator"""
        self.running = True
        print("🚀 AI Agent Orchestrator started!")
        print("   Available agents:")
        for name, agent in self.agents.items():
            capabilities = agent.get_capabilities()
            print(f"   - {name}: {len(capabilities)} capabilities")
        print()
        
        # Add some sample tasks for demonstration
        if os.getenv("DEMO_MODE", "true").lower() == "true":
            sample_tasks = [
                {
                    "description": "Create a responsive user profile card component with avatar, name, bio, and contact information",
                    "priority": "medium",
                    "type": "frontend"
                },
                {
                    "description": "Build a modal dialog component with backdrop, close button, and proper accessibility features",
                    "priority": "high", 
                    "type": "frontend"
                },
                {
                    "description": "Implement a search input component with debounced filtering and results highlighting",
                    "priority": "low",
                    "type": "frontend"
                }
            ]
            
            print("📋 Adding demo tasks...")
            for task in sample_tasks:
                self.add_task(task)
            print()
    
    def stop(self):
        """Stop the agent orchestrator"""
        self.running = False
        print("🛑 AI Agent Orchestrator stopped!")
    
    def get_status(self) -> Dict[str, Any]:
        """Get current status of all agents and tasks"""
        return {
            "agents": {
                name: {
                    "status": agent.status, 
                    "capabilities": agent.get_capabilities(),
                    "current_task": agent.current_task
                } 
                for name, agent in self.agents.items()
            },
            "pending_tasks": len(self.task_queue),
            "completed_tasks": len(self.completed_tasks),
            "running": self.running
        }


async def main():
    """Main entry point for the AI agent system"""
    print("🌟 DevTeam AI - AI Agent System Starting...")
    print("=" * 50)
    
    orchestrator = AIAgentOrchestrator()
    
    try:
        orchestrator.start()
        
        # Run both task processing and backend listening concurrently
        await asyncio.gather(
            orchestrator.process_task_queue(),
            orchestrator.listen_for_backend_tasks()
        )
            
    except KeyboardInterrupt:
        print("\n🔄 Shutting down gracefully...")
        orchestrator.stop()
    except Exception as e:
        print(f"❌ Agent system error: {e}")
        orchestrator.stop()
    
    print("👋 AI Agent system shutdown complete!")


if __name__ == "__main__":
    asyncio.run(main())