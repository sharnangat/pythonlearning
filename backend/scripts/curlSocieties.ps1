# PowerShell script for Societies API
# Make sure the server is running on http://localhost:3000

Write-Host "=== Societies API cURL Examples ===" -ForegroundColor Cyan
Write-Host ""

# 1. Create Society
Write-Host "1. Creating society..." -ForegroundColor Yellow
$createBody = @{
    name = "Green Valley Housing Society"
    society_type = "Residential"
    registration_number = "REG-2024-001"
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
    $createResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/societies" `
        -Method Post `
        -Body $createBody `
        -ContentType "application/json"
    
    Write-Host "✓ Society created successfully!" -ForegroundColor Green
    Write-Host "ID: $($createResponse.id)" -ForegroundColor Cyan
    Write-Host "Name: $($createResponse.name)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "✗ Failed to create society" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    Write-Host ""
}

# 2. Get All Societies
Write-Host "2. Get all societies..." -ForegroundColor Yellow
try {
    $getAllResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/societies" `
        -Method Get
    
    Write-Host "✓ Retrieved $($getAllResponse.Count) society/societies" -ForegroundColor Green
    $getAllResponse | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get societies" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 3. Get Active Societies
Write-Host "3. Get active societies..." -ForegroundColor Yellow
try {
    $activeResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/societies/active" `
        -Method Get
    
    Write-Host "✓ Active societies retrieved" -ForegroundColor Green
    $activeResponse | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get active societies" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 4. Get Societies by State
Write-Host "4. Get societies by state (Maharashtra)..." -ForegroundColor Yellow
try {
    $stateResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/societies/state/Maharashtra" `
        -Method Get
    
    Write-Host "✓ Societies by state retrieved" -ForegroundColor Green
    $stateResponse | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get societies by state" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 5. Update Society (example - requires actual ID)
Write-Host "5. Update society (example)..." -ForegroundColor Yellow
Write-Host "Note: Replace {id} with actual UUID" -ForegroundColor Gray
Write-Host "Example: Invoke-RestMethod -Uri 'http://localhost:3000/api/societies/{uuid}' -Method Put -Body '{...}' -ContentType 'application/json'" -ForegroundColor Gray
Write-Host ""

# 6. Delete Society (example - requires actual ID)
Write-Host "6. Delete society (example)..." -ForegroundColor Yellow
Write-Host "Note: Replace {id} with actual UUID" -ForegroundColor Gray
Write-Host "Example: Invoke-RestMethod -Uri 'http://localhost:3000/api/societies/{uuid}' -Method Delete" -ForegroundColor Gray
Write-Host ""

Write-Host "=== Examples completed ===" -ForegroundColor Cyan

