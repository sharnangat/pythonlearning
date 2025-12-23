#!/bin/bash

# cURL examples for Societies API
# Make sure the server is running on http://localhost:3000

echo "=== Societies API cURL Examples ==="
echo ""

# 1. Create Society
echo "1. Creating society..."
curl -X POST http://localhost:3000/api/societies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Green Valley Housing Society",
    "society_type": "Residential",
    "registration_number": "REG-2024-001",
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

# 2. Get All Societies
echo "2. Get all societies..."
curl -X GET http://localhost:3000/api/societies

echo ""
echo ""

# 3. Get Active Societies
echo "3. Get active societies..."
curl -X GET http://localhost:3000/api/societies/active

echo ""
echo ""

# 4. Get Societies by State
echo "4. Get societies by state (Maharashtra)..."
curl -X GET http://localhost:3000/api/societies/state/Maharashtra

echo ""
echo ""
echo "Note: Replace {id} with actual UUID for GET/PUT/DELETE by ID"
echo "Example: curl -X GET http://localhost:3000/api/societies/{uuid-here}"
