#!/bin/bash

echo "🚀 Starting DevTeam AI Development Environment"
echo "=============================================="

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start all services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "📊 Service Status:"
echo "=================="
docker-compose ps

echo ""
echo "🌐 Application URLs:"
echo "==================="
echo "Frontend:  http://localhost:5173"
echo "Backend:   http://localhost:4000"
echo "Postgres:  localhost:5432"
echo ""
echo "📝 To view logs:"
echo "docker-compose logs -f [service-name]"
echo ""
echo "🛑 To stop all services:"
echo "docker-compose down"
echo ""
echo "✅ Development environment is ready!"