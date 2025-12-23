require('dotenv').config();
const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

const updateData = {
  society_id: "2931b673-91e5-4811-886b-f81b94607e4e",
  member_type: "Cha",
  first_name: "John21",
  middle_name: "Michae1l1552",
  last_name: "Doe",
  date_of_birth: "1985-05-15",
  gender: "Male",
  nationality: "Indian",
  primary_phone: "+911234567890",
  secondary_phone: "+911234567891",
  email: "john.doe100@example.com",
  emergency_contact_name: "Jane Doe",
  emergency_contact_phone: "+911234567892",
  permanent_address: "123 Main Street, Mumbai, Maharashtra 400001",
  current_address: "123 Main Street, Mumbai, Maharashtra 400001",
  aadhar_number: "123456789012",
  pan_number: "ABCDE1234F",
  occupation: "Software Engineer",
  organization: "Tech Corp",
  designation: "Senior Developer1",
  joining_date: "2024-01-01",
  is_active: true,
  has_voting_rights: true
};

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    const url = new URL(`${API_BASE_URL}${path}`);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    console.log(`\n=== ${method} ${path} ===`);
    if (data) {
      console.log('Request Body (first few fields):');
      console.log(JSON.stringify({ 
        society_id: data.society_id,
        first_name: data.first_name,
        membership_number: 'MEM-2024-002'
      }, null, 2));
    }
    console.log('\nSending request...\n');

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✓ Success! Status: ${res.statusCode}`);
            console.log('Response:');
            console.log(JSON.stringify(parsed, null, 2));
            resolve({ success: true, data: parsed, statusCode: res.statusCode });
          } else {
            console.log(`✗ Failed! Status: ${res.statusCode}`);
            console.log('Error:', parsed.message || responseData);
            resolve({ success: false, error: parsed.message || responseData, statusCode: res.statusCode });
          }
        } catch (e) {
          console.log(`✗ Failed! Status: ${res.statusCode}`);
          console.log('Response:', responseData);
          resolve({ success: false, error: responseData, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      console.error('✗ Request Error:', error.message);
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testUpdate() {
  try {
    console.log('Testing Update Member MEM-2024-002');
    console.log('===================================\n');
    
    const result = await makeRequest('PUT', '/members/MEM-2024-002', updateData);
    
    if (result.success) {
      console.log('\n✓ Update successful!');
    } else {
      console.log('\n✗ Update failed!');
      console.log(`Status Code: ${result.statusCode}`);
      console.log(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
}

testUpdate();

