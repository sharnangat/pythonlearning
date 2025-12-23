require('dotenv').config();
const XLSX = require('xlsx');

// Sample data for the Excel template
const sampleData = [
  {
    'Society ID': '2931b673-91e5-4811-886b-f81b94607e4e', // Replace with actual society_id
    'Member Type': 'Owner',
    'First Name': 'John',
    'Middle Name': 'Michael',
    'Last Name': 'Doe',
    'Date of Birth': '1985-05-15',
    'Gender': 'Male',
    'Nationality': 'Indian',
    'Primary Phone': '+911234567890',
    'Secondary Phone': '+911234567891',
    'Email': 'john.doe@example.com',
    'Emergency Contact Name': 'Jane Doe',
    'Emergency Contact Phone': '+911234567892',
    'Permanent Address': '123 Main Street, Mumbai, Maharashtra 400001',
    'Current Address': '123 Main Street, Mumbai, Maharashtra 400001',
    'Aadhar Number': '123456789012',
    'PAN Number': 'ABCDE1234F',
    'Passport Number': 'A1234567',
    'Occupation': 'Software Engineer',
    'Organization': 'Tech Corp',
    'Designation': 'Senior Developer',
    'Membership Number': 'MEM-001',
    'Joining Date': '2024-01-01',
    'Leaving Date': '',
    'Is Active': 'true',
    'Has Voting Rights': 'true',
    'Profile Image URL': '',
    'Bio': 'Member since 2024',
  },
  {
    'Society ID': '2931b673-91e5-4811-886b-f81b94607e4e',
    'Member Type': 'Tenant',
    'First Name': 'Jane',
    'Middle Name': '',
    'Last Name': 'Smith',
    'Date of Birth': '1990-08-20',
    'Gender': 'Female',
    'Nationality': 'Indian',
    'Primary Phone': '+911234567893',
    'Secondary Phone': '',
    'Email': 'jane.smith@example.com',
    'Emergency Contact Name': 'John Smith',
    'Emergency Contact Phone': '+911234567894',
    'Permanent Address': '456 Park Avenue, Delhi, Delhi 110001',
    'Current Address': '456 Park Avenue, Delhi, Delhi 110001',
    'Aadhar Number': '987654321098',
    'PAN Number': 'FGHIJ5678K',
    'Passport Number': '',
    'Occupation': 'Marketing Manager',
    'Organization': 'Marketing Solutions',
    'Designation': 'Manager',
    'Membership Number': 'MEM-002',
    'Joining Date': '2024-02-15',
    'Leaving Date': '',
    'Is Active': 'true',
    'Has Voting Rights': 'false',
    'Profile Image URL': '',
    'Bio': '',
  },
  {
    'Society ID': '2931b673-91e5-4811-886b-f81b94607e4e',
    'Member Type': 'Owner',
    'First Name': 'Raj',
    'Middle Name': 'Kumar',
    'Last Name': 'Patel',
    'Date of Birth': '1978-12-10',
    'Gender': 'Male',
    'Nationality': 'Indian',
    'Primary Phone': '+911234567895',
    'Secondary Phone': '+911234567896',
    'Email': 'raj.patel@example.com',
    'Emergency Contact Name': 'Priya Patel',
    'Emergency Contact Phone': '+911234567897',
    'Permanent Address': '789 MG Road, Bangalore, Karnataka 560001',
    'Current Address': '789 MG Road, Bangalore, Karnataka 560001',
    'Aadhar Number': '112233445566',
    'PAN Number': 'KLMNO9012P',
    'Passport Number': '',
    'Occupation': 'Business Owner',
    'Organization': 'Patel Enterprises',
    'Designation': 'CEO',
    'Membership Number': 'MEM-003',
    'Joining Date': '2023-06-01',
    'Leaving Date': '',
    'Is Active': 'true',
    'Has Voting Rights': 'true',
    'Profile Image URL': '',
    'Bio': 'Founding member',
  },
];

// Create a new workbook
const workbook = XLSX.utils.book_new();

// Create worksheet from sample data
const worksheet = XLSX.utils.json_to_sheet(sampleData);

// Set column widths for better readability
const columnWidths = [
  { wch: 40 }, // Society ID
  { wch: 15 }, // Member Type
  { wch: 15 }, // First Name
  { wch: 15 }, // Middle Name
  { wch: 15 }, // Last Name
  { wch: 12 }, // Date of Birth
  { wch: 10 }, // Gender
  { wch: 12 }, // Nationality
  { wch: 18 }, // Primary Phone
  { wch: 18 }, // Secondary Phone
  { wch: 30 }, // Email
  { wch: 25 }, // Emergency Contact Name
  { wch: 22 }, // Emergency Contact Phone
  { wch: 40 }, // Permanent Address
  { wch: 40 }, // Current Address
  { wch: 15 }, // Aadhar Number
  { wch: 12 }, // PAN Number
  { wch: 18 }, // Passport Number
  { wch: 20 }, // Occupation
  { wch: 25 }, // Organization
  { wch: 20 }, // Designation
  { wch: 18 }, // Membership Number
  { wch: 12 }, // Joining Date
  { wch: 12 }, // Leaving Date
  { wch: 12 }, // Is Active
  { wch: 18 }, // Has Voting Rights
  { wch: 30 }, // Profile Image URL
  { wch: 30 }, // Bio
];

worksheet['!cols'] = columnWidths;

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');

// Write file
const outputPath = require('path').join(__dirname, 'sample_members.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log('✅ Sample Excel file created successfully!');
console.log('📁 File location:', outputPath);
console.log('\n📝 Notes:');
console.log('   - Replace the Society ID with your actual society_id UUID');
console.log('   - Modify the sample data as needed');
console.log('   - Required columns: Society ID, Member Type, First Name, Last Name, Primary Phone');
console.log('   - All other columns are optional');
console.log('\n📤 To upload:');
console.log('   npm run test-members-excel');
console.log('   or use the API endpoint: POST /api/members/upload-excel');

