const XLSX = require('xlsx');
const membersService = require('./membersService');
const logger = require('../config/logger');

// Map Excel column names to member fields
const columnMapping = {
  'Society ID': 'society_id',
  'Society Id': 'society_id',
  'Society_ID': 'society_id',
  'society_id': 'society_id',
  'Member Type': 'member_type',
  'Member_Type': 'member_type',
  'member_type': 'member_type',
  'First Name': 'first_name',
  'First_Name': 'first_name',
  'first_name': 'first_name',
  'Middle Name': 'middle_name',
  'Middle_Name': 'middle_name',
  'middle_name': 'middle_name',
  'Last Name': 'last_name',
  'Last_Name': 'last_name',
  'last_name': 'last_name',
  'Date of Birth': 'date_of_birth',
  'Date_Of_Birth': 'date_of_birth',
  'DOB': 'date_of_birth',
  'date_of_birth': 'date_of_birth',
  'Gender': 'gender',
  'gender': 'gender',
  'Nationality': 'nationality',
  'nationality': 'nationality',
  'Primary Phone': 'primary_phone',
  'Primary_Phone': 'primary_phone',
  'primary_phone': 'primary_phone',
  'Phone': 'primary_phone',
  'Secondary Phone': 'secondary_phone',
  'Secondary_Phone': 'secondary_phone',
  'secondary_phone': 'secondary_phone',
  'Email': 'email',
  'email': 'email',
  'Emergency Contact Name': 'emergency_contact_name',
  'Emergency_Contact_Name': 'emergency_contact_name',
  'emergency_contact_name': 'emergency_contact_name',
  'Emergency Contact Phone': 'emergency_contact_phone',
  'Emergency_Contact_Phone': 'emergency_contact_phone',
  'emergency_contact_phone': 'emergency_contact_phone',
  'Permanent Address': 'permanent_address',
  'Permanent_Address': 'permanent_address',
  'permanent_address': 'permanent_address',
  'Current Address': 'current_address',
  'Current_Address': 'current_address',
  'current_address': 'current_address',
  'Aadhar Number': 'aadhar_number',
  'Aadhar_Number': 'aadhar_number',
  'Aadhar': 'aadhar_number',
  'aadhar_number': 'aadhar_number',
  'PAN Number': 'pan_number',
  'PAN_Number': 'pan_number',
  'PAN': 'pan_number',
  'pan_number': 'pan_number',
  'Passport Number': 'passport_number',
  'Passport_Number': 'passport_number',
  'passport_number': 'passport_number',
  'Occupation': 'occupation',
  'occupation': 'occupation',
  'Organization': 'organization',
  'organization': 'organization',
  'Designation': 'designation',
  'designation': 'designation',
  'Membership Number': 'membership_number',
  'Membership_Number': 'membership_number',
  'membership_number': 'membership_number',
  'Joining Date': 'joining_date',
  'Joining_Date': 'joining_date',
  'joining_date': 'joining_date',
  'Leaving Date': 'leaving_date',
  'Leaving_Date': 'leaving_date',
  'leaving_date': 'leaving_date',
  'Is Active': 'is_active',
  'Is_Active': 'is_active',
  'is_active': 'is_active',
  'Has Voting Rights': 'has_voting_rights',
  'Has_Voting_Rights': 'has_voting_rights',
  'has_voting_rights': 'has_voting_rights',
  'Profile Image URL': 'profile_image_url',
  'Profile_Image_URL': 'profile_image_url',
  'profile_image_url': 'profile_image_url',
  'Bio': 'bio',
  'bio': 'bio',
};

// Normalize Excel column name to standard format
const normalizeColumnName = (colName) => {
  if (!colName) return null;
  return String(colName).trim();
};

