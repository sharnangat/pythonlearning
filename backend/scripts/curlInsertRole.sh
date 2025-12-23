#!/bin/bash

# Roles API - Insert Role cURL Script
# This script demonstrates how to create a role using cURL

API_URL="http://localhost:3000/api"

echo "=== Roles API - Create Role ==="
echo ""

# Example 1: Create Admin Role
echo "Creating Admin Role..."
curl -X POST "${API_URL}/roles" \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "admin",
    "display_name": "Administrator",
    "description": "Full system administrator with all permissions",
    "hierarchy_level": 1,
    "is_active": true
  }'

echo -e "\n\n"

# Example 2: Create Member Role
echo "Creating Member Role..."
curl -X POST "${API_URL}/roles" \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "member",
    "display_name": "Member",
    "description": "Regular member with basic permissions",
    "hierarchy_level": 5,
    "is_active": true
  }'

echo -e "\n\n"

# Example 3: Create Chairman Role
echo "Creating Chairman Role..."
curl -X POST "${API_URL}/roles" \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "chairman",
    "display_name": "Chairman",
    "description": "Society chairman with highest authority",
    "hierarchy_level": 0,
    "is_active": true
  }'

echo -e "\n\n"

# Example 4: Create Secretary Role
echo "Creating Secretary Role..."
curl -X POST "${API_URL}/roles" \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "secretary",
    "display_name": "Secretary",
    "description": "Society secretary with administrative permissions",
    "hierarchy_level": 2,
    "is_active": true
  }'

echo -e "\n\n"

# Example 5: Create Treasurer Role
echo "Creating Treasurer Role..."
curl -X POST "${API_URL}/roles" \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "treasurer",
    "display_name": "Treasurer",
    "description": "Society treasurer responsible for finances",
    "hierarchy_level": 3,
    "is_active": true
  }'

echo -e "\n\n"

echo "=== All roles created successfully ==="
