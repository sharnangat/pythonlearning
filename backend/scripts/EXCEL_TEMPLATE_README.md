# Excel Template for Member Upload

## File Location
`scripts/sample_members.xlsx`

## How to Create/Regenerate the Template

Run the following command:
```bash
npm run create-sample-excel
```

This will create/update `scripts/sample_members.xlsx` with sample data.

## Template Structure

The Excel file contains the following columns:

### Required Columns (Must be filled)
- **Society ID**: UUID of the society (e.g., `2931b673-91e5-4811-886b-f81b94607e4e`)
- **Member Type**: Type of member (e.g., `Owner`, `Tenant`, `Chairman`)
- **First Name**: Member's first name
- **Last Name**: Member's last name
- **Primary Phone**: Primary phone number (e.g., `+911234567890`)

### Optional Columns (Can be left empty)
- **Middle Name**: Middle name
- **Date of Birth**: Date in YYYY-MM-DD format (e.g., `1985-05-15`)
- **Gender**: `Male`, `Female`, or `Other`
- **Nationality**: Default is `Indian`
- **Secondary Phone**: Secondary phone number
- **Email**: Email address
- **Emergency Contact Name**: Name of emergency contact
- **Emergency Contact Phone**: Phone number of emergency contact
- **Permanent Address**: Permanent address
- **Current Address**: Current address
- **Aadhar Number**: 12-digit Aadhar number
- **PAN Number**: 10-character PAN number
- **Passport Number**: Passport number
- **Occupation**: Occupation
- **Organization**: Organization name
- **Designation**: Job designation
- **Membership Number**: Unique membership number
- **Joining Date**: Date in YYYY-MM-DD format
- **Leaving Date**: Date in YYYY-MM-DD format (leave empty if active)
- **Is Active**: `true` or `false` (default: `true`)
- **Has Voting Rights**: `true` or `false` (default: `true`)
- **Profile Image URL**: URL to profile image
- **Bio**: Biography text

## Column Name Variations Supported

The API supports multiple column name formats. You can use any of these:

| Standard Name | Alternative Names |
|--------------|-------------------|
| Society ID | `Society Id`, `Society_ID`, `society_id` |
| First Name | `First_Name`, `first_name` |
| Date of Birth | `Date_Of_Birth`, `DOB`, `date_of_birth` |
| Primary Phone | `Primary_Phone`, `primary_phone`, `Phone` |
| Is Active | `Is_Active`, `is_active` |
| Has Voting Rights | `Has_Voting_Rights`, `has_voting_rights` |

## Usage Instructions

1. **Open the template**: Open `scripts/sample_members.xlsx` in Excel or any spreadsheet application

2. **Update Society ID**: Replace the sample Society ID with your actual society UUID
   - You can get a society ID by running: `npm run test-societies`

3. **Fill in member data**: 
   - Replace the sample rows with your actual member data
   - Ensure all required columns are filled
   - Optional columns can be left empty

4. **Save the file**: Save the file (keep it as `.xlsx` format)

5. **Upload via API**:
   ```bash
   npm run test-members-excel
   ```
   
   Or use cURL:
   ```bash
   curl -X POST \
     "http://localhost:3000/api/members/upload-excel?skipDuplicates=true" \
     -F "file=@scripts/sample_members.xlsx"
   ```

## Date Format Examples

- `2024-01-15` (YYYY-MM-DD) ✅
- `01/15/2024` (MM/DD/YYYY) ✅
- `01-15-2024` (MM-DD-YYYY) ✅
- Excel serial dates are automatically converted ✅

## Boolean Values

For `Is Active` and `Has Voting Rights` columns:
- `true`, `yes`, `1`, `y` → `true`
- `false`, `no`, `0`, `n` → `false`

## Sample Data

The template includes 3 sample rows with different member types:
1. Owner member with complete information
2. Tenant member with basic information
3. Owner member with business details

You can delete these rows and add your own data.

## Validation

The API will validate:
- Required fields are present
- UUID format for Society ID
- Email format (if provided)
- Phone number format
- Date formats
- Aadhar number (12 digits if provided)
- PAN number (10 characters if provided)
- Unique membership numbers
- Unique email per society

## Error Handling

If there are errors:
- The API returns detailed error information for each failed row
- Duplicate members are skipped (if `skipDuplicates=true`)
- Processing continues even if some rows fail (unless `stopOnError=true`)

## Tips

- Keep the header row as the first row
- Don't leave empty rows between data rows
- Use consistent date formats
- Ensure phone numbers include country code (e.g., `+91` for India)
- Membership numbers must be unique
- Email addresses must be unique within the same society

