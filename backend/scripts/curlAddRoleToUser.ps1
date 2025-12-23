# User Roles API - Add Role to User PowerShell Script
# This script demonstrates how to assign roles to users

$API_URL = "http://localhost:3000/api"

Write-Host "=== User Roles API - Add Role to User ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOTE: Replace the UUIDs with actual values from your database" -ForegroundColor Yellow
Write-Host "  - user_id: UUID of the user" -ForegroundColor Yellow
Write-Host "  - society_id: UUID of the society" -ForegroundColor Yellow
Write-Host "  - role_id: UUID of the role (from roles table)" -ForegroundColor Yellow
Write-Host ""

# Example 1: Add superAdmin Role to User
Write-Host "=== Example 1: Add superAdmin Role to User ===" -ForegroundColor Cyan
Write-Host ""
$body = @{
    user_id = "bb553396-f631-4cb0-b810-b63ab84ada01"
    society_id = "2931b673-91e5-4811-886b-f81b94607e4e"
    role_id = "role-uuid-for-superAdmin"
    assigned_by = "admin-user-uuid"
    valid_from = "2024-01-01"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/user-roles" `
        -Method Post `
        -Body $body `
        -ContentType "application/json"
    Write-Host "✓ superAdmin Role assigned successfully" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed to assign role: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Details: $($errorDetails.message)" -ForegroundColor Yellow
    }
}

Write-Host "`n"

# Example 2: Add Member Role to User
Write-Host "=== Example 2: Add Member Role to User ===" -ForegroundColor Cyan
Write-Host ""
$body = @{
    user_id = "bb553396-f631-4cb0-b810-b63ab84ada01"
    society_id = "2931b673-91e5-4811-886b-f81b94607e4e"
    role_id = "role-uuid-for-member"
    valid_from = "2024-01-01"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/user-roles" `
        -Method Post `
        -Body $body `
        -ContentType "application/json"
    Write-Host "✓ Member Role assigned successfully" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed to assign role: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Details: $($errorDetails.message)" -ForegroundColor Yellow
    }
}

Write-Host "`n"

# Example 3: Add Role with Expiry Date
Write-Host "=== Example 3: Add Role with Expiry Date ===" -ForegroundColor Cyan
Write-Host ""
$body = @{
    user_id = "bb553396-f631-4cb0-b810-b63ab84ada01"
    society_id = "2931b673-91e5-4811-886b-f81b94607e4e"
    role_id = "role-uuid-here"
    valid_from = "2024-01-01"
    valid_until = "2025-12-31"
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/user-roles" `
        -Method Post `
        -Body $body `
        -ContentType "application/json"
    Write-Host "✓ Role with expiry assigned successfully" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed to assign role: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Details: $($errorDetails.message)" -ForegroundColor Yellow
    }
}

Write-Host "`n"

# Example 4: Get All Roles for a User
Write-Host "=== Example 4: Get All Roles for a User ===" -ForegroundColor Cyan
Write-Host ""
$userId = "bb553396-f631-4cb0-b810-b63ab84ada01"

try {
    $response = Invoke-RestMethod -Uri "$API_URL/user-roles/user/$userId" `
        -Method Get
    Write-Host "✓ User roles fetched successfully" -ForegroundColor Green
    Write-Host "Total roles: $($response.Count)" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed to fetch user roles: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Example 5: Get Active Roles for a User
Write-Host "=== Example 5: Get Active Roles for a User ===" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$API_URL/user-roles/user/$userId/active" `
        -Method Get
    Write-Host "✓ Active user roles fetched successfully" -ForegroundColor Green
    Write-Host "Total active roles: $($response.Count)" -ForegroundColor Cyan
    foreach ($role in $response) {
        Write-Host "  - Role ID: $($role.role_id), Society ID: $($role.society_id)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Failed to fetch active user roles: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Example 6: Search User Roles
Write-Host "=== Example 6: Search User Roles ===" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$API_URL/user-roles/search?user_id=$userId&is_active=true" `
        -Method Get
    Write-Host "✓ User roles search completed" -ForegroundColor Green
    Write-Host "Results: $($response.Count)" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed to search user roles: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"
Write-Host "=== Examples completed ===" -ForegroundColor Green
Write-Host ""
Write-Host "To get role IDs, run: Invoke-RestMethod -Uri '$API_URL/roles'" -ForegroundColor Yellow
Write-Host "To get user IDs, run: Invoke-RestMethod -Uri '$API_URL/users'" -ForegroundColor Yellow
Write-Host "To get society IDs, run: Invoke-RestMethod -Uri '$API_URL/societies'" -ForegroundColor Yellow

