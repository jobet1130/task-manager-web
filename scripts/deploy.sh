#!/bin/bash

# Task Manager Deployment Script
# Usage: ./deploy.sh [staging|production]

set -e

ENVIRONMENT=${1:-staging}
IMAGE_TAG=${2:-latest}

echo "🚀 Deploying Task Manager to $ENVIRONMENT environment..."

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo "❌ Error: Environment must be 'staging' or 'production'"
    exit 1
fi

# Set environment-specific variables
if [[ "$ENVIRONMENT" == "production" ]]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    ENV_FILE=".env.production"
else
    COMPOSE_FILE="docker-compose.staging.yml"
    ENV_FILE=".env.staging"
fi

echo "📋 Using configuration:"
echo "  - Environment: $ENVIRONMENT"
echo "  - Compose file: $COMPOSE_FILE"
echo "  - Environment file: $ENV_FILE"
echo "  - Image tag: $IMAGE_TAG"

# Check if required files exist
if [[ ! -f "$COMPOSE_FILE" ]]; then
    echo "❌ Error: $COMPOSE_FILE not found"
    exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
    echo "❌ Error: $ENV_FILE not found"
    exit 1
fi

# Pull latest images
echo "📥 Pulling latest Docker images..."
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" pull

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down

# Start new containers
echo "🔄 Starting new containers..."
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service health..."
if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo "📊 Service status:"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
else
    echo "❌ Deployment failed! Check logs:"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs
    exit 1
fi

# Run database migrations if needed
if [[ -f "migrations/migrate.sh" ]]; then
    echo "🗃️ Running database migrations..."
    ./migrations/migrate.sh "$ENVIRONMENT"
fi

echo "🎉 Deployment to $ENVIRONMENT completed successfully!"

# Show application URL
if [[ "$ENVIRONMENT" == "production" ]]; then
    echo "🌐 Application URL: https://your-production-domain.com"
else
    echo "🌐 Application URL: https://staging.your-domain.com"
fi