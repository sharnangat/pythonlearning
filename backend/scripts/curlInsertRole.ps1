# Roles API - Insert Role PowerShell Script
# This script demonstrates how to create a role using PowerShell

$API_URL = "http://localhost:3000/api"

Write-Host "=== Roles API - Create Role ===" -ForegroundColor Cyan
Write-Host ""

# Example 1: Create Admin Role
Write-Host "Creating Admin Role..." -ForegroundColor Yellow
$adminRole = @{
    role_name = "admin"
    display_name = "Administrator"
    description = "Full system administrator with all permissions"
    hierarchy_level = 1
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/roles" `
        -Method Post `
        -Body $adminRole `
        -ContentType "application/json"
    Write-Host "✓ Admin Role created successfully" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed to create Admin Role: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Example 2: Create Member Role
Write-Host "Creating Member Role..." -ForegroundColor Yellow
$memberRole = @{
    role_name = "member"
    display_name = "Member"
    description = "Regular member with basic permissions"
    hierarchy_level = 5
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/roles" `
        -Method Post `
        -Body $memberRole `
        -ContentType "application/json"
    Write-Host "✓ Member Role created successfully" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed to create Member Role: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Example 3: Create Chairman Role
Write-Host "Creating Chairman Role..." -ForegroundColor Yellow
$chairmanRole = @{
    role_name = "chairman"
    display_name = "Chairman"
    description = "Society chairman with highest authority"
    hierarchy_level = 0
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/roles" `
        -Method Post `
        -Body $chairmanRole `
        -ContentType "application/json"
    Write-Host "✓ Chairman Role created successfully" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed to create Chairman Role: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Example 4: Create Secretary Role
Write-Host "Creating Secretary Role..." -ForegroundColor Yellow
$secretaryRole = @{
    role_name = "secretary"
    display_name = "Secretary"
    description = "Society secretary with administrative permissions"
    hierarchy_level = 2
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/roles" `
        -Method Post `
        -Body $secretaryRole `
        -ContentType "application/json"
    Write-Host "✓ Secretary Role created successfully" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed to create Secretary Role: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Example 5: Create Treasurer Role
Write-Host "Creating Treasurer Role..." -ForegroundColor Yellow
$treasurerRole = @{
    role_name = "treasurer"
    display_name = "Treasurer"
    description = "Society treasurer responsible for finances"
    hierarchy_level = 3
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/roles" `
        -Method Post `
        -Body $treasurerRole `
        -ContentType "application/json"
    Write-Host "✓ Treasurer Role created successfully" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed to create Treasurer Role: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"
Write-Host "=== All roles created successfully ===" -ForegroundColor Green
