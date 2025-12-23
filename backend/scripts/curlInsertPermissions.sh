#!/bin/bash

# Permissions API - Insert Permissions cURL Script
# This script demonstrates how to create permissions using cURL

API_URL="http://localhost:3000/api"

echo "=== Permissions API - Create Permissions ==="
echo ""

# Users Module Permissions
echo "=== Creating Users Module Permissions ==="
echo ""

echo "Creating VIEW_USERS permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "View Users",
    "permission_code": "VIEW_USERS",
    "module": "users",
    "description": "View user list and details",
    "is_active": true
  }'

echo -e "\n\n"

echo "Creating CREATE_USERS permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "Create Users",
    "permission_code": "CREATE_USERS",
    "module": "users",
    "description": "Create new users",
    "is_active": true
  }'

echo -e "\n\n"

echo "Creating EDIT_USERS permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "Edit Users",
    "permission_code": "EDIT_USERS",
    "module": "users",
    "description": "Edit user information",
    "is_active": true
  }'

echo -e "\n\n"

echo "Creating DELETE_USERS permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "Delete Users",
    "permission_code": "DELETE_USERS",
    "module": "users",
    "description": "Delete users from system",
    "is_active": true
  }'

echo -e "\n\n"

# Societies Module Permissions
echo "=== Creating Societies Module Permissions ==="
echo ""

echo "Creating VIEW_SOCIETIES permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "View Societies",
    "permission_code": "VIEW_SOCIETIES",
    "module": "societies",
    "description": "View society list and details",
    "is_active": true
  }'

echo -e "\n\n"

echo "Creating CREATE_SOCIETIES permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "Create Societies",
    "permission_code": "CREATE_SOCIETIES",
    "module": "societies",
    "description": "Create new societies",
    "is_active": true
  }'

echo -e "\n\n"

echo "Creating EDIT_SOCIETIES permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "Edit Societies",
    "permission_code": "EDIT_SOCIETIES",
    "module": "societies",
    "description": "Edit society information",
    "is_active": true
  }'

echo -e "\n\n"

echo "Creating DELETE_SOCIETIES permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "Delete Societies",
    "permission_code": "DELETE_SOCIETIES",
    "module": "societies",
    "description": "Delete societies from system",
    "is_active": true
  }'

echo -e "\n\n"

# Members Module Permissions
echo "=== Creating Members Module Permissions ==="
echo ""

echo "Creating VIEW_MEMBERS permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "View Members",
    "permission_code": "VIEW_MEMBERS",
    "module": "members",
    "description": "View member list and details",
    "is_active": true
  }'

echo -e "\n\n"

echo "Creating CREATE_MEMBERS permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "Create Members",
    "permission_code": "CREATE_MEMBERS",
    "module": "members",
    "description": "Create new members",
    "is_active": true
  }'

echo -e "\n\n"

echo "Creating EDIT_MEMBERS permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "Edit Members",
    "permission_code": "EDIT_MEMBERS",
    "module": "members",
    "description": "Edit member information",
    "is_active": true
  }'

echo -e "\n\n"

echo "Creating DELETE_MEMBERS permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "Delete Members",
    "permission_code": "DELETE_MEMBERS",
    "module": "members",
    "description": "Delete members from system",
    "is_active": true
  }'

echo -e "\n\n"

# Assets Module Permissions
echo "=== Creating Assets Module Permissions ==="
echo ""

echo "Creating VIEW_ASSETS permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "View Assets",
    "permission_code": "VIEW_ASSETS",
    "module": "assets",
    "description": "View asset list and details",
    "is_active": true
  }'

echo -e "\n\n"

echo "Creating MANAGE_ASSETS permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "Manage Assets",
    "permission_code": "MANAGE_ASSETS",
    "module": "assets",
    "description": "Create, edit, and delete assets",
    "is_active": true
  }'

echo -e "\n\n"

# Roles Module Permissions
echo "=== Creating Roles Module Permissions ==="
echo ""

echo "Creating MANAGE_ROLES permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "Manage Roles",
    "permission_code": "MANAGE_ROLES",
    "module": "roles",
    "description": "Create, edit, and delete roles",
    "is_active": true
  }'

echo -e "\n\n"

echo "Creating ASSIGN_ROLES permission..."
curl -X POST "${API_URL}/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "permission_name": "Assign Roles",
    "permission_code": "ASSIGN_ROLES",
    "module": "roles",
    "description": "Assign roles to users",
    "is_active": true
  }'

echo -e "\n\n"

echo "=== All permissions created successfully ==="

