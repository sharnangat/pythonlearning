# PowerShell script to update a member record
# Make sure the server is running on http://localhost:3000
# NOTE: Replace {member_id} with actual UUID from your database

Write-Host "=== Update Member Record ===" -ForegroundColor Green
Write-Host ""

# Example 1: Update basic fields
Write-Host "Example 1: Update basic fields" -ForegroundColor Yellow
$body1 = @{
    first_name = "John Updated"
    last_name = "Doe Updated"
    occupation = "Senior Software Engineer"
    designation = "Tech Lead"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/members/{member_id}" `
    -Method Put `
    -Body $body1 `
    -ContentType "application/json"

Write-Host ""

# Example 2: Update contact information
Write-Host "Example 2: Update contact information" -ForegroundColor Yellow
$body2 = @{
    primary_phone = "+919876543210"
    secondary_phone = "+919876543211"
    email = "john.updated@example.com"
    emergency_contact_name = "Jane Doe Updated"
    emergency_contact_phone = "+919876543212"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/members/{member_id}" `
    -Method Put `
    -Body $body2 `
    -ContentType "application/json"

Write-Host ""

# Example 3: Update address
Write-Host "Example 3: Update address" -ForegroundColor Yellow
$body3 = @{
    permanent_address = "456 Updated Street, Mumbai, Maharashtra 400002"
    current_address = "456 Updated Street, Mumbai, Maharashtra 400002"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/members/{member_id}" `
    -Method Put `
    -Body $body3 `
    -ContentType "application/json"

Write-Host ""

# Example 4: Update status
Write-Host "Example 4: Update status" -ForegroundColor Yellow
$body4 = @{
    is_active = $false
    has_voting_rights = $false
    leaving_date = "2024-12-31"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/members/{member_id}" `
    -Method Put `
    -Body $body4 `
    -ContentType "application/json"

Write-Host ""

# Example 5: Update multiple fields at once
Write-Host "Example 5: Update multiple fields" -ForegroundColor Yellow
$body5 = @{
    first_name = "John"
    middle_name = "Michael"
    last_name = "Doe"
    date_of_birth = "1985-05-15"
    gender = "Male"
    primary_phone = "+911234567890"
    email = "john.doe@example.com"
    occupation = "Software Engineer"
    organization = "Tech Corp"
    designation = "Senior Developer"
    is_active = $true
    has_voting_rights = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/members/{member_id}" `
    -Method Put `
    -Body $body5 `
    -ContentType "application/json"

Write-Host ""
Write-Host "Note: Replace {member_id} with actual UUID from your database" -ForegroundColor Cyan
Write-Host "You can get a member_id by running: Invoke-RestMethod -Uri 'http://localhost:3000/api/members'" -ForegroundColor Cyan

