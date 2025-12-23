require('dotenv').config();
const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Sample society data
const sampleSociety = {
  name: 'Green Valley Housing Society',
  society_type: 'Residential',
  registration_number: 'REG-2024-' + Date.now(), // Use timestamp to ensure uniqueness
  registration_date: '2024-01-15',
  established_date: '2020-05-10',
  address_line1: '123 Main Street',
  address_line2: 'Block A',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  country: 'India',
  primary_phone: '+912234567890',
  secondary_phone: '+912234567891',
  email: 'info@greenvalley.com',
  website: 'https://www.greenvalley.com',
  pan_number: 'ABCDE1234F',
  tan_number: 'TAN123456',
  gst_number: '27ABCDE1234F1Z5',
  bank_name: 'State Bank of India',
  bank_account_number: '1234567890123456',
  bank_ifsc: 'SBIN0001234',
  bank_branch: 'Mumbai Main Branch',
  total_units: 100,
  total_area_sqft: 50000.00,
  common_area_sqft: 5000.00,
  maintenance_due_day: 5,
  late_fee_percentage: 2.5,
  grace_period_days: 7,
  is_active: true,
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
      console.log('Request Body:');
      console.log(JSON.stringify(data, null, 2));
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

async function testSocietiesAPI() {
  try {
    // 1. Create society
    console.log('=== Test 1: Create Society ===');
    const createResult = await makeRequest('POST', '/societies', sampleSociety);
    
    if (!createResult.success) {
      console.log('\n✗ Failed to create society');
      return;
    }

    const registrationNumber = createResult.data.registration_number;
    console.log(`\n✓ Society created with Registration Number: ${registrationNumber}`);

    // 2. Get all societies
    console.log('\n=== Test 2: Get All Societies ===');
    await makeRequest('GET', '/societies');

    // 3. Get society by registration number
    console.log('\n=== Test 3: Get Society by Registration Number ===');
    await makeRequest('GET', `/societies/${registrationNumber}`);

    // 4. Get active societies
    console.log('\n=== Test 4: Get Active Societies ===');
    await makeRequest('GET', '/societies/active');

    // 5. Get societies by state
    console.log('\n=== Test 5: Get Societies by State ===');
    await makeRequest('GET', '/societies/state/Maharashtra');

    // 6. Update society
    console.log('\n=== Test 6: Update Society ===');
    const updateData = {
      name: 'Green Valley Housing Society Updated',
      total_units: 120,
      maintenance_due_day: 10,
    };
    await makeRequest('PUT', `/societies/${registrationNumber}`, updateData);

    // 7. Delete society (optional - comment out if you want to keep the data)
    // console.log('\n=== Test 7: Delete Society ===');
    // await makeRequest('DELETE', `/societies/${registrationNumber}`);

    console.log('\n✓ All tests completed!');
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error('Make sure the server is running on port 3000');
    process.exit(1);
  }
}

testSocietiesAPI();

