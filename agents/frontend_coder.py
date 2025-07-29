"""
Frontend Coder Agent - AI-powered React, JavaScript, and CSS development
"""

import os
import time
from typing import Dict, Any, List
from base_ai_agent import BaseAIAgent


class FrontendCoder(BaseAIAgent):
    def __init__(self, name: str = "frontend_coder", ai_provider: str = "openai"):
        super().__init__(name, ai_provider)
        
    def get_system_prompt(self) -> str:
        """Get the system prompt for frontend development"""
        return """You are an expert frontend developer specializing in React, JavaScript, TypeScript, and modern web development.

Your expertise includes:
- React functional components with hooks
- Modern JavaScript/TypeScript patterns
- Responsive CSS with Tailwind or styled components
- State management (useState, useContext, Redux)
- API integration and data fetching
- Accessibility best practices
- Performance optimization
- Testing with Jest/React Testing Library

When given a task:
1. Analyze the requirements carefully
2. Write clean, modern, well-structured code
3. Follow React best practices and conventions
4. Include proper TypeScript types when applicable
5. Add meaningful comments for complex logic
6. Ensure code is production-ready and maintainable

Always provide complete, working code that can be directly used in a project."""

    def get_capabilities(self) -> List[str]:
        """Return list of agent capabilities"""
        return [
            "React component development",
            "JavaScript/TypeScript coding", 
            "CSS/Tailwind styling",
            "Responsive design",
            "State management (hooks, context)",
            "API integration and data fetching",
            "Form handling and validation",
            "UI/UX implementation",
            "Accessibility (ARIA, semantic HTML)",
            "Performance optimization",
            "Testing implementation"
        ]
    
    def process_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Process a frontend development task using AI"""
        
        task_description = task.get('description', 'No description provided')
        task_id = task.get('id', 'unknown')
        
        print(f"[{self.name}] 🚀 Starting AI-powered task: {task_description}")
        
        # Update status and notify backend
        self.status = "working"
        self.current_task = task_id
        self.update_backend_status("working", f"Processing: {task_description[:50]}...")
        self.send_progress_update("Analyzing requirements and generating code...")
        
        try:
            # Create the AI prompt for code generation
            prompt = self._create_code_generation_prompt(task_description)
            
            # Send progress update
            self.send_progress_update("Calling AI to generate code...")
            
            # Call AI to generate code
            ai_response = self.call_ai(prompt, self.get_system_prompt())
            
            if ai_response.startswith("Error:") or ai_response.startswith("AI client not available"):
                return self._handle_error(task, ai_response)
            
            # Parse the AI response and extract code
            self.send_progress_update("Processing AI response and extracting code...")
            code_artifacts = self._parse_ai_response(ai_response, task_description)
            
            # Write generated files
            self.send_progress_update("Writing generated code to files...")
            created_files = self._write_code_files(code_artifacts, task_id)
            
            # Complete the task
            self.status = "idle"
            self.current_task = None
            self.update_backend_status("idle", "Task completed successfully!")
            self.send_progress_update(f"✅ Generated {len(created_files)} files successfully!")
            
            return {
                "agent": self.name,
                "task_id": task_id,
                "status": "completed",
                "ai_response": ai_response,
                "files_created": created_files,
                "code_artifacts": code_artifacts,
                "message": f"Frontend task completed! Generated {len(created_files)} files."
            }
            
        except Exception as e:
            error_msg = f"Task processing failed: {str(e)}"
            print(f"[{self.name}] ❌ {error_msg}")
            
            self.status = "idle"
            self.current_task = None
            self.update_backend_status("idle", f"Task failed: {error_msg}")
            self.send_progress_update(f"❌ Task failed: {error_msg}")
            
            return self._handle_error(task, error_msg)
    
    def _create_code_generation_prompt(self, task_description: str) -> str:
        """Create a detailed prompt for AI code generation"""
        return f"""
Task: {task_description}

Please generate complete, production-ready frontend code for this task. 

Requirements:
- Use modern React with functional components and hooks
- Include TypeScript types where beneficial
- Use Tailwind CSS for styling (or provide CSS if needed)
- Follow accessibility best practices
- Include proper error handling
- Write clean, well-commented code

Please structure your response as follows:

