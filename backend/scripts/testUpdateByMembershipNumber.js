require('dotenv').config();
const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

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

async function testUpdateByMembershipNumber() {
  try {
    console.log('Testing Update Member by Membership Number API');
    console.log('==============================================\n');

    // Test with membership number from previous test
    const membershipNumber = 'MEM-2024-001';
    
    const updateData = {
      first_name: 'John Updated by Membership Number',
      occupation: 'Tech Lead',
      designation: 'Senior Tech Lead'
    };

    console.log(`Updating member with membership_number: ${membershipNumber}`);
    // Now we can use /members/:id route - it will detect if it's UUID or membership number
    const result = await makeRequest('PUT', `/members/${membershipNumber}`, updateData);
    
    if (result.success) {
      console.log('\n✓ Update by membership number test PASSED!');
      console.log(`Updated member: ${result.data.first_name} - ${result.data.occupation}`);
    } else {
      console.log('\n✗ Update by membership number test FAILED!');
      console.log(`Error: ${result.error}`);
      if (result.statusCode === 404) {
        console.log('\nNote: Make sure a member with this membership_number exists');
        console.log('You can check by running: npm run test-members');
      }
    }
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error('Make sure the server is running on port 3000');
    console.error('Also make sure you have restarted the server after adding the new route');
    process.exit(1);
  }
}

testUpdateByMembershipNumber();