// Convert Excel value to appropriate type
const convertValue = (value, fieldName) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // Convert to string and trim
  const strValue = String(value).trim();
  if (strValue === '') {
    return null;
  }

  // Handle boolean fields
  if (fieldName === 'is_active' || fieldName === 'has_voting_rights') {
    if (typeof value === 'boolean') return value;
    const lower = strValue.toLowerCase();
    return lower === 'true' || lower === 'yes' || lower === '1' || lower === 'y';
  }

  // Handle date fields - Excel dates are numbers, convert to YYYY-MM-DD
  if (fieldName === 'date_of_birth' || fieldName === 'joining_date' || fieldName === 'leaving_date') {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    // Check if it's an Excel serial date (number)
    if (typeof value === 'number') {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + value * 86400000);
      return date.toISOString().split('T')[0];
    }
    // Try to parse as date string
    if (typeof strValue === 'string') {
      const date = new Date(strValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      // Try common date formats
      const dateFormats = [
        /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
        /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
        /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
        /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
      ];
      for (const format of dateFormats) {
        if (format.test(strValue)) {
          const parsed = new Date(strValue);
          if (!isNaN(parsed.getTime())) {
            return parsed.toISOString().split('T')[0];
          }
        }
      }
    }
    return strValue; // Return as-is if can't parse
  }

  return strValue;
};

// Parse Excel file and return array of member data
const parseExcelFile = (fileBuffer) => {
  try {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    if (!data || data.length === 0) {
      throw new Error('Excel file is empty or has no data');
    }

    const members = [];
    const errors = [];

    data.forEach((row, index) => {
      const rowNum = index + 2; // +2 because Excel rows start at 1 and we have header
      const memberData = {};
      const rowErrors = [];

      // Map Excel columns to member fields
      Object.keys(row).forEach((excelCol) => {
        const normalizedCol = normalizeColumnName(excelCol);
        const fieldName = columnMapping[normalizedCol];

        if (fieldName) {
          const value = convertValue(row[excelCol], fieldName);
          memberData[fieldName] = value;
        }
      });

      // Validate required fields
      if (!memberData.society_id) {
        rowErrors.push('society_id is required');
      }
      if (!memberData.first_name) {
        rowErrors.push('first_name is required');
      }
      if (!memberData.last_name) {
        rowErrors.push('last_name is required');
      }
      if (!memberData.primary_phone) {
        rowErrors.push('primary_phone is required');
      }
      if (!memberData.member_type) {
        rowErrors.push('member_type is required');
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: rowNum,
          errors: rowErrors,
          data: memberData,
        });
      } else {
        members.push(memberData);
      }
    });

    return { members, errors };
  } catch (error) {
    logger.error('Error parsing Excel file', { error: error.message, stack: error.stack });
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
};

// Upload members from Excel file
const uploadMembersFromExcel = async (fileBuffer, options = {}) => {
  const { stopOnError = false, skipDuplicates = true } = options;

  logger.info('Starting Excel upload', { options });

  // Parse Excel file
  const { members, errors: parseErrors } = parseExcelFile(fileBuffer);

  if (parseErrors.length > 0) {
    logger.warn('Excel parsing errors found', { errorCount: parseErrors.length });
  }

  const results = {
    total: members.length,
    successful: 0,
    failed: 0,
    skipped: 0,
    errors: [...parseErrors],
    created: [],
  };

  // Process each member
  for (let i = 0; i < members.length; i++) {
    const memberData = members[i];
    const rowNum = i + 2 + parseErrors.length; // Account for header and skipped rows

    try {
      const member = await membersService.createMember(memberData);
      results.successful++;
      results.created.push({
        row: rowNum,
        id: member.id,
        membership_number: member.membership_number,
        name: `${member.first_name} ${member.last_name}`,
      });
      logger.info('Member created from Excel', {
        row: rowNum,
        id: member.id,
        membership_number: member.membership_number,
      });
    } catch (error) {
      results.failed++;
      const errorInfo = {
        row: rowNum,
        error: error.message,
        data: memberData,
      };

      // Check if it's a duplicate error
      if (
        skipDuplicates &&
        (error.message.includes('already exists') ||
          error.message.includes('duplicate') ||
          error.message.includes('unique'))
      ) {
        results.skipped++;
        errorInfo.skipped = true;
        logger.warn('Skipped duplicate member', errorInfo);
      } else {
        results.errors.push(errorInfo);
        logger.error('Failed to create member from Excel', errorInfo);
      }

      if (stopOnError && !errorInfo.skipped) {
        throw error;
      }
    }
  }

  logger.info('Excel upload completed', results);
  return results;
};

module.exports = {
  uploadMembersFromExcel,
  parseExcelFile,
};

