# PowerShell script to insert a society record
# Make sure the server is running on http://localhost:3000

Write-Host "=== Insert Society Record ===" -ForegroundColor Cyan
Write-Host ""

$body = @{
    registration_number = "REG-2024-001"
    name = "Green Valley Housing Society"
    society_type = "Residential"
    address_line1 = "123 Main Street"
    city = "Mumbai"
    state = "Maharashtra"
    pincode = "400001"
    primary_phone = "+912234567890"
    email = "info@greenvalley.com"
    total_units = 100
    is_active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/societies" `
        -Method Post `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "✓ Society created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Registration Number: $($response.registration_number)" -ForegroundColor Cyan
    Write-Host "Name: $($response.name)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Full Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Failed to create society" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Details: $($errorDetails.message)" -ForegroundColor Yellow
    }
}

