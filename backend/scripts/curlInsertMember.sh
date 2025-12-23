#!/bin/bash

# cURL command to insert a member record
# Make sure the server is running on http://localhost:3000
# NOTE: Replace {society_id} with actual UUID from your database

echo "=== Insert Member Record ==="
echo ""

curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "society_id": "{society_id}",
    "member_type": "Owner",
    "first_name": "John",
    "last_name": "Doe",
    "primary_phone": "+911234567890",
    "email": "john.doe@example.com",
    "joining_date": "2024-01-01",
    "is_active": true
  }'

echo ""
echo ""
echo "Note: Replace {society_id} with actual UUID from your database"
echo "You can get a society_id by running: curl -X GET http://localhost:3000/api/societies"

