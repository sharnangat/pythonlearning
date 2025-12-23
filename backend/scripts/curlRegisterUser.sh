#!/bin/bash

# cURL command to register a new user
# Make sure the server is running on http://localhost:3000

curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "1234567890",
    "status": "pending_verification",
    "email_verified": false,
    "phone_verified": false
  }'

