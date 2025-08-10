#!/bin/bash

# PostgreSQL Restore Script
# Usage: ./restore.sh <backup_file> [environment]

set -e

BACKUP_FILE=$1
ENVIRONMENT=${2:-staging}

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Error: Please provide a backup file"
    echo "Usage: $0 <backup_file> [environment]"
    echo "Example: $0 taskmanager_backup_20231201_120000.sql.gz staging"
    exit 1
fi

# Set environment-specific variables
if [[ "$ENVIRONMENT" == "production" ]]; then
    ENV_FILE=".env.production"
    COMPOSE_FILE="docker-compose.prod.yml"
else
    ENV_FILE=".env.staging"
    COMPOSE_FILE="docker-compose.staging.yml"
fi

echo "🔄 Starting database restore..."
echo "📁 Backup file: $BACKUP_FILE"
echo "🌍 Environment: $ENVIRONMENT"
echo "⚙️ Using: $ENV_FILE"

# Load environment variables
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
else
    echo "❌ Error: Environment file $ENV_FILE not found"
    exit 1
fi

# Check if backup file exists
BACKUP_PATH="./backups/$BACKUP_FILE"
if [ ! -f "$BACKUP_PATH" ]; then
    echo "❌ Error: Backup file $BACKUP_PATH not found"
    echo "📋 Available backups:"
    ls -la ./backups/taskmanager_backup_*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

# Confirm restore operation
echo "⚠️ WARNING: This will replace the current database!"
read -p "Are you sure you want to restore from $BACKUP_FILE? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Restore cancelled"
    exit 1
fi

# Stop the application
echo "🛑 Stopping application..."
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" stop task-manager-web

# Create a backup of current database before restore
echo "💾 Creating backup of current database..."
CURRENT_BACKUP="./backups/pre_restore_backup_$(date +"%Y%m%d_%H%M%S").sql"
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_dump \
    -U "$POSTGRES_USER" \
    -d "$POSTGRES_DB" \
    --clean \
    --no-owner \
    --no-privileges > "$CURRENT_BACKUP"

echo "✅ Current database backed up to: $CURRENT_BACKUP"

# Decompress backup if needed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "📦 Decompressing backup..."
    DECOMPRESSED_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "$BACKUP_PATH" > "./backups/$DECOMPRESSED_FILE"
    RESTORE_FILE="./backups/$DECOMPRESSED_FILE"
else
    RESTORE_FILE="$BACKUP_PATH"
fi

# Drop and recreate database
echo "🗑️ Dropping existing database..."
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres psql \
    -U "$POSTGRES_USER" \
    -d postgres \
    -c "DROP DATABASE IF EXISTS $POSTGRES_DB;"

echo "🆕 Creating new database..."
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres psql \
    -U "$POSTGRES_USER" \
    -d postgres \
    -c "CREATE DATABASE $POSTGRES_DB;"

# Restore from backup
echo "📥 Restoring database from backup..."
if [[ "$RESTORE_FILE" == *.sql ]]; then
    # Plain SQL file
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres psql \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" < "$RESTORE_FILE"
else
    # Custom format file
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_restore \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        --clean \
        --no-owner \
        --no-privileges \
        --verbose < "$RESTORE_FILE"
fi

if [ $? -eq 0 ]; then
    echo "✅ Database restored successfully!"
    
    # Clean up decompressed file if we created one
    if [[ "$BACKUP_FILE" == *.gz ]] && [[ -f "$RESTORE_FILE" ]]; then
        rm "$RESTORE_FILE"
    fi
    
    # Start the application
    echo "🚀 Starting application..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" start task-manager-web
    
    echo "🎉 Restore completed successfully!"
    echo "📊 Database status:"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec postgres psql \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        -c "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';"
else
    echo "❌ Restore failed!"
    echo "🔄 Restoring from pre-restore backup..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres psql \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" < "$CURRENT_BACKUP"
    exit 1
fi