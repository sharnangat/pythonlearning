require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Sample Excel file path (you need to create this file)
const EXCEL_FILE_PATH = path.join(__dirname, 'sample_members.xlsx');

function uploadExcelFile(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`File not found: ${filePath}`));
      return;
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const url = new URL(`${API_BASE_URL}/members/upload-excel`);
    
    // Add query parameters
    if (options.stopOnError) {
      url.searchParams.append('stopOnError', 'true');
    }
    if (options.skipDuplicates === false) {
      url.searchParams.append('skipDuplicates', 'false');
    }

    const options_http = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: 'POST',
      headers: form.getHeaders(),
    };

    const req = http.request(options_http, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    form.pipe(req);
  });
}

async function runTest() {
  console.log('=== Testing Excel Upload API ===\n');

  if (!fs.existsSync(EXCEL_FILE_PATH)) {
    console.log('❌ Excel file not found:', EXCEL_FILE_PATH);
    console.log('\n📝 Please create a sample Excel file with the following columns:');
    console.log('   - Society ID (required)');
    console.log('   - Member Type (required)');
    console.log('   - First Name (required)');
    console.log('   - Last Name (required)');
    console.log('   - Primary Phone (required)');
    console.log('   - Email (optional)');
    console.log('   - Date of Birth (optional)');
    console.log('   - Gender (optional)');
    console.log('   - Joining Date (optional)');
    console.log('   - Membership Number (optional)');
    console.log('\nSee scripts/EXCEL_UPLOAD_GUIDE.md for more details.\n');
    return;
  }

  try {
    console.log('📤 Uploading Excel file:', EXCEL_FILE_PATH);
    console.log('   Options: skipDuplicates=true, stopOnError=false\n');

    const response = await uploadExcelFile(EXCEL_FILE_PATH, {
      skipDuplicates: true,
      stopOnError: false,
    });

    console.log('📥 Response Status:', response.status);
    console.log('\n📊 Results:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.status === 200 || response.status === 207) {
      console.log('\n✅ Upload completed successfully!');
      if (response.data.results) {
        console.log(`   - Total rows: ${response.data.results.total}`);
        console.log(`   - Successful: ${response.data.results.successful}`);
        console.log(`   - Failed: ${response.data.results.failed}`);
        console.log(`   - Skipped: ${response.data.results.skipped}`);
      }
    } else {
      console.log('\n❌ Upload failed');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runTest();

