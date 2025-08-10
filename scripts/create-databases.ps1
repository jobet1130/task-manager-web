# Database creation script for Task Manager (PowerShell)
# This script creates both production and staging databases

param(
    [string]$Hostname = "localhost",
    [string]$Port = "5432",
    [string]$Username = "postgres",
    [string]$Password = "",
    [switch]$Help
)

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Show help
if ($Help) {
    Write-Host "Usage: .\create-databases.ps1 [OPTIONS]"
    Write-Host "Options:"
    Write-Host "  -Hostname HOST    PostgreSQL host (default: localhost)"
    Write-Host "  -Port PORT        PostgreSQL port (default: 5432)"
    Write-Host "  -Username USER    PostgreSQL username (default: postgres)"
    Write-Host "  -Password PASS    PostgreSQL password"
    Write-Host "  -Help             Show this help message"
    exit 0
}

# Check if psql is available
try {
    $null = Get-Command psql -ErrorAction Stop
    Write-Status "PostgreSQL client (psql) found"
} catch {
    Write-Error "PostgreSQL client (psql) not found in PATH"
    Write-Error "Please install PostgreSQL client tools or add them to your PATH"
    exit 1
}

# Set password environment variable if provided
if ($Password) {
    $env:PGPASSWORD = $Password
}

# Test connection
Write-Status "Checking PostgreSQL connection..."
try {
    $testResult = psql -h $Hostname -p $Port -U $Username -d postgres -c "SELECT 1;" 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Connection failed"
    }
    Write-Status "PostgreSQL connection successful"
} catch {
    Write-Error "Cannot connect to PostgreSQL server at $Hostname`:$Port"
    Write-Error "Please check your connection parameters and ensure PostgreSQL is running"
    exit 1
}

# Get script directory and SQL file path
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SqlFile = Join-Path $ScriptDir "create-databases.sql"

# Check if SQL file exists
if (-not (Test-Path $SqlFile)) {
    Write-Error "SQL file not found: $SqlFile"
    exit 1
}

Write-Status "Creating databases..."

# Execute the SQL script
try {
    $result = psql -h $Hostname -p $Port -U $Username -d postgres -f $SqlFile 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "SQL execution failed"
    }
    
    Write-Status "✅ Databases created successfully!"
    Write-Status "Created databases:"
    Write-Status "  - taskmanager_prod (production)"
    Write-Status "  - taskmanager_staging (staging)"
} catch {
    Write-Error "❌ Failed to create databases"
    Write-Error $result
    exit 1
}

# List created databases
Write-Status "Verifying database creation..."
try {
    $databases = psql -h $Hostname -p $Port -U $Username -d postgres -c "\l" | Select-String "taskmanager"
    $databases | ForEach-Object { Write-Host $_.Line }
} catch {
    Write-Warning "Could not verify database creation, but creation appeared successful"
}

Write-Status "Database creation completed!"
Write-Warning "Remember to update your environment files with the correct database names:"
Write-Warning "  - .env.production: POSTGRES_DB=taskmanager_prod"
Write-Warning "  - .env.staging: POSTGRES_DB=taskmanager_staging"

# Clean up
if ($Password) {
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}