#!/bin/bash

# cURL command to update a member record by membership_number
# Make sure the server is running on http://localhost:3000
# NOTE: Replace {membership_number} with actual membership number from your database

echo "=== Update Member Record by Membership Number ==="
echo ""

# Example 1: Update basic fields
echo "Example 1: Update basic fields"
curl -X PUT http://localhost:3000/api/members/membership/{membership_number} \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John Updated",
    "last_name": "Doe Updated",
    "occupation": "Senior Software Engineer",
    "designation": "Tech Lead"
  }'

echo ""
echo ""

# Example 2: Update contact information
echo "Example 2: Update contact information"
curl -X PUT http://localhost:3000/api/members/membership/{membership_number} \
  -H "Content-Type: application/json" \
  -d '{
    "primary_phone": "+919876543210",
    "secondary_phone": "+919876543211",
    "email": "john.updated@example.com",
    "emergency_contact_name": "Jane Doe Updated",
    "emergency_contact_phone": "+919876543212"
  }'

echo ""
echo ""

# Example 3: Update address
echo "Example 3: Update address"
curl -X PUT http://localhost:3000/api/members/membership/{membership_number} \
  -H "Content-Type: application/json" \
  -d '{
    "permanent_address": "456 Updated Street, Mumbai, Maharashtra 400002",
    "current_address": "456 Updated Street, Mumbai, Maharashtra 400002"
  }'

echo ""
echo ""

# Example 4: Update status
echo "Example 4: Update status"
curl -X PUT http://localhost:3000/api/members/membership/{membership_number} \
  -H "Content-Type: application/json" \
  -d '{
    "is_active": false,
    "has_voting_rights": false,
    "leaving_date": "2024-12-31"
  }'
echo ""
echo ""

# Example 5: Update multiple fields at once
echo "Example 5: Update multiple fields"
curl -X PUT http://localhost:3000/api/members/membership/{membership_number} \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "middle_name": "Michael",
    "last_name": "Doe",
    "date_of_birth": "1985-05-15",
    "gender": "Male",
    "primary_phone": "+911234567890",
    "email": "john.doe@example.com",
    "occupation": "Software Engineer",
    "organization": "Tech Corp",
    "designation": "Senior Developer",
    "aadhar_number": "123456789012",
    "pan_number": "ABCDE1234F",
    "is_active": true,
    "has_voting_rights": true
  }'

echo ""
echo ""
echo "Note: Replace {membership_number} with actual membership number from your database"
echo "You can get a membership_number by running: curl -X GET http://localhost:3000/api/members"

