#!/bin/bash

# Simple monitoring script for cron jobs
# Usage: ./monitor.sh [environment] [notification_webhook]

ENVIRONMENT=${1:-production}
WEBHOOK_URL=$2
LOG_FILE="/var/log/task-manager-monitor.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Function to log messages
log_message() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

# Function to send notification
send_notification() {
    local message="$1"
    local status="$2"  # success, warning, error
    
    if [[ -n "$WEBHOOK_URL" ]]; then
        curl -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "{
                \"text\": \"Task Manager Monitor ($ENVIRONMENT)\",
                \"attachments\": [{
                    \"color\": \"$([ \"$status\" = \"success\" ] && echo \"good\" || ([ \"$status\" = \"warning\" ] && echo \"warning\" || echo \"danger\"))\",
                    \"text\": \"$message\",
                    \"ts\": $(date +%s)
                }]
            }" \
            --silent --output /dev/null
    fi
}

# Run health check
log_message "Starting health check for $ENVIRONMENT environment"

# Change to application directory
cd /opt/task-manager || {
    log_message "ERROR: Could not change to application directory"
    send_notification "Failed to access application directory" "error"
    exit 1
}

# Run health check script
if ./scripts/health-check.sh "$ENVIRONMENT" > /tmp/health-check.log 2>&1; then
    log_message "Health check passed"
    
    # Only send success notification once per day
    if [[ $(date +%H:%M) == "09:00" ]]; then
        send_notification "Daily health check passed - all systems operational" "success"
    fi
else
    log_message "Health check failed"
    
    # Get the error details
    error_details=$(tail -10 /tmp/health-check.log)
    
    log_message "Health check errors: $error_details"
    send_notification "Health check failed:\n\`\`\`\n$error_details\n\`\`\`" "error"
    
    # Try to restart services if they're down
    log_message "Attempting to restart services"
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        docker-compose -f docker-compose.prod.yml --env-file .env.production restart
    else
        docker-compose -f docker-compose.staging.yml --env-file .env.staging restart
    fi
    
    # Wait and check again
    sleep 30
    
    if ./scripts/health-check.sh "$ENVIRONMENT" > /tmp/health-check-retry.log 2>&1; then
        log_message "Services restarted successfully"
        send_notification "Services were restarted and are now healthy" "warning"
    else
        log_message "Service restart failed"
        send_notification "CRITICAL: Service restart failed - manual intervention required" "error"
    fi
fi

# Clean up old log files (keep last 30 days)
find /var/log -name "task-manager-monitor.log*" -mtime +30 -delete 2>/dev/null

log_message "Monitoring check completed"