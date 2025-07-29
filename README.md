# DevTeam AI

An AI-powered development team simulation where intelligent agents collaborate to complete coding tasks. This monorepo contains a full-stack application with Phoenix/Elixir backend, React frontend, and Python AI agents.

## 🏗 Architecture

```
devteam_ai/
├── apps/
│   ├── backend/          # Phoenix (Elixir) API server
│   └── frontend/         # React + Vite + Tailwind UI
├── agents/               # Python AI agents with AutoGen
├── scripts/              # Development utilities
└── docker-compose.yml    # Container orchestration
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Run the Application

```bash
# Clone and enter the project
cd devteam_ai

# Start all services
./scripts/dev.sh
```

This will start:
- **Frontend**: http://localhost:5173 (React + Vite)
- **Backend**: http://localhost:4000 (Phoenix API)
- **Postgres**: localhost:5432 (Database)
- **AI Agents**: Python service (background)

## 🔧 Components

### Phoenix Backend (`apps/backend/`)

- **Framework**: Phoenix 1.7+ with LiveView
- **Database**: PostgreSQL with Ecto
- **API Endpoints**:
  - `POST /api/tasks` - Create new tasks
  - `GET /api/tasks/:id` - Get task details
  - `GET /api/agents` - List agent status
  - `POST /api/messages` - Send chat messages
- **Features**:
  - AgentOrchestrator GenServer for task management
  - CORS enabled for frontend communication
  - Real-time updates via Phoenix PubSub

### React Frontend (`apps/frontend/`)

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Pages**:
  - `/` - Home dashboard with task creation
  - `/task/:id` - Task detail view
- **Components**:
  - TaskInput - Create new tasks
  - AgentsList - View AI agent status
  - ChatLog - Activity feed

### Python AI Agents (`agents/`)

- **Framework**: AutoGen for agent orchestration
- **Agents**:
  - `frontend_coder.py` - React/JavaScript specialist
- **Features**:
  - Task queue processing
  - Agent capability matching
  - Backend API integration
  - Simulated coding workflows

## 🐳 Docker Services

The application runs in containerized services:

```yaml
services:
  postgres:    # Database
  backend:     # Phoenix API (port 4000)
  frontend:    # React dev server (port 5173)  
  agents:      # Python AI agents
```

## 🛠 Development

### Local Development (without Docker)

#### Backend Setup
```bash
cd apps/backend
mix deps.get
mix ecto.create
mix ecto.migrate
mix phx.server
```

#### Frontend Setup
```bash
cd apps/frontend
npm install
npm run dev
```

#### Agents Setup
```bash
cd agents
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python run_agents.py
```

### Useful Commands

```bash
# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f agents

# Restart a service
docker-compose restart backend

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build
```

## 📋 Usage & Example Prompts

### 🎯 **How to Use Your AI Dev Team**

1. **Visit the Interface**: Open http://localhost:5173 in your browser
2. **Submit Tasks**: Enter development tasks in natural language
3. **Watch Real-time**: See agents pick up tasks and provide updates
4. **Monitor Progress**: Follow the live chat log and agent status changes

### 💡 **Example Prompts to Try**

#### **Frontend Development Tasks**
```
"Create a responsive navigation bar with a logo and menu items"

"Build a user profile card component with avatar, name, and bio"

"Implement a modal dialog for confirming delete actions"

"Add a dark mode toggle that saves preference in localStorage"

"Create a form validation component for email and password fields"

"Build a data table with sorting, filtering, and pagination"
```

#### **UI/UX Enhancement Tasks**
```
"Improve the accessibility of the login form with proper ARIA labels"

"Add loading states and skeleton screens for better UX"

"Create hover effects and micro-animations for buttons"

"Implement a toast notification system for success/error messages"

"Design a mobile-first responsive layout for the dashboard"
```

#### **Feature Development Tasks**
```
"Add search functionality with debounced input and results highlighting"

"Implement drag-and-drop file upload with progress indicators"

"Create a real-time chat component with typing indicators"

"Build a task management board with drag-and-drop between columns"

"Add image gallery with lightbox and thumbnail navigation"
```

#### **Code Quality & Refactoring Tasks**
```
"Refactor the user authentication logic to use React Context"

"Split the large HomePage component into smaller, reusable components"

"Add comprehensive error handling to the API integration layer"

"Optimize bundle size by implementing code splitting and lazy loading"

"Add unit tests for the utility functions and custom hooks"
```

#### **Integration & API Tasks**
```
"Connect the frontend to a REST API for user management"

"Implement WebSocket integration for real-time updates"

"Add integration with a third-party payment service like Stripe"

"Create a data synchronization system with offline support"

"Build a dashboard that displays analytics from Google Analytics API"
```

#### **Complex Multi-Step Tasks**
```
"Build a complete e-commerce product catalog with search, filters, and cart functionality"

"Create a blog system with markdown editor, tags, and comment system"

"Implement a project management tool with teams, tasks, and time tracking"

"Build a social media feed with infinite scroll, likes, and comments"

"Design and implement a multi-step wizard for user onboarding"
```

### 🚀 **Pro Tips for Better Results**

1. **Be Specific**: Include technology preferences, styling requirements, and functional details
2. **Break Down Complex Tasks**: Large features work better when split into smaller, focused tasks
3. **Mention Constraints**: Specify browser support, performance requirements, or accessibility needs
4. **Include Context**: Reference existing components or patterns you want to follow
5. **Test Iteratively**: Start with simple tasks to understand your team's capabilities

### 📊 **What to Expect**

- **Real-time Updates**: Watch agents change status from "idle" → "working" → "completed"
- **Live Chat Log**: See detailed progress updates and completion notifications
- **Task Tracking**: Monitor which agents are assigned to which tasks
- **Instant Feedback**: Get immediate confirmation when tasks are created

### 🔄 **Workflow Example**

```
1. You: "Create a responsive header with logo and navigation menu"
2. System: "🔌 Connected to DevTeam AI server"
3. System: "📋 Task created: Create a responsive header..."
4. Agent: "🤖 frontend_coder: Started working on task: abc123"
5. Agent: "🤖 frontend_coder: Completed task: abc123"
6. System: "✅ Task completed: abc123"
```

## 🔮 Future Enhancements

- [ ] More specialized agents (backend_coder, reviewer, tester)
- [ ] Real AI integration (OpenAI, Claude, etc.)
- [ ] Code execution sandbox
- [ ] Git integration for code commits
- [ ] Task prioritization and dependencies
- [ ] Agent learning and improvement
- [ ] WebSocket real-time updates
- [ ] Task templates and workflows

## 🤝 Contributing

This is a demonstration project showing AI-powered development workflows. Feel free to extend it with additional agents, capabilities, or integrations.

## 📄 License

MIT License - Feel free to use this as a starting point for your own AI development tools.