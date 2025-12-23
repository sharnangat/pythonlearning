#!/bin/bash

# Database Setup Script for Society Management System
# This script creates the database and runs the schema.sql file

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables from .env file
if [ -f "../.env" ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
elif [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${YELLOW}Warning: .env file not found. Using default values.${NC}"
    DB_HOST=${DB_HOST:-localhost}
    DB_PORT=${DB_PORT:-5432}
    DB_USER=${DB_USER:-postgres}
    DB_PASSWORD=${DB_PASSWORD:-postgres}
    DB_NAME=${DB_NAME:-soc_db}
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Database Setup Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  User: $DB_USER"
echo "  Database: $DB_NAME"
echo ""

# Set PGPASSWORD environment variable
export PGPASSWORD=$DB_PASSWORD

# Check if PostgreSQL is accessible
echo -e "${YELLOW}Checking PostgreSQL connection...${NC}"
if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c '\q' 2>/dev/null; then
    echo -e "${RED}Error: Cannot connect to PostgreSQL server${NC}"
    echo "Please ensure PostgreSQL is running and credentials are correct."
    exit 1
fi
echo -e "${GREEN}PostgreSQL connection successful!${NC}"
echo ""

# Check if database exists
echo -e "${YELLOW}Checking if database '$DB_NAME' exists...${NC}"
DB_EXISTS=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$DB_EXISTS" = "1" ]; then
    echo -e "${YELLOW}Database '$DB_NAME' already exists.${NC}"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Dropping existing database...${NC}"
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
        echo -e "${GREEN}Database dropped.${NC}"
    else
        echo -e "${YELLOW}Skipping database creation.${NC}"
        SKIP_DB_CREATE=true
    fi
fi

# Create database if it doesn't exist
if [ "$SKIP_DB_CREATE" != "true" ]; then
    if [ "$DB_EXISTS" != "1" ]; then
        echo -e "${YELLOW}Creating database '$DB_NAME'...${NC}"
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Database '$DB_NAME' created successfully!${NC}"
        else
            echo -e "${RED}Error: Failed to create database${NC}"
            exit 1
        fi
    fi
fi

echo ""

# Run schema.sql
SCHEMA_FILE="schema.sql"
if [ ! -f "$SCHEMA_FILE" ]; then
    echo -e "${RED}Error: Schema file '$SCHEMA_FILE' not found${NC}"
    exit 1
fi

echo -e "${YELLOW}Running schema.sql to create tables...${NC}"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SCHEMA_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Database setup completed successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "Database '$DB_NAME' is ready with all tables created."
    echo ""
    echo "Next steps:"
    echo "1. Create a super admin user"
    echo "2. Start your backend server"
else
    echo -e "${RED}Error: Failed to run schema.sql${NC}"
    exit 1
fi

# Unset PGPASSWORD
unset PGPASSWORD

