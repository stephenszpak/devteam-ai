#!/usr/bin/env python3
"""
Quick test script to verify agent code generation without full orchestrator
"""

import os
import sys
from frontend_coder import FrontendCoder

def test_code_generation():
    print("🧪 Testing AI Agent Code Generation")
    print("=" * 50)
    
    # Create agent (will work without API key in fallback mode)
    agent = FrontendCoder()
    print(f"✅ Agent '{agent.name}' initialized")
    
    # Override the AI call to provide mock response for testing
    def mock_ai_call(prompt, system_prompt=None):
        return """
## Analysis
This task requires creating a simple React button component with proper styling and accessibility.

## Implementation Plan
1. Create a reusable Button component
2. Add proper TypeScript interfaces
3. Include Tailwind CSS styling
4. Add accessibility attributes

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
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${
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

export const Danger = {
  args: {
    children: 'Delete',
    variant: 'danger',
  },
};
```

## Usage Instructions
Import and use the Button component in your React application:

```jsx
import Button from './components/Button';

function App() {
  return (
    <div>
      <Button onClick={() => alert('Clicked!')}>
        Click me
      </Button>
      <Button variant="secondary" size="large">
        Large Secondary
      </Button>
    </div>
  );
}
```

## Notes
- Component includes full accessibility support
- Uses Tailwind CSS for styling
- Supports multiple variants and sizes
- Includes TypeScript-ready props interface
"""

    # Replace the AI call method temporarily
    original_call_ai = agent.call_ai
    agent.call_ai = mock_ai_call
    
    # Test task
    test_task = {
        'id': 'test_button_123',
        'description': 'Create a reusable Button component with different variants and sizes'
    }
    
    print(f"📋 Processing task: {test_task['description']}")
    print()
    
    try:
        # Process the task
        result = agent.process_task(test_task)
        
        print(f"📊 Task Status: {result.get('status', 'unknown')}")
        print(f"📁 Files Created: {len(result.get('files_created', []))}")
        
        if result.get('files_created'):
            print("\n📝 Generated Files:")
            for file_path in result['files_created']:
                print(f"   ✅ {file_path}")
                
        # Show directory contents
        print(f"\n📂 Generated Code Directory:")
        if os.path.exists('generated_code'):
            for root, dirs, files in os.walk('generated_code'):
                level = root.replace('generated_code', '').count(os.sep)
                indent = ' ' * 2 * level
                print(f"{indent}{os.path.basename(root)}/")
                subindent = ' ' * 2 * (level + 1)
                for file in files:
                    print(f"{subindent}{file}")
        
        return result.get('status') == 'completed'
        
    except Exception as e:
        print(f"❌ Error during task processing: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        # Restore original method
        agent.call_ai = original_call_ai

if __name__ == "__main__":
    success = test_code_generation()
    print(f"\n🏁 Test {'PASSED' if success else 'FAILED'}")
    sys.exit(0 if success else 1)