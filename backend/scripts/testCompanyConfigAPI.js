require('dotenv').config();
const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Sample company config data
const sampleConfig = {
  company_name: 'Society Management Solutions',
  company_email: 'info@societysys.com',
  company_phone: '+911234567890',
  company_address: '123 Main Street, City, State, 12345',
  default_rate_per_member: 20.00,
  currency: 'INR',
  trial_period_days: 30,
  max_free_members: 10,
  support_email: 'support@societysys.com',
  support_phone: '+911234567891',
  sales_email: 'sales@societysys.com',
  sales_phone: '+911234567892',
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

async function testCompanyConfigAPI() {
  try {
    // 1. Create company config
    console.log('=== Test 1: Create Company Config ===');
    const createResult = await makeRequest('POST', '/company-config', sampleConfig);
    
    if (!createResult.success) {
      console.log('\n✗ Failed to create company config');
      return;
    }

    const configId = createResult.data.id;
    console.log(`\n✓ Company config created with ID: ${configId}`);

    // 2. Get all company configs
    console.log('\n=== Test 2: Get All Company Configs ===');
    await makeRequest('GET', '/company-config');

    // 3. Get company config by ID
    console.log('\n=== Test 3: Get Company Config by ID ===');
    await makeRequest('GET', `/company-config/${configId}`);

    // 4. Get active company config
    console.log('\n=== Test 4: Get Active Company Config ===');
    await makeRequest('GET', '/company-config/active');

    // 5. Update company config
    console.log('\n=== Test 5: Update Company Config ===');
    const updateData = {
      company_name: 'Updated Society Management Solutions',
      default_rate_per_member: 25.00,
    };
    await makeRequest('PUT', `/company-config/${configId}`, updateData);

    // 6. Delete company config (optional - comment out if you want to keep the data)
    // console.log('\n=== Test 6: Delete Company Config ===');
    // await makeRequest('DELETE', `/company-config/${configId}`);

    console.log('\n✓ All tests completed!');
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error('Make sure the server is running on port 3000');
    process.exit(1);
  }
}

testCompanyConfigAPI();

