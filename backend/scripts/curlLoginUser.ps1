# PowerShell script to login a user via API
# Make sure the server is running on http://localhost:3000

Write-Host "=== Login with Email ===" -ForegroundColor Cyan
$bodyEmail = @{
    email = "test.user@example.com"
    password = "testpassword123"
} | ConvertTo-Json

Write-Host "Logging in with email..." -ForegroundColor Yellow
Write-Host "URL: http://localhost:3000/api/login" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/login" `
        -Method Post `
        -Body $bodyEmail `
        -ContentType "application/json"
    
    Write-Host "✓ Login Successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "✗ Login Failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Details: $($errorDetails.message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Login with Phone ===" -ForegroundColor Cyan
$bodyPhone = @{
    phone = "+911234567890"
    password = "testpassword123"
} | ConvertTo-Json

Write-Host "Logging in with phone..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/login" `
        -Method Post `
        -Body $bodyPhone `
        -ContentType "application/json"
    
    Write-Host "✓ Login Successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
    Write-Host "Token saved above - use this for authenticated requests" -ForegroundColor Yellow
} catch {
    Write-Host "✗ Login Failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Details: $($errorDetails.message)" -ForegroundColor Yellow
    }
}

