# 🤖 AI Agent Setup Guide

## 🚀 Quick Start (Demo Mode)

The system works immediately in demo mode without any API keys:

```bash
./scripts/dev.sh
```

Visit http://localhost:5173 and create tasks! Agents will simulate work without actual AI.

## 🔑 Enable Real AI (Recommended)

To get actual code generation, you need AI API access:

### Option 1: OpenAI (Recommended)

1. **Get API Key**: Visit [OpenAI API](https://platform.openai.com/api-keys)
2. **Set Environment Variables**:
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   export AI_PROVIDER="openai"
   ```

### Option 2: Anthropic Claude

1. **Get API Key**: Visit [Anthropic Console](https://console.anthropic.com/)
2. **Set Environment Variables**:
   ```bash
   export ANTHROPIC_API_KEY="your-api-key-here"  
   export AI_PROVIDER="anthropic"
   ```

### Option 3: Environment File

Create a `.env` file in the project root:

```bash
# Copy the example file
cp agents/.env.example .env

# Edit with your API keys
AI_PROVIDER=openai
OPENAI_API_KEY=your_actual_api_key_here
```

## 🔄 Restart with AI

After setting API keys:

```bash
docker-compose down
docker-compose up -d
```

## ✅ Verify AI Integration

1. **Check Agent Logs**:
   ```bash
   docker-compose logs agents
   ```
   
   Should show: `✅ OpenAI API key configured`

2. **Test Code Generation**:
   - Visit http://localhost:5173
   - Create a task: "Build a login form component with validation"
   - Watch agents generate real React code!

3. **View Generated Code**:
   ```bash
   docker-compose exec agents ls -la generated_code/
   ```

## 🎯 Example Tasks to Try

Once AI is enabled, try these prompts:

```
"Create a responsive navigation bar with logo and menu items"
"Build a user profile card with avatar and bio"  
"Implement a modal dialog with backdrop and close button"
"Add a search component with debounced input"
"Create a data table with sorting and pagination"
```

## 🛠 Troubleshooting

### No Code Generated?
- Check API key is set correctly
- Verify agent logs: `docker-compose logs agents`
- Ensure you have API credits/quota

### Permission Errors?
```bash
sudo chown -R $USER:$USER generated_code/
```

### Container Issues?
```bash
docker-compose down
docker-compose up --build -d
```

## 💰 Cost Considerations

- **OpenAI GPT-4o-mini**: ~$0.01-0.05 per task
- **Claude Haiku**: ~$0.005-0.02 per task  
- **Demo Mode**: Completely free

## 🚀 Advanced Configuration

### Custom Models

In your `.env` file:

```bash
# OpenAI Models
OPENAI_MODEL=gpt-4o          # More powerful, higher cost
OPENAI_MODEL=gpt-4o-mini     # Fast, cost-effective (default)

# Claude Models  
ANTHROPIC_MODEL=claude-3-sonnet-20240229   # More capable
ANTHROPIC_MODEL=claude-3-haiku-20240307    # Fast, cheap (default)
```

### Multiple Agents

The system supports multiple AI providers simultaneously:

```bash
export OPENAI_API_KEY="your-openai-key"
export ANTHROPIC_API_KEY="your-claude-key"
```

Different agents can use different providers for optimal cost/performance.

## 🎉 You're Ready!

Your AI dev team is now ready to generate real code. Try creating a task and watch the magic happen! 

Generated code will be saved in the `agents/generated_code/` directory.