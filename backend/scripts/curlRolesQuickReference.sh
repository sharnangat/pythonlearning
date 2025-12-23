#!/bin/bash

# Roles API - Quick cURL Reference
# Copy and paste these commands to test the Roles API

API_URL="http://localhost:3000/api"

# ============================================
# 1. CREATE ROLE (POST)
# ============================================

# Minimal - Required fields only
curl -X POST "${API_URL}/roles" \
  -H "Content-Type: application/json" \
  -d '{"role_name":"admin","display_name":"Administrator"}'

# Full example
curl -X POST "${API_URL}/roles" \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "admin",
    "display_name": "Administrator",
    "description": "Full system administrator with all permissions",
    "hierarchy_level": 1,
    "is_active": true
  }'

# ============================================
# 2. GET ALL ROLES (GET)
# ============================================
curl -X GET "${API_URL}/roles"

# Pretty print with jq (if installed)
curl -X GET "${API_URL}/roles" | jq .

# ============================================
# 3. GET ACTIVE ROLES (GET)
# ============================================
curl -X GET "${API_URL}/roles/active"

# ============================================
# 4. GET ROLE BY ID (GET)
# ============================================
# Replace {role-id} with actual UUID
curl -X GET "${API_URL}/roles/{role-id}"

# Example:
# curl -X GET "${API_URL}/roles/123e4567-e89b-12d3-a456-426614174000"

# ============================================
# 5. UPDATE ROLE (PUT)
# ============================================
# Replace {role-id} with actual UUID
curl -X PUT "${API_URL}/roles/{role-id}" \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Administrator Updated",
    "description": "Updated description",
    "hierarchy_level": 0,
    "is_active": true
  }'

# Deactivate role
curl -X PUT "${API_URL}/roles/{role-id}" \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'

# ============================================
# 6. DELETE ROLE (DELETE)
# ============================================
# Replace {role-id} with actual UUID
curl -X DELETE "${API_URL}/roles/{role-id}"

# ============================================
# QUICK COPY-PASTE EXAMPLES
# ============================================

# Create Admin Role
curl -X POST "${API_URL}/roles" -H "Content-Type: application/json" -d '{"role_name":"admin","display_name":"Administrator","description":"Full system administrator","hierarchy_level":1,"is_active":true}'

# Create Member Role
curl -X POST "${API_URL}/roles" -H "Content-Type: application/json" -d '{"role_name":"member","display_name":"Member","description":"Regular member","hierarchy_level":5,"is_active":true}'

# Create Chairman Role
curl -X POST "${API_URL}/roles" -H "Content-Type: application/json" -d '{"role_name":"chairman","display_name":"Chairman","description":"Society chairman","hierarchy_level":0,"is_active":true}'

# Create Secretary Role
curl -X POST "${API_URL}/roles" -H "Content-Type: application/json" -d '{"role_name":"secretary","display_name":"Secretary","description":"Society secretary","hierarchy_level":2,"is_active":true}'

# Create Treasurer Role
curl -X POST "${API_URL}/roles" -H "Content-Type: application/json" -d '{"role_name":"treasurer","display_name":"Treasurer","description":"Society treasurer","hierarchy_level":3,"is_active":true}'

