#!/bin/bash

# cURL command to login a user
# Make sure the server is running on http://localhost:3000

echo "=== Login with Email ==="
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.user@example.com",
    "password": "testpassword123"
  }'

echo ""
echo ""
echo "=== Login with Phone ==="
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+911234567890",
    "password": "testpassword123"
  }'

