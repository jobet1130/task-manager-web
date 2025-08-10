#!/bin/bash

# PostgreSQL Backup Script
# This script creates automated backups of the PostgreSQL database

set -e

# Configuration
BACKUP_DIR="/backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="taskmanager_backup_${DATE}.sql"
RETENTION_DAYS=7

# Database connection details
DB_HOST=${POSTGRES_HOST:-postgres}
DB_PORT=${POSTGRES_PORT:-5432}
DB_NAME=${POSTGRES_DB:-taskmanager}
DB_USER=${POSTGRES_USER:-taskmanager}

echo "🗃️ Starting database backup..."
echo "📅 Date: $(date)"
echo "🏷️ Backup file: $BACKUP_FILE"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create the backup
echo "📦 Creating backup..."
PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --verbose \
    --clean \
    --no-owner \
    --no-privileges \
    --format=custom \
    --file="$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully: $BACKUP_FILE"
    
    # Compress the backup
    echo "🗜️ Compressing backup..."
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        echo "✅ Backup compressed: ${BACKUP_FILE}.gz"
        
        # Get backup size
        BACKUP_SIZE=$(du -h "$BACKUP_DIR/${BACKUP_FILE}.gz" | cut -f1)
        echo "📊 Backup size: $BACKUP_SIZE"
        
        # Clean up old backups
        echo "🧹 Cleaning up old backups (older than $RETENTION_DAYS days)..."
        find "$BACKUP_DIR" -name "taskmanager_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
        
        # List remaining backups
        echo "📋 Available backups:"
        ls -lh "$BACKUP_DIR"/taskmanager_backup_*.sql.gz 2>/dev/null || echo "No backups found"
        
        echo "🎉 Backup process completed successfully!"
    else
        echo "❌ Failed to compress backup"
        exit 1
    fi
else
    echo "❌ Backup failed!"
    exit 1
fi

# Optional: Upload to cloud storage (uncomment and configure as needed)
# echo "☁️ Uploading backup to cloud storage..."
# aws s3 cp "$BACKUP_DIR/${BACKUP_FILE}.gz" "s3://your-backup-bucket/database-backups/"
# echo "✅ Backup uploaded to cloud storage"