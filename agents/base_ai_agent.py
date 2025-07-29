"""
Base AI Agent - Provides common AI integration functionality
"""

import os
import json
import time
from typing import Dict, Any, List, Optional
from abc import ABC, abstractmethod
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class BaseAIAgent(ABC):
    def __init__(self, name: str, ai_provider: str = "openai"):
        self.name = name
        self.ai_provider = ai_provider.lower()
        self.status = "idle"
        self.current_task = None
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:4000")
        
        # Initialize AI client based on provider
        self._init_ai_client()
        
        # Output directory for generated code
        self.output_dir = os.path.join(os.getcwd(), "generated_code")
        os.makedirs(self.output_dir, exist_ok=True)
    
    def _init_ai_client(self):
        """Initialize AI client based on provider"""
        if self.ai_provider == "openai":
            try:
                import openai
                self.ai_client = openai.OpenAI(
                    api_key=os.getenv("OPENAI_API_KEY")
                )
                self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
            except Exception as e:
                print(f"Warning: OpenAI client not available: {e}")
                self.ai_client = None
                
        elif self.ai_provider == "anthropic":
            try:
                import anthropic
                self.ai_client = anthropic.Anthropic(
                    api_key=os.getenv("ANTHROPIC_API_KEY")
                )
                self.model = os.getenv("ANTHROPIC_MODEL", "claude-3-haiku-20240307")
            except Exception as e:
                print(f"Warning: Anthropic client not available: {e}")
                self.ai_client = None
        else:
            print(f"Warning: Unknown AI provider: {self.ai_provider}")
            self.ai_client = None
    
    def call_ai(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Make an AI API call and return the response"""
        if not self.ai_client:
            return "AI client not available. Please check your API keys and dependencies."
        
        try:
            if self.ai_provider == "openai":
                messages = []
                if system_prompt:
                    messages.append({"role": "system", "content": system_prompt})
                messages.append({"role": "user", "content": prompt})
                
                response = self.ai_client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    max_tokens=4000,
                    temperature=0.7
                )
                return response.choices[0].message.content
                
            elif self.ai_provider == "anthropic":
                response = self.ai_client.messages.create(
                    model=self.model,
                    max_tokens=4000,
                    temperature=0.7,
                    system=system_prompt or "",
                    messages=[{"role": "user", "content": prompt}]
                )
                return response.content[0].text
                
        except Exception as e:
            error_msg = f"AI API call failed: {str(e)}"
            print(f"[{self.name}] {error_msg}")
            return f"Error: {error_msg}"
        
        return "No AI response available"
    
    def write_file(self, filename: str, content: str, subfolder: str = "") -> str:
        """Write generated code to a file"""
        try:
            # Create subfolder if specified
            if subfolder:
                full_dir = os.path.join(self.output_dir, subfolder)
                os.makedirs(full_dir, exist_ok=True)
                filepath = os.path.join(full_dir, filename)
            else:
                filepath = os.path.join(self.output_dir, filename)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"[{self.name}] ✅ Created file: {filepath}")
            return filepath
            
        except Exception as e:
            error_msg = f"Failed to write file {filename}: {str(e)}"
            print(f"[{self.name}] ❌ {error_msg}")
            return error_msg
    
    def read_file(self, filepath: str) -> str:
        """Read an existing file for context"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            return f"Error reading file {filepath}: {str(e)}"
    
    def update_backend_status(self, status: str, message: str = ""):
        """Update agent status in backend"""
        try:
            payload = {
                "agent_id": self.name,
                "status": status,
                "task_id": self.current_task,
                "message": message
            }
            
            response = requests.post(
                f"{self.backend_url}/api/agent_status",
                json=payload,
                timeout=5
            )
            
            if response.status_code == 200:
                print(f"[{self.name}] 📡 Status updated: {status}")
            else:
                print(f"[{self.name}] ⚠️ Failed to update status: {response.status_code}")
                
        except Exception as e:
            print(f"[{self.name}] ⚠️ Backend communication error: {e}")
    
    def send_progress_update(self, message: str):
        """Send progress update to backend chat"""
        try:
            payload = {
                "message": {
                    "content": f"🤖 {self.name}: {message}",
                    "sender": self.name,
                    "timestamp": time.time()
                }
            }
            
            requests.post(
                f"{self.backend_url}/api/messages",
                json=payload,
                timeout=5
            )
            
        except Exception as e:
            print(f"[{self.name}] ⚠️ Failed to send progress update: {e}")
    
    @abstractmethod
    def get_capabilities(self) -> List[str]:
        """Return list of agent capabilities"""
        pass
    
    @abstractmethod
    def process_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Process a task and return results"""
        pass
    
    @abstractmethod
    def get_system_prompt(self) -> str:
        """Get the system prompt for this agent type"""
        pass