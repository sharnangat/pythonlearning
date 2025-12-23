# Database Setup Script for Society Management System (PowerShell)
# This script creates the database and runs the schema.sql file

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Green "========================================"
Write-ColorOutput Green "Database Setup Script"
Write-ColorOutput Green "========================================"
Write-Output ""

# Load environment variables from .env file
$envFile = Join-Path (Split-Path $PSScriptRoot -Parent) ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

# Set default values if not in .env
$DB_HOST = if ($env:DB_HOST) { $env:DB_HOST } else { "localhost" }
$DB_PORT = if ($env:DB_PORT) { $env:DB_PORT } else { "5432" }
$DB_USER = if ($env:DB_USER) { $env:DB_USER } else { "postgres" }
$DB_PASSWORD = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "postgres" }
$DB_NAME = if ($env:DB_NAME) { $env:DB_NAME } else { "soc_db" }

Write-Output "Database Configuration:"
Write-Output "  Host: $DB_HOST"
Write-Output "  Port: $DB_PORT"
Write-Output "  User: $DB_USER"
Write-Output "  Database: $DB_NAME"
Write-Output ""

# Set PGPASSWORD environment variable
$env:PGPASSWORD = $DB_PASSWORD

# Check if PostgreSQL is accessible
Write-ColorOutput Yellow "Checking PostgreSQL connection..."
try {
    $testQuery = "SELECT 1;" | psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -q 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "Error: Cannot connect to PostgreSQL server"
        Write-Output "Please ensure PostgreSQL is running and credentials are correct."
        exit 1
    }
    Write-ColorOutput Green "PostgreSQL connection successful!"
} catch {
    Write-ColorOutput Red "Error: PostgreSQL client (psql) not found"
    Write-Output "Please install PostgreSQL client tools or add psql to your PATH"
    exit 1
}
Write-Output ""

# Check if database exists
Write-ColorOutput Yellow "Checking if database '$DB_NAME' exists..."
$dbExistsQuery = "SELECT 1 FROM pg_database WHERE datname='$DB_NAME';"
$dbExists = psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -tAc $dbExistsQuery 2>&1

if ($dbExists -eq "1") {
    Write-ColorOutput Yellow "Database '$DB_NAME' already exists."
    $response = Read-Host "Do you want to drop and recreate it? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        Write-ColorOutput Yellow "Dropping existing database..."
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput Green "Database dropped."
        } else {
            Write-ColorOutput Red "Error: Failed to drop database"
            exit 1
        }
    } else {
        Write-ColorOutput Yellow "Skipping database creation."
        $skipDbCreate = $true
    }
}

# Create database if it doesn't exist
if (-not $skipDbCreate) {
    if ($dbExists -ne "1") {
        Write-ColorOutput Yellow "Creating database '$DB_NAME'..."
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;" 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput Green "Database '$DB_NAME' created successfully!"
        } else {
            Write-ColorOutput Red "Error: Failed to create database"
            exit 1
        }
    }
}

Write-Output ""

# Run schema.sql
$schemaFile = Join-Path $PSScriptRoot "schema.sql"
if (-not (Test-Path $schemaFile)) {
    Write-ColorOutput Red "Error: Schema file '$schemaFile' not found"
    exit 1
}

Write-ColorOutput Yellow "Running schema.sql to create tables..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $schemaFile

if ($LASTEXITCODE -eq 0) {
    Write-Output ""
    Write-ColorOutput Green "========================================"
    Write-ColorOutput Green "Database setup completed successfully!"
    Write-ColorOutput Green "========================================"
    Write-Output ""
    Write-Output "Database '$DB_NAME' is ready with all tables created."
    Write-Output ""
    Write-Output "Next steps:"
    Write-Output "1. Create a super admin user"
    Write-Output "2. Start your backend server"
} else {
    Write-ColorOutput Red "Error: Failed to run schema.sql"
    exit 1
}

# Clear PGPASSWORD
Remove-Item Env:\PGPASSWORD

