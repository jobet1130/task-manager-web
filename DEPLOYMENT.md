# Task Manager - Deployment Guide

This guide covers the CI/CD pipeline and deployment process for the Task Manager application.

## 🚀 CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment with the following workflow:

### Branch Management

The CI/CD pipeline includes automated branch creation to support GitFlow workflow:

#### Automated Branch Creation

You can create new branches automatically using GitHub Actions workflow dispatch:

1. Go to **Actions** tab in your GitHub repository
2. Select **CI/CD Pipeline** workflow
3. Click **Run workflow**
4. Choose branch parameters:
   - **Branch Type**: `feature`, `hotfix`, or `release`
   - **Branch Name**: Name without prefix (e.g., "user-authentication")
   - **Base Branch**: `auto` (recommended), `master`, or `develop`

#### Branch Naming Convention

- **Feature branches**: `feature/branch-name` (created from `develop`)
- **Hotfix branches**: `hotfix/branch-name` (created from `master`)
- **Release branches**: `release/branch-name` (created from `develop`)

#### Branch Strategy

- **master**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: New features and enhancements
- **hotfix/***: Critical fixes for production
- **release/***: Preparation for production releases

### Pipeline Stages

1. **Test** - Runs on every push and pull request
   - Sets up PostgreSQL service for testing
   - Installs dependencies and runs linting
   - Performs type checking with TypeScript
   - Builds the application
   - Runs automated tests

2. **Build & Push** - Runs on pushes to `main` and `develop` branches
   - Builds Docker image
   - Pushes to DockerHub
   - Performs security scan with Trivy

3. **Deploy** - Automatic deployment based on branch
   - `develop` branch → Staging environment
   - `main` branch → Production environment

### GitHub Secrets Required

Configure these secrets in your GitHub repository:

```
DOCKERHUB_USERNAME        # DockerHub username
DOCKERHUB_TOKEN           # DockerHub access token
STAGING_HOST              # Staging server SSH host
STAGING_USERNAME          # Staging server SSH username
STAGING_SSH_KEY           # Staging server SSH private key
PRODUCTION_HOST           # Production server SSH host
PRODUCTION_USERNAME       # Production server SSH username
PRODUCTION_SSH_KEY        # Production server SSH private key
```

## 🏗️ Infrastructure Setup

### Server Requirements

- **Minimum**: 2 CPU cores, 4GB RAM, 20GB storage
- **Recommended**: 4 CPU cores, 8GB RAM, 50GB storage
- **OS**: Ubuntu 20.04+ or similar Linux distribution
- **Software**: Docker, Docker Compose

### Initial Server Setup

1. **Install Docker and Docker Compose**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Create application directory**
   ```bash
   sudo mkdir -p /opt/task-manager
   sudo chown $USER:$USER /opt/task-manager
   cd /opt/task-manager
   ```

3. **Clone repository**
   ```bash
   git clone https://github.com/your-username/task-manager-web.git .
   ```

4. **Set up environment files**
   ```bash
   # For staging
   cp .env.staging.example .env.staging
   # Edit with your actual values
   nano .env.staging
   
   # For production
   cp .env.production.example .env.production
   # Edit with your actual values
   nano .env.production
   ```

## 🔧 Manual Deployment

### Using Deployment Script

```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```

### Manual Docker Compose

```bash
# Staging deployment
docker-compose -f docker-compose.staging.yml --env-file .env.staging up -d

# Production deployment
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

## 🗃️ Database Management

### Database Creation

Before deploying the application, you need to create the required databases. The project includes scripts to automate this process:

#### Using the Creation Scripts

**For Linux/macOS:**
```bash
# Make script executable
chmod +x scripts/create-databases.sh

# Create databases with default settings (localhost)
./scripts/create-databases.sh

# Create databases with custom connection
./scripts/create-databases.sh -h your-db-host -p 5432 -U postgres -W your_password
```

**For Windows (PowerShell):**
```powershell
# Create databases with default settings
.\scripts\create-databases.ps1

# Create databases with custom connection
.\scripts\create-databases.ps1 -Hostname "your-db-host" -Port 5432 -Username "postgres" -Password "your_password"
```

#### Manual Database Creation

If you prefer to create databases manually:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create production database
CREATE DATABASE taskmanager_prod WITH OWNER = postgres ENCODING = 'UTF8';

-- Create staging database
CREATE DATABASE taskmanager_staging WITH OWNER = postgres ENCODING = 'UTF8';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE taskmanager_prod TO postgres;
GRANT ALL PRIVILEGES ON DATABASE taskmanager_staging TO postgres;
```

#### Database Configuration

The environment files are already configured with the correct database names:
- **Production**: `taskmanager_prod`
- **Staging**: `taskmanager_staging`

Ensure your PostgreSQL server is running and accessible before running the deployment scripts.

### Automated Backups

Backups are automatically created daily in production:

```bash
# Manual backup
./scripts/backup.sh

# List available backups
ls -la backups/
```

### Database Restore

```bash
# Restore from backup
./scripts/restore.sh taskmanager_backup_20231201_120000.sql.gz staging
```

### Database Migrations

The database schema is automatically initialized using `init.sql` when the PostgreSQL container starts for the first time.

## 🏥 Health Monitoring

### Health Check Script

```bash
# Check staging environment
./scripts/health-check.sh staging

# Check production environment
./scripts/health-check.sh production
```

### Monitoring Endpoints

- **Application**: `http://localhost:3000/api/health`
- **Database**: Checked via `pg_isready`

## 🔒 Security Considerations

### Environment Variables

- Never commit `.env.production` or `.env.staging` to version control
- Use strong, unique passwords for all services
- Rotate secrets regularly

### Network Security

- PostgreSQL port is not exposed in production
- Use reverse proxy (Nginx/Traefik) with SSL certificates
- Implement rate limiting and DDoS protection

### Container Security

- Images are scanned with Trivy in CI/CD pipeline
- Use non-root users in containers
- Keep base images updated

## 🌐 Domain and SSL Setup

### Using Traefik (Recommended)

1. **Install Traefik**
   ```bash
   # Create traefik directory
   mkdir -p /opt/traefik
   cd /opt/traefik
   
   # Download traefik configuration
   wget https://raw.githubusercontent.com/traefik/traefik/master/traefik.sample.yml
   ```

2. **Configure DNS**
   - Point your domain to server IP
   - Configure subdomains for staging

3. **Update Docker Compose labels**
   - Labels are already configured in `docker-compose.prod.yml`
   - Update domain names in the labels

## 📊 Logging and Monitoring

### Log Management

```bash
# View application logs
docker-compose logs -f task-manager-web

# View database logs
docker-compose logs -f postgres

# View all logs
docker-compose logs -f
```

### Performance Monitoring

- Use `docker stats` for resource monitoring
- Implement application performance monitoring (APM)
- Set up log aggregation (ELK stack, Grafana)

## 🚨 Troubleshooting

### Common Issues

1. **Container won't start**
   ```bash
   # Check logs
   docker-compose logs container-name
   
   # Check container status
   docker-compose ps
   ```

2. **Database connection issues**
   ```bash
   # Test database connectivity
   docker-compose exec postgres pg_isready -U taskmanager
   
   # Connect to database
   docker-compose exec postgres psql -U taskmanager -d taskmanager
   ```

3. **Build failures**
   ```bash
   # Rebuild without cache
   docker-compose build --no-cache
   
   # Clean up Docker system
   docker system prune -a
   ```

### Emergency Procedures

1. **Rollback deployment**
   ```bash
   # Pull previous image version
   docker pull your-dockerhub-username/task-manager:previous-tag
   
   # Update docker-compose to use previous tag
   # Restart services
   docker-compose up -d
   ```

2. **Database recovery**
   ```bash
   # Restore from latest backup
   ./scripts/restore.sh $(ls -t backups/taskmanager_backup_*.sql.gz | head -1) production
   ```

## 📞 Support

For deployment issues:

1. Check the health check script output
2. Review application and container logs
3. Verify environment configuration
4. Check server resources and disk space

⚠️ Remember to:
- Update DockerHub username in environment files
- Create DockerHub access token and add to GitHub secrets
- Configure your domain DNS to point to this server
- Set up SSL certificates for HTTPS
- Review and test the backup/restore process

## 🔄 Maintenance

### Regular Tasks

- **Weekly**: Review logs and performance metrics
- **Monthly**: Update base Docker images
- **Quarterly**: Security audit and dependency updates
- **As needed**: Backup verification and restore testing

### Updates

```bash
# Update application
git pull origin main
docker-compose pull
docker-compose up -d

# Update system packages
sudo apt update && sudo apt upgrade -y
```