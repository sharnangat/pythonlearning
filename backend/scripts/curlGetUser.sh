#!/bin/bash

# cURL examples for User API - Get Users
# Make sure the server is running on http://localhost:3000

echo "=== User API - Get Users cURL Examples ==="
echo ""

# 1. Get All Users
echo "1. Get all users..."
curl -X GET http://localhost:3000/api/users

echo ""
echo ""

# 2. Get User by ID
echo "2. Get user by ID (example)..."
echo "Replace {id} with actual UUID"
echo "curl -X GET http://localhost:3000/api/users/{uuid-here}"

echo ""
echo ""

# 3. Get User by ID (with example UUID)
echo "3. Example with actual UUID (replace with your user ID)..."
echo "curl -X GET http://localhost:3000/api/users/3f5c3cea-35ab-4e3d-8be2-d0966ecb9014"

echo ""
echo ""
echo "Note: You need to replace {uuid-here} with an actual user ID from your database"

