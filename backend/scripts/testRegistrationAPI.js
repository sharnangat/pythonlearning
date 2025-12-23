require('dotenv').config();
const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
const REGISTER_ENDPOINT = '/user/register';

// Sample registration request data
const sampleUser = {
  username: 'test_user_01',
  email: 'test.user@example.com',
  password: 'testpassword123',  // NOTE: Use 'password', NOT 'password_hash'
  first_name: 'Test',
  last_name: 'User',
  phone: '1234567890',
  status: 'pending_verification',
  email_verified: false,
  phone_verified: false,
};

function registerUser(userData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(userData);
    const url = new URL(`${API_BASE_URL}${REGISTER_ENDPOINT}`);
    
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

    console.log('\n=== Registration API Request ===');
    console.log(`URL: ${API_BASE_URL}${REGISTER_ENDPOINT}`);
    console.log(`Method: POST`);
    console.log('Request Body:');
    console.log(JSON.stringify(userData, null, 2));
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
            console.log('✓ Registration Successful!');
            console.log(`Status Code: ${res.statusCode}`);
            console.log('Response:');
            console.log(JSON.stringify(parsed, null, 2));
            resolve({ success: true, data: parsed, statusCode: res.statusCode });
          } else {
            console.log('✗ Registration Failed');
            console.log(`Status Code: ${res.statusCode}`);
            console.log('Error:', parsed.message || data);
            resolve({ success: false, error: parsed.message || data, statusCode: res.statusCode });
          }
        } catch (e) {
          console.log('✗ Registration Failed');
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
registerUser(sampleUser)
  .then((result) => {
    if (result.success) {
      console.log('\n✓ User registered successfully!');
      console.log(`User ID: ${result.data.id}`);
      console.log(`Email: ${result.data.email}`);
    } else {
      console.log('\n✗ Registration failed:', result.error);
    }
    process.exit(result.success ? 0 : 1);
  })
  .catch((error) => {
    console.error('\n✗ Error:', error.message);
    console.error('Make sure the server is running on port 3000');
    process.exit(1);
  });


