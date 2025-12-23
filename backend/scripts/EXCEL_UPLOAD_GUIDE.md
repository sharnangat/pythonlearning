# Excel Upload API Guide

## Endpoint

**POST** `/api/members/upload-excel`

## Description

Upload member details from an Excel file (.xlsx or .xls format). The API will parse the Excel file and create members in bulk.

## Request

### Content-Type
`multipart/form-data`

### Form Field
- `file`: Excel file (.xlsx or .xls)

### Query Parameters (Optional)
- `stopOnError` (boolean, default: `false`): If `true`, stops processing on first error
- `skipDuplicates` (boolean, default: `true`): If `true`, skips duplicate members instead of failing

### Example using cURL

```bash
curl -X POST \
  "http://localhost:3000/api/members/upload-excel?skipDuplicates=true&stopOnError=false" \
  -F "file=@members.xlsx"
```

### Example using PowerShell

```powershell
$filePath = "members.xlsx"
$uri = "http://localhost:3000/api/members/upload-excel?skipDuplicates=true&stopOnError=false"

$form = @{
    file = Get-Item -Path $filePath
}

Invoke-RestMethod -Uri $uri -Method Post -Form $form
```

## Excel File Format

### Required Columns

| Column Name | Field Name | Description | Example |
|------------|-----------|-------------|---------|
| Society ID | `society_id` | UUID of the society | `2931b673-91e5-4811-886b-f81b94607e4e` |
| Member Type | `member_type` | Type of member | `Owner`, `Tenant`, `Chairman` |
| First Name | `first_name` | Member's first name | `John` |
| Last Name | `last_name` | Member's last name | `Doe` |
| Primary Phone | `primary_phone` | Primary phone number | `+911234567890` |

### Optional Columns

| Column Name | Field Name | Description | Example |
|------------|-----------|-------------|---------|
| Middle Name | `middle_name` | Middle name | `Michael` |
| Date of Birth | `date_of_birth` | Date of birth (YYYY-MM-DD) | `1985-05-15` |
| Gender | `gender` | Gender | `Male`, `Female`, `Other` |
| Nationality | `nationality` | Nationality (default: Indian) | `Indian` |
| Secondary Phone | `secondary_phone` | Secondary phone number | `+911234567891` |
| Email | `email` | Email address | `john.doe@example.com` |
| Emergency Contact Name | `emergency_contact_name` | Emergency contact name | `Jane Doe` |
| Emergency Contact Phone | `emergency_contact_phone` | Emergency contact phone | `+911234567892` |
| Permanent Address | `permanent_address` | Permanent address | `123 Main St, Mumbai` |
| Current Address | `current_address` | Current address | `123 Main St, Mumbai` |
| Aadhar Number | `aadhar_number` | Aadhar number (12 digits) | `123456789012` |
| PAN Number | `pan_number` | PAN number (10 chars) | `ABCDE1234F` |
| Passport Number | `passport_number` | Passport number | `A1234567` |
| Occupation | `occupation` | Occupation | `Software Engineer` |
| Organization | `organization` | Organization name | `Tech Corp` |
| Designation | `designation` | Job designation | `Senior Developer` |
| Membership Number | `membership_number` | Unique membership number | `MEM-001` |
| Joining Date | `joining_date` | Joining date (YYYY-MM-DD) | `2024-01-01` |
| Leaving Date | `leaving_date` | Leaving date (YYYY-MM-DD) | `2025-12-31` |
| Is Active | `is_active` | Active status (true/false) | `true` |
| Has Voting Rights | `has_voting_rights` | Voting rights (true/false) | `true` |
| Profile Image URL | `profile_image_url` | Profile image URL | `https://example.com/image.jpg` |
| Bio | `bio` | Biography | `Member since 2024` |

### Column Name Variations

The API supports multiple column name formats:
- `Society ID`, `Society Id`, `Society_ID`, `society_id`
- `First Name`, `First_Name`, `first_name`
- `Date of Birth`, `Date_Of_Birth`, `DOB`, `date_of_birth`
- etc.

## Date Format

Dates can be provided in various formats:
- `YYYY-MM-DD` (e.g., `2024-01-15`)
- `MM/DD/YYYY` (e.g., `01/15/2024`)
- `MM-DD-YYYY` (e.g., `01-15-2024`)
- Excel serial date numbers (automatically converted)

## Boolean Values

Boolean fields (`is_active`, `has_voting_rights`) accept:
- `true`, `yes`, `1`, `y` → `true`
- `false`, `no`, `0`, `n` → `false`

## Response

### Success Response (200 or 207)

```json
{
  "message": "Excel upload processed",
  "results": {
    "total": 10,
    "successful": 8,
    "failed": 1,
    "skipped": 1,
    "created": [
      {
        "row": 2,
        "id": "uuid-here",
        "membership_number": "MEM-001",
        "name": "John Doe"
      }
    ],
    "errors": [
      {
        "row": 5,
        "error": "Valid primary phone number is required",
        "data": { ... }
      }
    ]
  }
}
```

### Error Response (400)

```json
{
  "message": "No file uploaded. Please upload an Excel file."
}
```

```json
{
  "message": "Invalid file type. Please upload an Excel file (.xlsx, .xls)"
}
```

## Error Handling

- **Parse Errors**: Rows with missing required fields are reported in `errors` array
- **Validation Errors**: Invalid data (e.g., invalid email, phone) causes the row to fail
- **Duplicate Errors**: If `skipDuplicates=true`, duplicates are skipped; otherwise they fail
- **Stop on Error**: If `stopOnError=true`, processing stops on first error

## Example Excel File Structure

```
| Society ID                          | Member Type | First Name | Last Name | Primary Phone    | Email              |
|-------------------------------------|-------------|------------|-----------|------------------|--------------------|
| 2931b673-91e5-4811-886b-f81b94607e4e | Owner      | John       | Doe       | +911234567890    | john.doe@example.com |
| 2931b673-91e5-4811-886b-f81b94607e4e | Tenant     | Jane       | Smith     | +911234567891    | jane.smith@example.com |
```

## Notes

- Maximum file size: 10MB
- Supported formats: `.xlsx`, `.xls`
- The API processes rows sequentially
- Empty rows are skipped
- All validation rules from the regular member creation API apply

