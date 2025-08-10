#!/bin/bash

# Database creation script for Task Manager
# This script creates both production and staging databases

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default values
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)
            POSTGRES_HOST="$2"
            shift 2
            ;;
        -p|--port)
            POSTGRES_PORT="$2"
            shift 2
            ;;
        -U|--username)
            POSTGRES_USER="$2"
            shift 2
            ;;
        -W|--password)
            POSTGRES_PASSWORD="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -h, --host HOST        PostgreSQL host (default: localhost)"
            echo "  -p, --port PORT        PostgreSQL port (default: 5432)"
            echo "  -U, --username USER    PostgreSQL username (default: postgres)"
            echo "  -W, --password PASS    PostgreSQL password"
            echo "  --help                 Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if PostgreSQL is accessible
print_status "Checking PostgreSQL connection..."

if [ -n "$POSTGRES_PASSWORD" ]; then
    export PGPASSWORD="$POSTGRES_PASSWORD"
fi

# Test connection
if ! psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
    print_error "Cannot connect to PostgreSQL server at $POSTGRES_HOST:$POSTGRES_PORT"
    print_error "Please check your connection parameters and ensure PostgreSQL is running"
    exit 1
fi

print_status "PostgreSQL connection successful"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$SCRIPT_DIR/create-databases.sql"

# Check if SQL file exists
if [ ! -f "$SQL_FILE" ]; then
    print_error "SQL file not found: $SQL_FILE"
    exit 1
fi

print_status "Creating databases..."

# Execute the SQL script
if psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d postgres -f "$SQL_FILE"; then
    print_status "✅ Databases created successfully!"
    print_status "Created databases:"
    print_status "  - taskmanager_prod (production)"
    print_status "  - taskmanager_staging (staging)"
else
    print_error "❌ Failed to create databases"
    exit 1
fi

# List created databases
print_status "Verifying database creation..."
psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d postgres -c "\l" | grep taskmanager

print_status "Database creation completed!"
print_warning "Remember to update your environment files with the correct database names:"
print_warning "  - .env.production: POSTGRES_DB=taskmanager_prod"
print_warning "  - .env.staging: POSTGRES_DB=taskmanager_staging"

# Clean up
unset PGPASSWORD