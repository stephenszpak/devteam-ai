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
from project_context import ProjectContext

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
        
        # Project context for AI awareness
        self.project_context = ProjectContext()
    
    def _init_ai_client(self):
        """Initialize AI client based on provider"""
        if self.ai_provider == "openai":
            try:
                import openai
                api_key = os.getenv("OPENAI_API_KEY")
                if api_key and not api_key.startswith('sk-placeholder'):
                    # Simple client creation without extra arguments
                    self.ai_client = openai.OpenAI(api_key=api_key)
                else:
                    self.ai_client = None
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
    
    def call_ai_with_context(self, task_description: str, system_prompt: Optional[str] = None) -> str:
        """Make an AI API call with project context awareness"""
        context_prompt = self.project_context.create_context_prompt(task_description)
        return self.call_ai(context_prompt, system_prompt)
    
    def call_ai(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Make an AI API call and return the response"""
        if not self.ai_client:
            print(f"[{self.name}] ⚠️ AI client not available, using fallback template system")
            return self._generate_fallback_response(prompt)
        
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
    
    def _generate_fallback_response(self, prompt: str) -> str:
        """Generate a fallback response when AI client is not available"""
        # Extract task type from prompt
        prompt_lower = prompt.lower()
        
        if any(word in prompt_lower for word in ['button', 'component', 'react']):
            return self._get_button_component_template()
        elif any(word in prompt_lower for word in ['form', 'login', 'input']):
            return self._get_form_component_template()
        elif any(word in prompt_lower for word in ['card', 'profile', 'dashboard']):
            return self._get_card_component_template()
        else:
            # Generic component template
            return self._get_generic_component_template()
    
    def _get_button_component_template(self) -> str:
        """Template for button components"""
        return """
## Analysis
Creating a reusable button component with multiple variants and accessibility features.

## Implementation Plan
1. Create Button component with variant support
2. Add Tailwind CSS styling
3. Include accessibility attributes
4. Add TypeScript-ready props

## Code

### Button.jsx
```jsx
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  }`;
  
  return (
    <button
      className={classes}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

### Button.stories.js
```javascript
import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

export const Primary = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Outline = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

export const Danger = {
  args: {
    children: 'Delete',
    variant: 'danger',
  },
};
```

## Usage
```jsx
import Button from './Button';

function App() {
  return (
    <div className="space-x-4">
      <Button onClick={() => alert('Clicked!')}>
        Click me
      </Button>
      <Button variant="secondary" size="large">
        Large Secondary
      </Button>
      <Button variant="outline" disabled>
        Disabled
      </Button>
    </div>
  );
}
```
"""
    
    def _get_form_component_template(self) -> str:
        """Template for form components"""
        return """
## Analysis
Creating a modern form component with validation, accessibility, and responsive design.

## Implementation Plan
1. Create form with input fields
2. Add validation states
3. Include accessibility features
4. Style with Tailwind CSS

## Code

### LoginForm.jsx
```jsx
import React, { useState } from 'react';

const LoginForm = ({ onSubmit, className = '' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your email"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your password"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      <div className="flex items-center">
        <input
          id="rememberMe"
          name="rememberMe"
          type="checkbox"
          checked={formData.rememberMe}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
          Remember me
        </label>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
          isSubmitting 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        }`}
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
};

export default LoginForm;
```
"""
    
    def _get_card_component_template(self) -> str:
        """Template for card components"""
        return """
## Analysis
Creating a flexible card component suitable for profiles, dashboards, and content display.

## Implementation Plan
1. Create base card structure
2. Add flexible content areas
3. Include image support
4. Style with Tailwind CSS

## Code

### Card.jsx
```jsx
import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'medium',
  shadow = 'medium',
  rounded = 'medium',
  ...props 
}) => {
  const paddingClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };
  
  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg'
  };
  
  const roundedClasses = {
    none: '',
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl'
  };

  const classes = `bg-white ${paddingClasses[padding]} ${shadowClasses[shadow]} ${roundedClasses[rounded]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`text-gray-600 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
```

### ProfileCard.jsx
```jsx
import React from 'react';
import Card from './Card';

