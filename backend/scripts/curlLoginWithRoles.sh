#!/bin/bash

# Login API with Role Verification - cURL Script
# This script demonstrates how to login and get user role details

API_URL="http://localhost:3000/api"

echo "=== Login API with Role Verification ==="
echo ""
echo "Note: Replace email/phone and password with actual credentials"
echo ""

# Example 1: Login with Email
echo "=== Example 1: Login with Email ==="
echo ""
curl -X POST "${API_URL}/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }'

echo -e "\n\n"

# Example 2: Login with Phone
echo "=== Example 2: Login with Phone ==="
echo ""
curl -X POST "${API_URL}/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+911234567890",
    "password": "your-password"
  }'

echo -e "\n\n"

# Example 3: Login and Extract Token
echo "=== Example 3: Login and Extract Token ==="
echo ""
RESPONSE=$(curl -s -X POST "${API_URL}/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.token')
echo "Token: $TOKEN"

echo -e "\n\n"

# Example 4: Login and Extract Roles
echo "=== Example 4: Login and Extract Roles ==="
echo ""
RESPONSE=$(curl -s -X POST "${API_URL}/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }')

echo "Roles:"
echo $RESPONSE | jq '.roles[] | {role_name: .role_name, display_name: .display_name, society_id: .society_id}'

echo -e "\n\n"

# Example 5: Check for superAdmin Role
echo "=== Example 5: Check for superAdmin Role ==="
echo ""
RESPONSE=$(curl -s -X POST "${API_URL}/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }')

SUPER_ADMIN=$(echo $RESPONSE | jq '.roles[] | select(.role_name == "superAdmin")')
if [ -n "$SUPER_ADMIN" ] && [ "$SUPER_ADMIN" != "null" ]; then
  echo "✓ User has superAdmin role:"
  echo $SUPER_ADMIN | jq .
else
  echo "✗ User does not have superAdmin role"
fi

echo -e "\n\n"
echo "=== Login examples completed ==="

