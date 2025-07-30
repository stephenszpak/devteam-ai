"""
Project Context Analysis - Provides context awareness for AI agents
"""

import os
import json
import glob
from pathlib import Path
from typing import Dict, List, Any, Optional
import re

class ProjectContext:
    def __init__(self, project_root: str = "/app"):
        self.project_root = project_root
        self.context_cache = {}
        self.last_scan_time = 0
        
    def get_project_context(self, refresh: bool = False) -> Dict[str, Any]:
        """Get comprehensive project context for AI agents"""
        current_time = os.path.getmtime(self.project_root) if os.path.exists(self.project_root) else 0
        
        if not refresh and self.context_cache and current_time <= self.last_scan_time:
            return self.context_cache
        
        context = {
            "project_type": self._detect_project_type(),
            "technologies": self._detect_technologies(),
            "file_structure": self._analyze_file_structure(),
            "existing_components": self._scan_existing_components(),
            "coding_patterns": self._analyze_coding_patterns(),
            "dependencies": self._analyze_dependencies(),
            "project_config": self._analyze_project_config(),
            "recent_generated_code": self._analyze_recent_generated_code()
        }
        
        self.context_cache = context
        self.last_scan_time = current_time
        return context
    
    def _detect_project_type(self) -> str:
        """Detect the type of project"""
        # Check for specific project indicators
        if self._file_exists("package.json"):
            package_json = self._read_json_file("package.json")
            if package_json:
                deps = {**package_json.get("dependencies", {}), **package_json.get("devDependencies", {})}
                if "react" in deps:
                    return "React Application"
                elif "vue" in deps:
                    return "Vue.js Application"
                elif "angular" in deps:
                    return "Angular Application"
                elif "next" in deps:
                    return "Next.js Application"
                else:
                    return "Node.js Application"
        
        if self._file_exists("mix.exs"):
            return "Phoenix/Elixir Application"
        
        if self._file_exists("requirements.txt") or self._file_exists("pyproject.toml"):
            return "Python Application"
        
        return "General Development Project"
    
    def _detect_technologies(self) -> List[str]:
        """Detect technologies used in the project"""
        technologies = []
        
        # Frontend technologies
        if self._file_exists("package.json"):
            package_json = self._read_json_file("package.json")
            if package_json:
                deps = {**package_json.get("dependencies", {}), **package_json.get("devDependencies", {})}
                
                if "react" in deps:
                    technologies.append("React")
                if "typescript" in deps:
                    technologies.append("TypeScript")
                if "tailwindcss" in deps:
                    technologies.append("Tailwind CSS")
                if "styled-components" in deps:
                    technologies.append("Styled Components")
                if "redux" in deps:
                    technologies.append("Redux")
                if "next" in deps:
                    technologies.append("Next.js")
                if "vite" in deps:
                    technologies.append("Vite")
        
        # Backend technologies
        if self._file_exists("mix.exs"):
            technologies.extend(["Elixir", "Phoenix"])
        
        # CSS frameworks
        if self._has_file_with_content("tailwind.config"):
            technologies.append("Tailwind CSS")
        
        # Styling approaches
        if self._find_files_with_extension(".scss"):
            technologies.append("SCSS")
        
        return technologies
    
    def _analyze_file_structure(self) -> Dict[str, Any]:
        """Analyze the project file structure"""
        structure = {
            "src_directories": [],
            "component_directories": [],
            "style_directories": [],
            "config_files": [],
            "total_files": 0
        }
        
        # Common source directories
        for src_dir in ["src", "components", "pages", "lib", "utils", "hooks", "services"]:
            if self._dir_exists(src_dir):
                structure["src_directories"].append(src_dir)
        
        # Component-specific directories
        for comp_dir in ["components", "src/components", "app/components"]:
            if self._dir_exists(comp_dir):
                structure["component_directories"].append(comp_dir)
        
        # Style directories
        for style_dir in ["styles", "css", "scss", "src/styles"]:
            if self._dir_exists(style_dir):
                structure["style_directories"].append(style_dir)
        
        # Config files
        config_files = ["package.json", "tsconfig.json", "tailwind.config.js", "vite.config.js", "mix.exs"]
        for config in config_files:
            if self._file_exists(config):
                structure["config_files"].append(config)
        
        return structure
    
    def _scan_existing_components(self) -> List[Dict[str, str]]:
        """Scan for existing React components"""
        components = []
        
        # Search patterns for React components
        patterns = [
            "**/*.jsx",
            "**/*.tsx", 
            "**/components/**/*.js",
            "**/src/components/**/*.js"
        ]
        
        for pattern in patterns:
            for file_path in glob.glob(pattern, recursive=True):
                if os.path.isfile(file_path):
                    component_name = self._extract_component_name(file_path)
                    if component_name:
                        components.append({
                            "name": component_name,
                            "path": file_path,
                            "type": self._determine_component_type(file_path)
                        })
        
        return components[:20]  # Limit to prevent overwhelming context
    
    def _analyze_coding_patterns(self) -> Dict[str, Any]:
        """Analyze common coding patterns in the project"""
        patterns = {
            "component_style": "functional",  # functional vs class
            "state_management": "hooks",      # hooks, redux, context
            "styling_approach": "css_modules", # css_modules, styled_components, tailwind
            "import_style": "es6",           # es6, commonjs
            "file_naming": "camelCase"       # camelCase, kebab-case, PascalCase
        }
        
        # Analyze a few sample files to detect patterns
        sample_files = glob.glob("**/*.jsx", recursive=True)[:5]
        sample_files.extend(glob.glob("**/*.tsx", recursive=True)[:5])
        
        for file_path in sample_files:
            content = self._read_file_content(file_path)
            if content:
                # Detect hooks usage
                if "useState" in content or "useEffect" in content:
                    patterns["state_management"] = "hooks"
                
                # Detect Tailwind
                if "className=" in content and ("bg-" in content or "text-" in content):
                    patterns["styling_approach"] = "tailwind"
                
                # Detect styled-components
                if "styled." in content:
                    patterns["styling_approach"] = "styled_components"
        
        return patterns
    
    def _analyze_dependencies(self) -> Dict[str, str]:
        """Analyze project dependencies"""
        dependencies = {}
        
        package_json = self._read_json_file("package.json")
        if package_json:
            deps = package_json.get("dependencies", {})
            dev_deps = package_json.get("devDependencies", {})
            
            # Key dependencies for context
            key_deps = ["react", "typescript", "tailwindcss", "styled-components", "redux", "@reduxjs/toolkit"]
            
            for dep in key_deps:
                if dep in deps:
                    dependencies[dep] = deps[dep]
                elif dep in dev_deps:
                    dependencies[dep] = dev_deps[dep]
        
        return dependencies
    
    def _analyze_project_config(self) -> Dict[str, Any]:
        """Analyze project configuration"""
        config = {}
        
        # TypeScript config
        if self._file_exists("tsconfig.json"):
            ts_config = self._read_json_file("tsconfig.json")
            if ts_config:
                config["typescript"] = {
                    "strict": ts_config.get("compilerOptions", {}).get("strict", False),
                    "jsx": ts_config.get("compilerOptions", {}).get("jsx", "react")
                }
        
        # Tailwind config
        if self._file_exists("tailwind.config.js"):
            config["tailwind"] = {"enabled": True}
        
        return config
    
    def _analyze_recent_generated_code(self) -> List[Dict[str, str]]:
        """Analyze recently generated code to understand patterns"""
        generated_files = []
        
        generated_dir = os.path.join(os.getcwd(), "generated_code")
        if os.path.exists(generated_dir):
            # Get recent directories
            recent_dirs = sorted(
                [d for d in os.listdir(generated_dir) 
                 if os.path.isdir(os.path.join(generated_dir, d))],
                key=lambda x: os.path.getmtime(os.path.join(generated_dir, x)),
                reverse=True
            )[:3]  # Last 3 generated tasks
            
            for dir_name in recent_dirs:
                dir_path = os.path.join(generated_dir, dir_name)
                for file_name in os.listdir(dir_path):
                    if file_name.endswith(('.jsx', '.tsx', '.js', '.ts')):
                        generated_files.append({
                            "name": file_name,
                            "task": dir_name,
                            "type": self._determine_component_type(file_name)
                        })
        
        return generated_files
    
    def create_context_prompt(self, task_description: str) -> str:
        """Create a context-aware prompt for AI agents"""
        context = self.get_project_context()
        
        prompt_parts = [
            "# Project Context",
            f"You are working on a {context['project_type']} project.",
            f"Technologies in use: {', '.join(context['technologies'])}",
            "",
            "# Coding Standards",
            f"- Component style: {context['coding_patterns']['component_style']} components",
            f"- State management: {context['coding_patterns']['state_management']}",
            f"- Styling approach: {context['coding_patterns']['styling_approach']}",
            f"- File naming: {context['coding_patterns']['file_naming']}",
            "",
            "# Existing Components",
        ]
        
        if context['existing_components']:
            prompt_parts.append("The project already has these components:")
            for comp in context['existing_components'][:10]:
                prompt_parts.append(f"- {comp['name']} ({comp['type']})")
        else:
            prompt_parts.append("- No existing components detected")
        
        prompt_parts.extend([
            "",
            "# Recent Generated Code",
        ])
        
        if context['recent_generated_code']:
            prompt_parts.append("Recently generated:")
            for file in context['recent_generated_code'][:5]:
                prompt_parts.append(f"- {file['name']} ({file['type']})")
        
        prompt_parts.extend([
            "",
            "# Task Requirements",
            task_description,
            "",
            "Please generate code that:",
            "1. Follows the existing project patterns and conventions",
            "2. Uses the same technologies and styling approach",
            "3. Integrates well with existing components",
            "4. Maintains consistent naming and file structure",
            "5. Includes proper TypeScript types if the project uses TypeScript"
        ])
        
        return "\n".join(prompt_parts)
    
    # Helper methods
    def _file_exists(self, path: str) -> bool:
        return os.path.exists(os.path.join(self.project_root, path))
    
    def _dir_exists(self, path: str) -> bool:
        return os.path.isdir(os.path.join(self.project_root, path))
    
    def _read_file_content(self, path: str) -> Optional[str]:
        try:
            full_path = path if os.path.isabs(path) else os.path.join(self.project_root, path)
            with open(full_path, 'r', encoding='utf-8') as f:
                return f.read()
        except:
            return None
    
    def _read_json_file(self, path: str) -> Optional[Dict]:
        content = self._read_file_content(path)
        if content:
            try:
                return json.loads(content)
            except:
                return None
        return None
    
    def _has_file_with_content(self, pattern: str) -> bool:
        files = glob.glob(f"**/*{pattern}*", recursive=True)
        return len(files) > 0
    
    def _find_files_with_extension(self, extension: str) -> List[str]:
        return glob.glob(f"**/*{extension}", recursive=True)
    
    def _extract_component_name(self, file_path: str) -> Optional[str]:
        content = self._read_file_content(file_path)
        if content:
            # Look for React component exports
            patterns = [
                r'export default (\w+)',
                r'export const (\w+)',
                r'function (\w+)\(',
                r'const (\w+) = '
            ]
            
            for pattern in patterns:
                match = re.search(pattern, content)
                if match:
                    name = match.group(1)
                    if name[0].isupper():  # React components start with uppercase
                        return name
        
        # Fallback to filename
        return Path(file_path).stem
    
    def _determine_component_type(self, file_path: str) -> str:
        content = self._read_file_content(file_path)
        if not content:
            return "component"
        
        content_lower = content.lower()
        
        if "button" in content_lower:
            return "button"
        elif "form" in content_lower or "input" in content_lower:
            return "form"
        elif "modal" in content_lower:
            return "modal"
        elif "card" in content_lower:
            return "card"
        elif "navigation" in content_lower or "nav" in content_lower:
            return "navigation"
        else:
            return "component"