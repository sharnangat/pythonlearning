# Permissions API - Insert Permissions PowerShell Script
# This script demonstrates how to create permissions using PowerShell

$API_URL = "http://localhost:3000/api"

Write-Host "=== Permissions API - Create Permissions ===" -ForegroundColor Cyan
Write-Host ""

# Users Module Permissions
Write-Host "=== Creating Users Module Permissions ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Creating VIEW_USERS permission..." -ForegroundColor Yellow
$viewUsers = @{
    permission_name = "View Users"
    permission_code = "VIEW_USERS"
    module = "users"
    description = "View user list and details"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $viewUsers -ContentType "application/json"
    Write-Host "✓ VIEW_USERS created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

Write-Host "Creating CREATE_USERS permission..." -ForegroundColor Yellow
$createUsers = @{
    permission_name = "Create Users"
    permission_code = "CREATE_USERS"
    module = "users"
    description = "Create new users"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $createUsers -ContentType "application/json"
    Write-Host "✓ CREATE_USERS created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

Write-Host "Creating EDIT_USERS permission..." -ForegroundColor Yellow
$editUsers = @{
    permission_name = "Edit Users"
    permission_code = "EDIT_USERS"
    module = "users"
    description = "Edit user information"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $editUsers -ContentType "application/json"
    Write-Host "✓ EDIT_USERS created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

Write-Host "Creating DELETE_USERS permission..." -ForegroundColor Yellow
$deleteUsers = @{
    permission_name = "Delete Users"
    permission_code = "DELETE_USERS"
    module = "users"
    description = "Delete users from system"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $deleteUsers -ContentType "application/json"
    Write-Host "✓ DELETE_USERS created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Societies Module Permissions
Write-Host "=== Creating Societies Module Permissions ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Creating VIEW_SOCIETIES permission..." -ForegroundColor Yellow
$viewSocieties = @{
    permission_name = "View Societies"
    permission_code = "VIEW_SOCIETIES"
    module = "societies"
    description = "View society list and details"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $viewSocieties -ContentType "application/json"
    Write-Host "✓ VIEW_SOCIETIES created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

Write-Host "Creating CREATE_SOCIETIES permission..." -ForegroundColor Yellow
$createSocieties = @{
    permission_name = "Create Societies"
    permission_code = "CREATE_SOCIETIES"
    module = "societies"
    description = "Create new societies"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $createSocieties -ContentType "application/json"
    Write-Host "✓ CREATE_SOCIETIES created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

Write-Host "Creating EDIT_SOCIETIES permission..." -ForegroundColor Yellow
$editSocieties = @{
    permission_name = "Edit Societies"
    permission_code = "EDIT_SOCIETIES"
    module = "societies"
    description = "Edit society information"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $editSocieties -ContentType "application/json"
    Write-Host "✓ EDIT_SOCIETIES created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

Write-Host "Creating DELETE_SOCIETIES permission..." -ForegroundColor Yellow
$deleteSocieties = @{
    permission_name = "Delete Societies"
    permission_code = "DELETE_SOCIETIES"
    module = "societies"
    description = "Delete societies from system"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $deleteSocieties -ContentType "application/json"
    Write-Host "✓ DELETE_SOCIETIES created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Members Module Permissions
Write-Host "=== Creating Members Module Permissions ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Creating VIEW_MEMBERS permission..." -ForegroundColor Yellow
$viewMembers = @{
    permission_name = "View Members"
    permission_code = "VIEW_MEMBERS"
    module = "members"
    description = "View member list and details"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $viewMembers -ContentType "application/json"
    Write-Host "✓ VIEW_MEMBERS created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

Write-Host "Creating CREATE_MEMBERS permission..." -ForegroundColor Yellow
$createMembers = @{
    permission_name = "Create Members"
    permission_code = "CREATE_MEMBERS"
    module = "members"
    description = "Create new members"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $createMembers -ContentType "application/json"
    Write-Host "✓ CREATE_MEMBERS created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

Write-Host "Creating EDIT_MEMBERS permission..." -ForegroundColor Yellow
$editMembers = @{
    permission_name = "Edit Members"
    permission_code = "EDIT_MEMBERS"
    module = "members"
    description = "Edit member information"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $editMembers -ContentType "application/json"
    Write-Host "✓ EDIT_MEMBERS created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

Write-Host "Creating DELETE_MEMBERS permission..." -ForegroundColor Yellow
$deleteMembers = @{
    permission_name = "Delete Members"
    permission_code = "DELETE_MEMBERS"
    module = "members"
    description = "Delete members from system"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $deleteMembers -ContentType "application/json"
    Write-Host "✓ DELETE_MEMBERS created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Assets Module Permissions
Write-Host "=== Creating Assets Module Permissions ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Creating VIEW_ASSETS permission..." -ForegroundColor Yellow
$viewAssets = @{
    permission_name = "View Assets"
    permission_code = "VIEW_ASSETS"
    module = "assets"
    description = "View asset list and details"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $viewAssets -ContentType "application/json"
    Write-Host "✓ VIEW_ASSETS created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

Write-Host "Creating MANAGE_ASSETS permission..." -ForegroundColor Yellow
$manageAssets = @{
    permission_name = "Manage Assets"
    permission_code = "MANAGE_ASSETS"
    module = "assets"
    description = "Create, edit, and delete assets"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $manageAssets -ContentType "application/json"
    Write-Host "✓ MANAGE_ASSETS created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Roles Module Permissions
Write-Host "=== Creating Roles Module Permissions ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Creating MANAGE_ROLES permission..." -ForegroundColor Yellow
$manageRoles = @{
    permission_name = "Manage Roles"
    permission_code = "MANAGE_ROLES"
    module = "roles"
    description = "Create, edit, and delete roles"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $manageRoles -ContentType "application/json"
    Write-Host "✓ MANAGE_ROLES created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

Write-Host "Creating ASSIGN_ROLES permission..." -ForegroundColor Yellow
$assignRoles = @{
    permission_name = "Assign Roles"
    permission_code = "ASSIGN_ROLES"
    module = "roles"
    description = "Assign roles to users"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Post -Body $assignRoles -ContentType "application/json"
    Write-Host "✓ ASSIGN_ROLES created successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"
Write-Host "=== All permissions created successfully ===" -ForegroundColor Green

