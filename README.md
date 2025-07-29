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

## 📋 Usage

1. **Create Tasks**: Use the web interface to submit coding tasks
2. **Monitor Agents**: Watch AI agents process tasks in real-time
3. **View Results**: See generated code and task completion status
4. **Chat Log**: Follow the activity stream for updates

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