# PowerShell script for User API - Get Users
# Make sure the server is running on http://localhost:3000

Write-Host "=== User API - Get Users Examples ===" -ForegroundColor Cyan
Write-Host ""

# 1. Get All Users
Write-Host "1. Get all users..." -ForegroundColor Yellow
try {
    $allUsers = Invoke-RestMethod -Uri "http://localhost:3000/api/users" `
        -Method Get
    
    Write-Host "✓ Retrieved $($allUsers.Count) user(s)" -ForegroundColor Green
    Write-Host ""
    $allUsers | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get users" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    Write-Host ""
}

# 2. Get User by ID (example)
Write-Host "2. Get user by ID (example)..." -ForegroundColor Yellow
Write-Host "Note: Replace {id} with actual UUID" -ForegroundColor Gray
Write-Host ""
Write-Host "Example command:" -ForegroundColor Cyan
Write-Host 'Invoke-RestMethod -Uri "http://localhost:3000/api/users/{uuid-here}" -Method Get' -ForegroundColor White
Write-Host ""

# 3. Interactive: Get User by ID
Write-Host "3. Get user by ID (interactive)..." -ForegroundColor Yellow
$userId = Read-Host "Enter User ID (UUID)"
if ($userId) {
    try {
        $user = Invoke-RestMethod -Uri "http://localhost:3000/api/users/$userId" `
            -Method Get
        
        Write-Host "✓ User retrieved successfully" -ForegroundColor Green
        Write-Host ""
        $user | ConvertTo-Json -Depth 10
        Write-Host ""
    } catch {
        Write-Host "✗ Failed to get user" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "Details: $($errorDetails.message)" -ForegroundColor Yellow
        }
        Write-Host ""
    }
}

Write-Host "=== Examples completed ===" -ForegroundColor Cyan

