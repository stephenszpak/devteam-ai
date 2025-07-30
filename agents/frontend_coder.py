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
        
        # Handle both dict and string inputs (defensive programming)
        if isinstance(task, str):
            # If task is passed as a string, create a proper task dict
            task_description = task
            task_id = f"task_{int(time.time())}"
            task = {
                "id": task_id,
                "description": task_description,
                "status": "pending",
                "created_at": time.time()
            }
        elif isinstance(task, dict):
            task_description = task.get('description', 'No description provided')
            task_id = task.get('id', f"task_{int(time.time())}")
        else:
            raise ValueError(f"Invalid task format: expected dict or str, got {type(task)}")
        
        print(f"[{self.name}] 🚀 Starting AI-powered task: {task_description}")
        
        # Update status and notify backend with enhanced progress tracking
        self.status = "working"
        self.current_task = task_id
        start_time = time.time()
        
        self.update_backend_status("working", f"Processing: {task_description[:50]}...", progress=0)
        self.update_task_progress(task_id, 0, "initialization", "Setting up task processing")
        self.send_progress_update("Analyzing requirements and generating code...")
        
        try:
            # Stage 1: Create the AI prompt for code generation (10% progress)
            self.update_task_progress(task_id, 10, "prompt_creation", "Creating AI prompt with project context")
            prompt = self._create_code_generation_prompt(task_description)
            
            # Stage 2: Call AI to generate code (30% progress)
            self.update_task_progress(task_id, 30, "ai_generation", "Calling AI to generate code")
            self.send_progress_update("Calling AI to generate code...")
            
            # Call AI to generate code with project context awareness
            ai_response = self.call_ai_with_context(task_description, self.get_system_prompt())
            
            if ai_response.startswith("Error:") or ai_response.startswith("AI client not available"):
                return self._handle_error(task, ai_response)
            
            # Stage 3: Parse the AI response and extract code (50% progress)
            self.update_task_progress(task_id, 50, "response_parsing", "Processing AI response and extracting code")
            self.send_progress_update("Processing AI response and extracting code...")
            code_artifacts = self._parse_ai_response(ai_response, task_description)
            
            # Stage 4: Write generated files (70% progress)
            self.update_task_progress(task_id, 70, "file_generation", f"Writing {len(code_artifacts)} code files")
            self.send_progress_update("Writing generated code to files...")
            created_files = self._write_code_files(code_artifacts, task_id)
            
            # Notify backend about each file created
            for file_path in created_files:
                file_type = self._determine_file_type(file_path)
                description = self._get_file_description(file_path, code_artifacts)
                self.notify_file_created(task_id, file_path, file_type, description)
            
            # Stage 5: Complete the task (100% progress)
            processing_time = time.time() - start_time
            self.update_task_progress(task_id, 100, "completion", "Task completed successfully")
            
            # Report comprehensive task completion
            completion_result = {
                "agent": self.name,
                "task_id": task_id,
                "status": "completed",
                "ai_response": ai_response[:500] + "..." if len(ai_response) > 500 else ai_response,
                "code_artifacts": len(code_artifacts),
                "message": f"Frontend task completed! Generated {len(created_files)} files.",
                "processing_time": processing_time
            }
            
            self.report_task_completion(task_id, completion_result, created_files)
            
            # Update local status
            self.status = "idle"
            self.current_task = None
            self.update_backend_status("idle", "Task completed successfully!", progress=100)
            self.send_progress_update(f"✅ Generated {len(created_files)} files successfully!")
            
            return completion_result
            
        except Exception as e:
            error_msg = f"Task processing failed: {str(e)}"
            print(f"[{self.name}] ❌ {error_msg}")
            
            # Report detailed error to backend
            self.report_task_error(task_id, error_msg, "processing_error", {
                "stage": "task_execution",
                "task_description": task_description,
                "processing_time": time.time() - start_time if 'start_time' in locals() else 0
            })
            
            self.status = "idle"
            self.current_task = None
            self.update_backend_status("idle", f"Task failed: {error_msg}")
            
            return {
                "agent": self.name,
                "task_id": task_id,
                "status": "failed",
                "error": error_msg,
                "message": f"Frontend task failed: {error_msg}"
            }
    
    def _determine_file_type(self, file_path: str) -> str:
        """Determine file type based on extension"""
        if file_path.endswith('.tsx'):
            return 'typescript_react'
        elif file_path.endswith('.jsx'):
            return 'javascript_react'
        elif file_path.endswith('.ts'):
            return 'typescript'
        elif file_path.endswith('.js'):
            return 'javascript'
        elif file_path.endswith('.css'):
            return 'stylesheet'
        elif file_path.endswith('.scss'):
            return 'sass_stylesheet'
        elif file_path.endswith('.md'):
            return 'documentation'
        else:
            return 'unknown'
    
    def _get_file_description(self, file_path: str, code_artifacts: Dict[str, Any]) -> str:
        """Generate description for a created file"""
        filename = os.path.basename(file_path)
        
        # Handle dict structure from _parse_ai_response
        if isinstance(code_artifacts, dict):
            # Check if this filename exists in the code_files dict
            code_files = code_artifacts.get("code_files", {})
            if filename in code_files:
                return f"Generated component: {filename}"
        
        # Fallback description based on file type
        if filename.endswith('.tsx') or filename.endswith('.jsx'):
            return f"React component: {filename}"
        elif filename.endswith('.css') or filename.endswith('.scss'):
            return f"Stylesheet: {filename}"
        elif filename.endswith('.md'):
            return f"Documentation: {filename}"
        else:
            return f"Generated file: {filename}"
    
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
        try:
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
            
        except Exception as e:
            print(f"[{self.name}] ⚠️ Error parsing AI response: {e}")
            # Return fallback artifacts structure
            return {
                "analysis": "Error occurred during parsing",
                "implementation_plan": "Fallback implementation",
                "code_files": {"error_component.jsx": "// Error occurred during parsing"},
                "usage_instructions": "Check logs for parsing errors",
                "notes": f"Parsing error: {str(e)}"
            }
    
    def _write_code_files(self, artifacts: Dict[str, Any], task_id: str) -> List[str]:
        """Write generated code files to disk"""
        created_files = []
        subfolder = f"task_{task_id}"
        
        # Defensive programming: handle case where artifacts is not a dict
        if not isinstance(artifacts, dict):
            print(f"[{self.name}] ⚠️ Warning: artifacts is not a dict, got {type(artifacts)}")
            # Create fallback artifacts structure
            artifacts = {
                "code_files": {},
                "analysis": str(artifacts) if artifacts else "No analysis available",
                "implementation_plan": "Basic implementation",
                "usage_instructions": "Component usage instructions",
                "notes": "Generated with fallback parsing"
            }
        
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
        # Handle both dict and string inputs
        if isinstance(task, str):
            task_id = f"task_{int(time.time())}"
        elif isinstance(task, dict):
            task_id = task.get("id", "unknown")
        else:
            task_id = "unknown"
            
        return {
            "agent": self.name,
            "task_id": task_id,
            "status": "failed", 
            "error": error_msg,
            "message": f"Task failed: {error_msg}"
        }