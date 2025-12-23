#!/bin/bash

# cURL examples for Company Config API
# Make sure the server is running on http://localhost:3000

echo "=== Company Config API cURL Examples ==="
echo ""

# 1. Create Company Config
echo "1. Creating company config..."
curl -X POST http://localhost:3000/api/company-config \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Society Management Solutions",
    "company_email": "info@societysys.com",
    "company_phone": "+911234567890",
    "company_address": "123 Main Street, City, State, 12345",
    "default_rate_per_member": 20.00,
    "currency": "INR",
    "trial_period_days": 30,
    "max_free_members": 10,
    "support_email": "support@societysys.com",
    "support_phone": "+911234567891",
    "sales_email": "sales@societysys.com",
    "sales_phone": "+911234567892",
    "is_active": true
  }'

echo ""
echo ""

# 2. Get All Company Configs
echo "2. Get all company configs..."
curl -X GET http://localhost:3000/api/company-config

echo ""
echo ""

# 3. Get Active Company Config
echo "3. Get active company config..."
curl -X GET http://localhost:3000/api/company-config/active

echo ""
echo ""
echo "Note: Replace {id} with actual UUID for GET/PUT/DELETE by ID"
echo "Example: curl -X GET http://localhost:3000/api/company-config/{uuid-here}"
