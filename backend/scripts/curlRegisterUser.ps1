# PowerShell script to register a new user via cURL
# Make sure the server is running on http://localhost:3000

$body = @{
    username = "john_doe"
    email = "john.doe@example.com"
    password = "password123"
    first_name = "John"
    last_name = "Doe"
    phone = "1234567890"
    status = "pending_verification"
    email_verified = $false
    phone_verified = $false
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "Registering user via API..." -ForegroundColor Cyan
Write-Host "URL: http://localhost:3000/api/user/register" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/user/register" `
        -Method Post `
        -Body $body `
        -Headers $headers `
        -ContentType "application/json"
    
    Write-Host "✓ Registration Successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "User Details:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Registration Failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

