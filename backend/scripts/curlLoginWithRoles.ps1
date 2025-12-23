# Login API with Role Verification - PowerShell Script
# This script demonstrates how to login and get user role details

$API_URL = "http://localhost:3000/api"

Write-Host "=== Login API with Role Verification ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Replace email/phone and password with actual credentials" -ForegroundColor Yellow
Write-Host ""

# Example 1: Login with Email
Write-Host "=== Example 1: Login with Email ===" -ForegroundColor Cyan
Write-Host ""
$body = @{
    email = "user@example.com"
    password = "your-password"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/users/login" `
        -Method Post `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "User: $($response.user.email)" -ForegroundColor Cyan
    Write-Host "Token: $($response.token)" -ForegroundColor Cyan
    Write-Host "Roles Count: $($response.roles.Count)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Full Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Details: $($errorDetails.message)" -ForegroundColor Yellow
    }
}

Write-Host "`n"

# Example 2: Login with Phone
Write-Host "=== Example 2: Login with Phone ===" -ForegroundColor Cyan
Write-Host ""
$body = @{
    phone = "+911234567890"
    password = "your-password"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/users/login" `
        -Method Post `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "✓ Login successful!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Example 3: Extract Token
Write-Host "=== Example 3: Extract Token ===" -ForegroundColor Cyan
Write-Host ""
$body = @{
    email = "user@example.com"
    password = "your-password"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/users/login" `
        -Method Post `
        -Body $body `
        -ContentType "application/json"
    
    $token = $response.token
    Write-Host "Token: $token" -ForegroundColor Green
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Example 4: Extract Roles
Write-Host "=== Example 4: Extract Roles ===" -ForegroundColor Cyan
Write-Host ""
$body = @{
    email = "user@example.com"
    password = "your-password"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/users/login" `
        -Method Post `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "Roles:" -ForegroundColor Yellow
    foreach ($role in $response.roles) {
        Write-Host "  - $($role.role_name) ($($role.display_name))" -ForegroundColor Cyan
        Write-Host "    Society ID: $($role.society_id)" -ForegroundColor Gray
        Write-Host "    Hierarchy Level: $($role.hierarchy_level)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Example 5: Check for superAdmin Role
Write-Host "=== Example 5: Check for superAdmin Role ===" -ForegroundColor Cyan
Write-Host ""
$body = @{
    email = "user@example.com"
    password = "your-password"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/users/login" `
        -Method Post `
        -Body $body `
        -ContentType "application/json"
    
    $superAdminRole = $response.roles | Where-Object { $_.role_name -eq "superAdmin" }
    if ($superAdminRole) {
        Write-Host "✓ User has superAdmin role:" -ForegroundColor Green
        $superAdminRole | ConvertTo-Json -Depth 10
    } else {
        Write-Host "✗ User does not have superAdmin role" -ForegroundColor Yellow
        Write-Host "Available roles:" -ForegroundColor Cyan
        foreach ($role in $response.roles) {
            Write-Host "  - $($role.role_name)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"
Write-Host "=== Login examples completed ===" -ForegroundColor Green

