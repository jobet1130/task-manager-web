#!/bin/bash

# Task Manager Setup Script
# This script sets up the server environment for deployment

set -e

ENVIRONMENT=${1:-staging}
DOMAIN=${2:-localhost}

echo "🚀 Setting up Task Manager environment..."
echo "Environment: $ENVIRONMENT"
echo "Domain: $DOMAIN"
echo "========================================"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ This script should not be run as root"
   exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install Docker if not present
if ! command_exists docker; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker installed"
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose if not present
if ! command_exists docker-compose; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed"
else
    echo "✅ Docker Compose already installed"
fi

# Create application directory
APP_DIR="/opt/task-manager"
if [[ ! -d "$APP_DIR" ]]; then
    echo "📁 Creating application directory..."
    sudo mkdir -p "$APP_DIR"
    sudo chown $USER:$USER "$APP_DIR"
    echo "✅ Application directory created"
else
    echo "✅ Application directory exists"
fi

# Create required directories
echo "📁 Creating required directories..."
mkdir -p "$APP_DIR"/{backups,logs,uploads}
echo "✅ Directories created"

# Set up environment file
ENV_FILE="$APP_DIR/.env.$ENVIRONMENT"
if [[ ! -f "$ENV_FILE" ]]; then
    echo "⚙️ Setting up environment file..."
    
    # Generate secure passwords
    POSTGRES_PASSWORD=$(openssl rand -base64 32)
    JWT_SECRET=$(openssl rand -base64 64)
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    ENCRYPTION_KEY=$(openssl rand -base64 32)
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        cat > "$ENV_FILE" << EOF
# Production Environment Configuration
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# PostgreSQL Configuration
DATABASE_URL=postgresql://taskmanager:$POSTGRES_PASSWORD@postgres:5432/taskmanager_prod
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=taskmanager_prod
POSTGRES_USER=taskmanager
POSTGRES_PASSWORD=$POSTGRES_PASSWORD

# Application Configuration
NEXTAUTH_URL=https://$DOMAIN
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# DockerHub Configuration
DOCKERHUB_USERNAME=your-dockerhub-username

# Security
JWT_SECRET=$JWT_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/app/uploads

# Monitoring and Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
EOF
    else
        cat > "$ENV_FILE" << EOF
# Staging Environment Configuration
NODE_ENV=staging
PORT=3000
HOSTNAME=0.0.0.0

# PostgreSQL Configuration
DATABASE_URL=postgresql://taskmanager:$POSTGRES_PASSWORD@postgres:5432/taskmanager_staging
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=taskmanager_staging
POSTGRES_USER=taskmanager
POSTGRES_PASSWORD=$POSTGRES_PASSWORD

# Application Configuration
NEXTAUTH_URL=https://$DOMAIN
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# DockerHub Configuration
DOCKERHUB_USERNAME=your-dockerhub-username

# Security
JWT_SECRET=$JWT_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=/app/uploads

# Monitoring and Logging
LOG_LEVEL=debug

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=200
EOF
    fi
    
    echo "✅ Environment file created: $ENV_FILE"
    echo "⚠️ Please review and update the environment file with your specific values"
else
    echo "✅ Environment file already exists"
fi

# Set up log rotation
echo "📋 Setting up log rotation..."
sudo tee /etc/logrotate.d/task-manager > /dev/null << EOF
/var/log/task-manager-monitor.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF
echo "✅ Log rotation configured"

# Set up monitoring cron job
echo "⏰ Setting up monitoring cron job..."
(crontab -l 2>/dev/null; echo "*/5 * * * * cd $APP_DIR && ./scripts/monitor.sh $ENVIRONMENT") | crontab -
echo "✅ Monitoring cron job added (runs every 5 minutes)"

# Set up daily backup cron job for production
if [[ "$ENVIRONMENT" == "production" ]]; then
    echo "💾 Setting up daily backup cron job..."
    (crontab -l 2>/dev/null; echo "0 2 * * * cd $APP_DIR && ./scripts/backup.sh") | crontab -
    echo "✅ Daily backup cron job added (runs at 2 AM)"
fi

# Install useful tools
echo "🔧 Installing useful tools..."
sudo apt update
sudo apt install -y curl wget htop ncdu tree jq
echo "✅ Tools installed"

# Set up firewall (basic configuration)
echo "🔥 Configuring firewall..."
if command_exists ufw; then
    sudo ufw --force reset
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow ssh
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    
    if [[ "$ENVIRONMENT" == "staging" ]]; then
        sudo ufw allow 3001/tcp  # Staging port
        sudo ufw allow 5433/tcp  # Staging PostgreSQL
    fi
    
    sudo ufw --force enable
    echo "✅ Firewall configured"
else
    echo "⚠️ UFW not available, skipping firewall configuration"
fi

# Create systemd service for automatic startup
echo "🔄 Creating systemd service..."
sudo tee /etc/systemd/system/task-manager.service > /dev/null << EOF
[Unit]
Description=Task Manager Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$APP_DIR
ExecStart=/usr/local/bin/docker-compose -f docker-compose.$ENVIRONMENT.yml --env-file .env.$ENVIRONMENT up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.$ENVIRONMENT.yml --env-file .env.$ENVIRONMENT down
User=$USER
Group=$USER

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable task-manager.service
echo "✅ Systemd service created and enabled"

# Set file permissions
echo "🔒 Setting file permissions..."
chmod +x scripts/*.sh
chmod 600 ".env.$ENVIRONMENT"
echo "✅ File permissions set"

echo ""
echo "🎉 Setup completed successfully!"
echo "========================================"
echo "Next steps:"
echo "1. Review and update the environment file: $ENV_FILE"
echo "2. Update domain names in docker-compose.$ENVIRONMENT.yml"
echo "3. Set up SSL certificates (recommended: Let's Encrypt with Traefik)"
echo "4. Deploy the application: ./scripts/deploy.sh $ENVIRONMENT"
echo "5. Run health check: ./scripts/health-check.sh $ENVIRONMENT"
echo ""
echo "📋 Important files:"
echo "- Environment: $ENV_FILE"
echo "- Compose: docker-compose.$ENVIRONMENT.yml"
echo "- Logs: /var/log/task-manager-monitor.log"
echo "- Backups: $APP_DIR/backups/"
echo ""
echo "🔧 Useful commands:"
echo "- Deploy: ./scripts/deploy.sh $ENVIRONMENT"
echo "- Health check: ./scripts/health-check.sh $ENVIRONMENT"
echo "- View logs: docker-compose logs -f"
echo "- Backup database: ./scripts/backup.sh"
echo ""
echo "⚠️ Remember to:"
echo "- Update GitHub repository name in environment file"
echo "- Configure your domain DNS to point to this server"
echo "- Set up SSL certificates for HTTPS"
echo "- Review and test the backup/restore process"