## Analysis
[Brief analysis of the requirements]

## Implementation Plan
[Step-by-step approach]

## Code

### FileName.jsx (or .tsx)
```jsx
[Complete component code here]
```

### styles.css (if needed)
```css
[CSS code here]
```

### Additional files (if needed)
```javascript
[Any additional code files]
```

## Usage Instructions
[How to integrate/use the generated code]

## Notes
[Any important implementation notes or considerations]
"""
    
    def _parse_ai_response(self, ai_response: str, task_description: str) -> Dict[str, Any]:
        """Parse AI response and extract code artifacts"""
        artifacts = {
            "analysis": "",
            "implementation_plan": "",
            "code_files": {},
            "usage_instructions": "",
            "notes": ""
        }
        
        # Simple parsing - look for code blocks
        lines = ai_response.split('\n')
        current_section = None
        current_filename = None
        current_code = []
        
        for line in lines:
            if line.startswith('## Analysis'):
                current_section = 'analysis'
            elif line.startswith('## Implementation Plan'):
                current_section = 'implementation_plan'
            elif line.startswith('## Code'):
                current_section = 'code'
            elif line.startswith('## Usage Instructions'):
                current_section = 'usage_instructions'
            elif line.startswith('## Notes'):
                current_section = 'notes'
            elif line.startswith('### ') and current_section == 'code':
                # Save previous file if exists
                if current_filename and current_code:
                    artifacts["code_files"][current_filename] = '\n'.join(current_code)
                
                # Start new file
                current_filename = line.replace('### ', '').strip()
                current_code = []
            elif line.startswith('```') and current_section == 'code':
                if current_code and line.strip() != '```':
                    # End of code block
                    if current_filename:
                        artifacts["code_files"][current_filename] = '\n'.join(current_code)
                        current_filename = None
                        current_code = []
                # Skip the ``` lines
                continue
            elif current_section == 'code' and current_filename:
                current_code.append(line)
            elif current_section and current_section != 'code':
                if current_section not in artifacts:
                    artifacts[current_section] = ""
                artifacts[current_section] += line + '\n'
        
        # Save last file if exists
        if current_filename and current_code:
            artifacts["code_files"][current_filename] = '\n'.join(current_code)
        
        # If no code files found, try to extract any code blocks
        if not artifacts["code_files"]:
            import re
            code_blocks = re.findall(r'```(?:jsx?|tsx?|css|javascript|typescript)?\n(.*?)\n```', ai_response, re.DOTALL)
            if code_blocks:
                for i, code in enumerate(code_blocks):
                    filename = f"generated_component_{i+1}.jsx"
                    artifacts["code_files"][filename] = code.strip()
        
        return artifacts
    
    def _write_code_files(self, artifacts: Dict[str, Any], task_id: str) -> List[str]:
        """Write generated code files to disk"""
        created_files = []
        subfolder = f"task_{task_id}"
        
        for filename, content in artifacts.get("code_files", {}).items():
            if content.strip():  # Only write non-empty files
                filepath = self.write_file(filename, content, subfolder)
                if not filepath.startswith("Error:"):
                    created_files.append(filepath)
        
        # Also write a summary file
        if artifacts.get("analysis") or artifacts.get("usage_instructions"):
            summary_content = f"""# Task Summary

## Task Description
{artifacts.get('task_description', 'N/A')}

## Analysis
{artifacts.get('analysis', 'N/A')}

## Implementation Plan  
{artifacts.get('implementation_plan', 'N/A')}

## Generated Files
{', '.join(artifacts.get('code_files', {}).keys())}

## Usage Instructions
{artifacts.get('usage_instructions', 'N/A')}

## Notes
{artifacts.get('notes', 'N/A')}
"""
            summary_path = self.write_file("README.md", summary_content, subfolder)
            if not summary_path.startswith("Error:"):
                created_files.append(summary_path)
        
        return created_files
    
    def _handle_error(self, task: Dict[str, Any], error_msg: str) -> Dict[str, Any]:
        """Handle task processing errors"""
        return {
            "agent": self.name,
            "task_id": task.get("id", "unknown"),
            "status": "failed", 
            "error": error_msg,
            "message": f"Task failed: {error_msg}"
        }