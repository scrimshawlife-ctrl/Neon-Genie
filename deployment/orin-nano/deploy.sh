#!/bin/bash
set -e

echo "🚀 Deploying Neon Genie to Orin Nano"
echo "======================================"

# Check architecture
ARCH=$(uname -m)
echo "Architecture: $ARCH"
if [ "$ARCH" != "aarch64" ]; then
    echo "⚠️  Warning: Optimized for ARM64 (aarch64), current: $ARCH"
    echo "    Deployment will continue but may not be optimal"
fi

# Create directories
echo ""
echo "📁 Creating data directories..."
mkdir -p data logs

# Build Docker image
echo ""
echo "🏗️  Building Docker image..."
docker-compose build

# Start services
echo ""
echo "▶️  Starting services..."
docker-compose up -d

# Wait for services to start
echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check status
echo ""
echo "🔍 Checking deployment status..."
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "Service running at: http://localhost:3000"
    echo ""
    echo "Useful commands:"
    echo "  • View logs: docker-compose logs -f"
    echo "  • Stop: docker-compose down"
    echo "  • Restart: docker-compose restart"
    echo "  • Shell: docker-compose exec neon-genie sh"
    echo ""
else
    echo ""
    echo "❌ Deployment failed"
    echo ""
    echo "Logs:"
    docker-compose logs
    exit 1
fi