const ProfileCard = ({ 
  user, 
  showActions = true,
  className = '' 
}) => {
  return (
    <Card className={`max-w-sm ${className}`}>
      <Card.Header className="text-center">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt={`${user.name}'s avatar`}
          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
        />
        <Card.Title>{user.name}</Card.Title>
        <p className="text-gray-500">{user.title}</p>
      </Card.Header>
      
      <Card.Content>
        <p className="text-sm text-center">{user.bio}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-20">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-20">Location:</span>
            <span>{user.location}</span>
          </div>
        </div>
      </Card.Content>
      
      {showActions && (
        <Card.Footer>
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Message
            </button>
            <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Follow
            </button>
          </div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default ProfileCard;
```
"""
    
    def _get_generic_component_template(self) -> str:
        """Generic component template"""
        return """
## Analysis
Creating a flexible, reusable React component with modern patterns and accessibility.

## Implementation Plan
1. Create component structure
2. Add prop handling
3. Include styling with Tailwind
4. Add accessibility features

## Code

### Component.jsx
```jsx
import React from 'react';

const Component = ({ 
  children, 
  className = '',
  variant = 'default',
  ...props 
}) => {
  const baseClasses = 'transition-colors duration-200';
  
  const variants = {
    default: 'bg-white border border-gray-200',
    primary: 'bg-blue-50 border border-blue-200',
    secondary: 'bg-gray-50 border border-gray-200'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Component;
```

## Usage
```jsx
import Component from './Component';

function App() {
  return (
    <Component variant="primary" className="p-4 rounded-lg">
      <h2>Component Content</h2>
      <p>This is a flexible component that can be customized.</p>
    </Component>
  );
}
```
"""
    
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
    
    def update_backend_status(self, status: str, message: str = "", progress: int = None, metadata: Dict[str, Any] = None):
        """Update agent status in backend with enhanced information"""
        try:
            payload = {
                "agent_id": self.name,
                "status": status,
                "task_id": self.current_task,
                "message": message,
                "timestamp": time.time(),
                "progress_percentage": progress,
                "metadata": metadata or {}
            }
            
            response = requests.post(
                f"{self.backend_url}/api/agent_status",
                json=payload,
                timeout=5
            )
            
            if response.status_code == 200:
                progress_info = f" ({progress}%)" if progress is not None else ""
                print(f"[{self.name}] 📡 Status updated: {status}{progress_info}")
            else:
                print(f"[{self.name}] ⚠️ Failed to update status: {response.status_code}")
                
        except Exception as e:
            print(f"[{self.name}] ⚠️ Backend communication error: {e}")
    
    def update_task_progress(self, task_id: str, progress: int, stage: str, details: str = ""):
        """Send detailed task progress update"""
        try:
            payload = {
                "task_id": task_id,
                "agent_id": self.name,
                "progress_percentage": progress,
                "current_stage": stage,
                "stage_details": details,
                "timestamp": time.time()
            }
            
            response = requests.post(
                f"{self.backend_url}/api/tasks/{task_id}/progress",
                json=payload,
                timeout=5
            )
            
            if response.status_code == 200:
                print(f"[{self.name}] 📈 Progress updated: {progress}% - {stage}")
            else:
                print(f"[{self.name}] ⚠️ Failed to update progress: {response.status_code}")
                
        except Exception as e:
            print(f"[{self.name}] ⚠️ Progress update error: {e}")
    
    def notify_file_created(self, task_id: str, file_path: str, file_type: str, description: str = ""):
        """Notify backend when a file is created"""
        try:
            # Read file content to send to backend
            content = ""
            try:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
            except Exception as read_error:
                print(f"[{self.name}] ⚠️ Could not read file {file_path}: {read_error}")
                content = "// Could not read file content"
            
            payload = {
                "task_id": task_id,
                "agent_id": self.name,
                "file_path": file_path,
                "file_type": file_type,
                "description": description,
                "content": content,
                "timestamp": time.time()
            }
            
            response = requests.post(
                f"{self.backend_url}/api/tasks/{task_id}/files",
                json=payload,
                timeout=5
            )
            
            if response.status_code == 200:
                print(f"[{self.name}] 📄 File created: {file_path}")
            else:
                print(f"[{self.name}] ⚠️ Failed to notify file creation: {response.status_code}")
                
        except Exception as e:
            print(f"[{self.name}] ⚠️ File notification error: {e}")
    
    def report_task_completion(self, task_id: str, result: Dict[str, Any], files_created: List[str]):
        """Send comprehensive task completion report"""
        try:
            payload = {
                "task_id": task_id,
                "agent_id": self.name,
                "status": "completed",
                "result": result,
                "files_created": files_created,
                "completion_time": time.time(),
                "metadata": {
                    "processing_time": result.get("processing_time", 0),
                    "ai_model_used": self.model if hasattr(self, 'model') else None,
                    "agent_capabilities": self.get_capabilities()
                }
            }
            
            response = requests.post(
                f"{self.backend_url}/api/tasks/{task_id}/complete",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"[{self.name}] ✅ Task completion reported: {len(files_created)} files created")
            else:
                print(f"[{self.name}] ⚠️ Failed to report completion: {response.status_code}")
                
        except Exception as e:
            print(f"[{self.name}] ⚠️ Completion report error: {e}")
    
    def report_task_error(self, task_id: str, error_message: str, error_type: str = "general", error_details: Dict[str, Any] = None):
        """Send detailed error report to backend"""
        try:
            payload = {
                "task_id": task_id,
                "agent_id": self.name,
                "status": "failed",
                "error_message": error_message,
                "error_type": error_type,
                "error_details": error_details or {},
                "timestamp": time.time(),
                "metadata": {
                    "agent_capabilities": self.get_capabilities(),
                    "ai_model_used": self.model if hasattr(self, 'model') else None
                }
            }
            
            response = requests.post(
                f"{self.backend_url}/api/tasks/{task_id}/error",
                json=payload,
                timeout=5
            )
            
            if response.status_code == 200:
                print(f"[{self.name}] 🚨 Error reported: {error_type}")
            else:
                print(f"[{self.name}] ⚠️ Failed to report error: {response.status_code}")
                
        except Exception as e:
            print(f"[{self.name}] ⚠️ Error report failed: {e}")
    
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