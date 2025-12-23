# PowerShell script for Company Config API
# Make sure the server is running on http://localhost:3000

Write-Host "=== Company Config API cURL Examples ===" -ForegroundColor Cyan
Write-Host ""

# 1. Create Company Config
Write-Host "1. Creating company config..." -ForegroundColor Yellow
$createBody = @{
    company_name = "Society Management Solutions"
    company_email = "info@societysys.com"
    company_phone = "+911234567890"
    company_address = "123 Main Street, City, State, 12345"
    default_rate_per_member = 20.00
    currency = "INR"
    trial_period_days = 30
    max_free_members = 10
    support_email = "support@societysys.com"
    support_phone = "+911234567891"
    sales_email = "sales@societysys.com"
    sales_phone = "+911234567892"
    is_active = $true
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/company-config" `
        -Method Post `
        -Body $createBody `
        -ContentType "application/json"
    
    Write-Host "✓ Company config created successfully!" -ForegroundColor Green
    Write-Host "ID: $($createResponse.id)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "✗ Failed to create company config" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    Write-Host ""
}

# 2. Get All Company Configs
Write-Host "2. Get all company configs..." -ForegroundColor Yellow
try {
    $getAllResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/company-config" `
        -Method Get
    
    Write-Host "✓ Retrieved $($getAllResponse.Count) company config(s)" -ForegroundColor Green
    $getAllResponse | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get company configs" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 3. Get Active Company Config
Write-Host "3. Get active company config..." -ForegroundColor Yellow
try {
    $activeResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/company-config/active" `
        -Method Get
    
    Write-Host "✓ Active company config retrieved" -ForegroundColor Green
    $activeResponse | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get active company config" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 4. Update Company Config (example - requires actual ID)
Write-Host "4. Update company config (example)..." -ForegroundColor Yellow
Write-Host "Note: Replace {id} with actual UUID" -ForegroundColor Gray
Write-Host "Example: Invoke-RestMethod -Uri 'http://localhost:3000/api/company-config/{uuid}' -Method Put -Body '{...}' -ContentType 'application/json'" -ForegroundColor Gray
Write-Host ""

# 5. Delete Company Config (example - requires actual ID)
Write-Host "5. Delete company config (example)..." -ForegroundColor Yellow
Write-Host "Note: Replace {id} with actual UUID" -ForegroundColor Gray
Write-Host "Example: Invoke-RestMethod -Uri 'http://localhost:3000/api/company-config/{uuid}' -Method Delete" -ForegroundColor Gray
Write-Host ""

Write-Host "=== Examples completed ===" -ForegroundColor Cyan

