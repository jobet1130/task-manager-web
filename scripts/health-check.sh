#!/bin/bash

# Health Check Script for Task Manager Application
# Usage: ./health-check.sh [environment]

set -e

ENVIRONMENT=${1:-staging}
EXIT_CODE=0

# Set environment-specific variables
if [[ "$ENVIRONMENT" == "production" ]]; then
    ENV_FILE=".env.production"
    COMPOSE_FILE="docker-compose.prod.yml"
    APP_URL="https://your-production-domain.com"
else
    ENV_FILE=".env.staging"
    COMPOSE_FILE="docker-compose.staging.yml"
    APP_URL="https://staging.your-domain.com"
fi

echo "🏥 Health Check for Task Manager ($ENVIRONMENT)"
echo "📅 $(date)"
echo "==========================================="

# Load environment variables
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
else
    echo "❌ Environment file $ENV_FILE not found"
    exit 1
fi

# Function to check service health
check_service() {
    local service_name=$1
    local container_name=$2
    
    echo "🔍 Checking $service_name..."
    
    # Check if container is running
    if docker ps --format "table {{.Names}}" | grep -q "$container_name"; then
        echo "✅ $service_name container is running"
        
        # Check container health
        local health_status=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "no-health-check")
        if [[ "$health_status" == "healthy" ]]; then
            echo "✅ $service_name is healthy"
        elif [[ "$health_status" == "no-health-check" ]]; then
            echo "ℹ️ $service_name has no health check configured"
        else
            echo "⚠️ $service_name health status: $health_status"
            EXIT_CODE=1
        fi
        
        # Show resource usage
        local stats=$(docker stats --no-stream --format "table {{.CPUPerc}}\t{{.MemUsage}}" "$container_name")
        echo "📊 $service_name resources: $stats"
    else
        echo "❌ $service_name container is not running"
        EXIT_CODE=1
    fi
    echo ""
}

# Function to check database connectivity
check_database() {
    echo "🗃️ Checking database connectivity..."
    
    if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; then
        echo "✅ Database is accepting connections"
        
        # Check database size
        local db_size=$(docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT pg_size_pretty(pg_database_size('$POSTGRES_DB'));" | xargs)
        echo "📊 Database size: $db_size"
        
        # Check table count
        local table_count=$(docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)
        echo "📋 Number of tables: $table_count"
        
        # Check active connections
        local active_connections=$(docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';" | xargs)
        echo "🔗 Active connections: $active_connections"
    else
        echo "❌ Database is not accepting connections"
        EXIT_CODE=1
    fi
    echo ""
}

# Function to check web application
check_web_app() {
    echo "🌐 Checking web application..."
    
    # Check if app responds to HTTP requests
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000" || echo "000")
    
    if [[ "$http_status" == "200" ]]; then
        echo "✅ Web application is responding (HTTP $http_status)"
        
        # Check response time
        local response_time=$(curl -s -o /dev/null -w "%{time_total}" "http://localhost:3000")
        echo "⏱️ Response time: ${response_time}s"
    else
        echo "❌ Web application is not responding (HTTP $http_status)"
        EXIT_CODE=1
    fi
    echo ""
}

# Function to check disk space
check_disk_space() {
    echo "💾 Checking disk space..."
    
    local disk_usage=$(df -h / | awk 'NR==2{print $5}' | sed 's/%//')
    echo "📊 Disk usage: ${disk_usage}%"
    
    if [[ $disk_usage -gt 90 ]]; then
        echo "⚠️ Warning: Disk usage is above 90%"
        EXIT_CODE=1
    elif [[ $disk_usage -gt 80 ]]; then
        echo "⚠️ Warning: Disk usage is above 80%"
    else
        echo "✅ Disk usage is within acceptable limits"
    fi
    
    # Check Docker volumes
    echo "📦 Docker volume usage:"
    docker system df
    echo ""
}

# Function to check logs for errors
check_logs() {
    echo "📋 Checking recent logs for errors..."
    
    # Check application logs for errors in the last 10 minutes
    local error_count=$(docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs --since="10m" task-manager-web 2>/dev/null | grep -i "error\|exception\|failed" | wc -l)
    
    if [[ $error_count -gt 0 ]]; then
        echo "⚠️ Found $error_count error(s) in application logs (last 10 minutes)"
        echo "📋 Recent errors:"
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs --since="10m" task-manager-web 2>/dev/null | grep -i "error\|exception\|failed" | tail -5
        EXIT_CODE=1
    else
        echo "✅ No errors found in recent application logs"
    fi
    echo ""
}

# Run all health checks
check_service "PostgreSQL" "task-manager-postgres-${ENVIRONMENT}"
check_service "Web Application" "task-manager-web-${ENVIRONMENT}"



check_database
check_web_app
check_disk_space
check_logs

# Summary
echo "==========================================="
if [[ $EXIT_CODE -eq 0 ]]; then
    echo "🎉 All health checks passed!"
    echo "✅ System is healthy"
else
    echo "❌ Some health checks failed!"
    echo "⚠️ System requires attention"
fi

echo "📅 Health check completed at $(date)"
exit $EXIT_CODE