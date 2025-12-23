require('dotenv').config();
const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Sample login request data - can use either email or phone
const loginData = {
  email: 'test.user@example.com', // Use email OR phone
  // phone: '+911234567890', // Alternative: use phone instead of email
  password: 'testpassword123',
};

function loginUser(loginData) {
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

    console.log('\n=== Login API Request ===');
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
              ...parsed,
              token: parsed.token ? parsed.token.substring(0, 50) + '...' : 'N/A'
            }, null, 2));
            console.log('\n✓ Token received (truncated in output for security)');
            console.log(`✓ User ID: ${parsed.user?.id || 'N/A'}`);
            console.log(`✓ Email: ${parsed.user?.email || 'N/A'}`);
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

// Run the test
loginUser(loginData)
  .then((result) => {
    if (result.success) {
      console.log('\n✓ Login successful!');
      console.log('Token can be used for authenticated requests');
    } else {
      console.log('\n✗ Login failed:', result.error);
      console.log('\nCommon issues:');
      console.log('- Email/phone or password is incorrect');
      console.log('- User does not exist');
      console.log('- Account may be locked');
      console.log('\nNote: You can login with either email or phone number');
    }
    process.exit(result.success ? 0 : 1);
  })
  .catch((error) => {
    console.error('\n✗ Error:', error.message);
    console.error('Make sure the server is running on port 3000');
    process.exit(1);
  });

