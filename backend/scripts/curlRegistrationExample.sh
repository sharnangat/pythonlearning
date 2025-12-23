#!/bin/bash

# Sample cURL command to register a user via API
# Make sure the server is running on http://localhost:3000

curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user_01",
    "email": "test.user@example.com",
    "password": "testpassword123",
    "first_name": "Test",
    "last_name": "User",
    "phone": "1234567890",
    "status": "pending_verification",
    "email_verified": false,
    "phone_verified": false
  }'


