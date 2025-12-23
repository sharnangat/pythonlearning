#!/bin/bash

# User Roles API - Add Role to User cURL Script
# This script demonstrates how to assign roles to users

API_URL="http://localhost:3000/api"

echo "=== User Roles API - Add Role to User ==="
echo ""
echo "NOTE: Replace the UUIDs with actual values from your database"
echo "  - user_id: UUID of the user"
echo "  - society_id: UUID of the society"
echo "  - role_id: UUID of the role (from roles table)"
echo ""

# Example 1: Add superAdmin Role to User
echo "=== Example 1: Add superAdmin Role to User ==="
echo ""
curl -X POST "${API_URL}/user-roles" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "bb553396-f631-4cb0-b810-b63ab84ada01",
    "society_id": "2931b673-91e5-4811-886b-f81b94607e4e",
    "role_id": "role-uuid-for-superAdmin",
    "assigned_by": "admin-user-uuid",
    "valid_from": "2024-01-01",
    "is_active": true
  }'

echo -e "\n\n"

# Example 2: Add Member Role to User
echo "=== Example 2: Add Member Role to User ==="
echo ""
curl -X POST "${API_URL}/user-roles" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "bb553396-f631-4cb0-b810-b63ab84ada01",
    "society_id": "2931b673-91e5-4811-886b-f81b94607e4e",
    "role_id": "role-uuid-for-member",
    "valid_from": "2024-01-01",
    "is_active": true
  }'

echo -e "\n\n"

# Example 3: Add Role with Expiry Date
echo "=== Example 3: Add Role with Expiry Date ==="
echo ""
curl -X POST "${API_URL}/user-roles" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "bb553396-f631-4cb0-b810-b63ab84ada01",
    "society_id": "2931b673-91e5-4811-886b-f81b94607e4e",
    "role_id": "role-uuid-here",
    "valid_from": "2024-01-01",
    "valid_until": "2025-12-31",
    "is_active": true
  }'

echo -e "\n\n"

# Example 4: Get All Roles for a User
echo "=== Example 4: Get All Roles for a User ==="
echo ""
USER_ID="bb553396-f631-4cb0-b810-b63ab84ada01"
curl -X GET "${API_URL}/user-roles/user/${USER_ID}"

echo -e "\n\n"

# Example 5: Get Active Roles for a User
echo "=== Example 5: Get Active Roles for a User ==="
echo ""
curl -X GET "${API_URL}/user-roles/user/${USER_ID}/active"

echo -e "\n\n"

# Example 6: Search User Roles
echo "=== Example 6: Search User Roles ==="
echo ""
curl -X GET "${API_URL}/user-roles/search?user_id=${USER_ID}&is_active=true"

echo -e "\n\n"

echo "=== Examples completed ==="
echo ""
echo "To get role IDs, run: curl -X GET ${API_URL}/roles"
echo "To get user IDs, run: curl -X GET ${API_URL}/users"
echo "To get society IDs, run: curl -X GET ${API_URL}/societies"

