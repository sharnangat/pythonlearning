# Roles API - Quick PowerShell Reference
# Copy and paste these commands to test the Roles API

$API_URL = "http://localhost:3000/api"

# ============================================
# 1. CREATE ROLE (POST)
# ============================================

# Minimal - Required fields only
$body = @{
    role_name = "admin"
    display_name = "Administrator"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/roles" -Method Post -Body $body -ContentType "application/json"

# Full example
$body = @{
    role_name = "admin"
    display_name = "Administrator"
    description = "Full system administrator with all permissions"
    hierarchy_level = 1
    is_active = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/roles" -Method Post -Body $body -ContentType "application/json"

# ============================================
# 2. GET ALL ROLES (GET)
# ============================================
Invoke-RestMethod -Uri "$API_URL/roles" -Method Get

# Pretty print
Invoke-RestMethod -Uri "$API_URL/roles" -Method Get | ConvertTo-Json -Depth 10

# ============================================
# 3. GET ACTIVE ROLES (GET)
# ============================================
Invoke-RestMethod -Uri "$API_URL/roles/active" -Method Get

# ============================================
# 4. GET ROLE BY ID (GET)
# ============================================
# Replace $roleId with actual UUID
$roleId = "uuid-here"
Invoke-RestMethod -Uri "$API_URL/roles/$roleId" -Method Get

# ============================================
# 5. UPDATE ROLE (PUT)
# ============================================
# Replace $roleId with actual UUID
$roleId = "uuid-here"
$body = @{
    display_name = "Administrator Updated"
    description = "Updated description"
    hierarchy_level = 0
    is_active = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/roles/$roleId" -Method Put -Body $body -ContentType "application/json"

# Deactivate role
$roleId = "uuid-here"
$body = @{ is_active = $false } | ConvertTo-Json
Invoke-RestMethod -Uri "$API_URL/roles/$roleId" -Method Put -Body $body -ContentType "application/json"

# ============================================
# 6. DELETE ROLE (DELETE)
# ============================================
# Replace $roleId with actual UUID
$roleId = "uuid-here"
Invoke-RestMethod -Uri "$API_URL/roles/$roleId" -Method Delete

# ============================================
# QUICK COPY-PASTE EXAMPLES
# ============================================

# Create Admin Role
$body = @{role_name="admin";display_name="Administrator";description="Full system administrator";hierarchy_level=1;is_active=$true} | ConvertTo-Json
Invoke-RestMethod -Uri "$API_URL/roles" -Method Post -Body $body -ContentType "application/json"

# Create Member Role
$body = @{role_name="member";display_name="Member";description="Regular member";hierarchy_level=5;is_active=$true} | ConvertTo-Json
Invoke-RestMethod -Uri "$API_URL/roles" -Method Post -Body $body -ContentType "application/json"

# Create Chairman Role
$body = @{role_name="chairman";display_name="Chairman";description="Society chairman";hierarchy_level=0;is_active=$true} | ConvertTo-Json
Invoke-RestMethod -Uri "$API_URL/roles" -Method Post -Body $body -ContentType "application/json"

# Create Secretary Role
$body = @{role_name="secretary";display_name="Secretary";description="Society secretary";hierarchy_level=2;is_active=$true} | ConvertTo-Json
Invoke-RestMethod -Uri "$API_URL/roles" -Method Post -Body $body -ContentType "application/json"

# Create Treasurer Role
$body = @{role_name="treasurer";display_name="Treasurer";description="Society treasurer";hierarchy_level=3;is_active=$true} | ConvertTo-Json
Invoke-RestMethod -Uri "$API_URL/roles" -Method Post -Body $body -ContentType "application/json"

