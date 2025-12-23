# PowerShell script to register a user via API
# Make sure the server is running on http://localhost:3000

$body = @{
    username = "test_user_01"
    email = "test.user@example.com"
    password = "testpassword123"
    first_name = "Test"
    last_name = "User"
    phone = "1234567890"
    status = "pending_verification"
    email_verified = $false
    phone_verified = $false
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "Sending registration request..."
Write-Host "URL: http://localhost:3000/api/user/register"
Write-Host "Body: $body"
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/user/register" `
        -Method Post `
        -Body $body `
        -Headers $headers `
        -ContentType "application/json"
    
    Write-Host "✓ Registration Successful!" -ForegroundColor Green
    Write-Host "Response:"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Registration Failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)"
    }
}


