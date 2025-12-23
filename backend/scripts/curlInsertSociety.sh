#!/bin/bash

# cURL command to insert a society record
# Make sure the server is running on http://localhost:3000

echo "=== Insert Society Record ==="
echo ""

curl -X POST http://localhost:3000/api/societies \
  -H "Content-Type: application/json" \
  -d '{
    "registration_number": "REG-2024-001",
    "name": "Green Valley Housing Society",
    "society_type": "Residential",
    "address_line1": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "primary_phone": "+912234567890",
    "email": "info@greenvalley.com",
    "total_units": 100,
    "is_active": true
  }'

echo ""
echo ""

