require('dotenv').config();
const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Test login with phone number
const loginWithPhone = {
  phone: '1234567890', // Use the phone from the test user
  password: 'testpassword123',
};

// Test login with email (for comparison)
const loginWithEmail = {
  email: 'test.user@example.com',
  password: 'testpassword123',
};

function loginUser(loginData, testName) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(loginData);
    const url = new URL(`${API_BASE_URL}/login`);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    console.log(`\n=== ${testName} ===`);
    console.log(`URL: ${API_BASE_URL}/login`);
    console.log(`Method: POST`);
    console.log('Request Body:');
    console.log(JSON.stringify({ ...loginData, password: '***MASKED***' }, null, 2));
    console.log('\nSending request...\n');

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✓ Login Successful!');
            console.log(`Status Code: ${res.statusCode}`);
            console.log('\nResponse:');
            console.log(JSON.stringify({
              user: {
                id: parsed.user?.id,
                email: parsed.user?.email,
                phone: parsed.user?.phone,
              },
              token: parsed.token ? parsed.token.substring(0, 50) + '...' : 'N/A'
            }, null, 2));
            console.log(`\n✓ User ID: ${parsed.user?.id || 'N/A'}`);
            console.log(`✓ Email: ${parsed.user?.email || 'N/A'}`);
            console.log(`✓ Phone: ${parsed.user?.phone || 'N/A'}`);
            resolve({ success: true, data: parsed, statusCode: res.statusCode });
          } else {
            console.log('✗ Login Failed');
            console.log(`Status Code: ${res.statusCode}`);
            console.log('Error:', parsed.message || data);
            resolve({ success: false, error: parsed.message || data, statusCode: res.statusCode });
          }
        } catch (e) {
          console.log('✗ Login Failed');
          console.log(`Status Code: ${res.statusCode}`);
          console.log('Response:', data);
          resolve({ success: false, error: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      console.error('✗ Request Error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Run both tests
async function runTests() {
  console.log('========================================');
  console.log('Testing Login with Email and Phone');
  console.log('========================================');
  
  // Test 1: Login with Email
  const emailResult = await loginUser(loginWithEmail, 'Test 1: Login with Email');
  
  if (!emailResult.success) {
    console.log('\n⚠️  Email login failed. Make sure user exists with email: test.user@example.com');
  }
  
  // Wait a bit between requests
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 2: Login with Phone
  const phoneResult = await loginUser(loginWithPhone, 'Test 2: Login with Phone');
  
  if (!phoneResult.success) {
    console.log('\n⚠️  Phone login failed. Make sure user exists with phone: 1234567890');
  }
  
  // Summary
  console.log('\n========================================');
  console.log('Test Summary');
  console.log('========================================');
  console.log(`Email Login: ${emailResult.success ? '✓ PASSED' : '✗ FAILED'}`);
  console.log(`Phone Login: ${phoneResult.success ? '✓ PASSED' : '✗ FAILED'}`);
  
  if (emailResult.success && phoneResult.success) {
    console.log('\n✓ Both login methods work correctly!');
    process.exit(0);
  } else {
    console.log('\n✗ Some tests failed. Check the errors above.');
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('\n✗ Error:', error.message);
  console.error('Make sure the server is running on port 3000');
  process.exit(1);
});

