"""
Frontend Coder Agent - Specializes in React, JavaScript, and CSS development
"""

import json
import requests
from typing import Dict, Any
import os


class FrontendCoder:
    def __init__(self, name: str = "frontend_coder"):
        self.name = name
        self.status = "idle"
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:4000")
    
    def process_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Process a frontend development task"""
        
        print(f"[{self.name}] Processing task: {task.get('description', 'No description')}")
        
        # Simulate frontend coding work
        self.status = "working"
        
        # Mock frontend development steps
        steps = [
            "Analyzing UI requirements",
            "Creating React components",
            "Setting up state management",
            "Implementing responsive design",
            "Adding Tailwind CSS styles",
            "Testing component functionality"
        ]
        
        results = []
        for step in steps:
            print(f"[{self.name}] {step}...")
            results.append(f"✅ {step}")
        
        # Generate mock code output
        code_output = {
            "files_created": [
                "src/components/NewFeature.jsx",
                "src/styles/feature.css"
            ],
            "code_samples": {
                "NewFeature.jsx": """
import React, { useState } from 'react';

function NewFeature() {
    const [state, setState] = useState('');
    
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold">New Feature</h2>
            <p>Feature implementation complete!</p>
        </div>
    );
}

export default NewFeature;
                """.strip()
            }
        }
        
        self.status = "idle"
        
        return {
            "agent": self.name,
            "task_id": task.get("id"),
            "status": "completed",
            "results": results,
            "code_output": code_output,
            "message": f"Frontend development task completed successfully!"
        }
    
    def get_capabilities(self) -> list:
        """Return list of capabilities"""
        return [
            "React component development",
            "JavaScript/TypeScript coding",
            "CSS/Tailwind styling",
            "Responsive design",
            "State management",
            "API integration",
            "UI/UX implementation"
        ]
    
    def send_message_to_backend(self, message: str):
        """Send a message to the backend chat system"""
        try:
            response = requests.post(
                f"{self.backend_url}/api/messages",
                json={
                    "message": {
                        "content": message,
                        "sender": self.name,
                        "timestamp": "now"
                    }
                }
            )
            return response.status_code == 200
        except Exception as e:
            print(f"Error sending message to backend: {e}")
            return False