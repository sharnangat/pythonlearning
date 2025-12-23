require('dotenv').config();
const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Sample asset data - Note: You need a valid society_id UUID
const sampleAsset = {
  society_id: '2931b673-91e5-4811-886b-f81b94607e4e', // Replace with actual society_id from your database
  asset_code: 'AST-' + Date.now(), // Use timestamp to ensure uniqueness
  name: 'Generator Set',
  description: 'Diesel generator for backup power supply',
  category: 'Electrical Equipment',
  location: 'Basement - Generator Room',
  purchase_date: '2023-01-15',
  purchase_cost: 150000.00,
  vendor: 'ABC Generators Pvt Ltd',
  warranty_period: 24, // months
  warranty_expiry: '2025-01-15',
  depreciation_rate: 10.5,
  current_value: 135000.00,
  last_maintenance_date: '2024-11-01',
  next_maintenance_date: '2025-02-01',
  maintenance_frequency: 90, // days
  condition: 'good',
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

    const req = http.request(options, (res) => {
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

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

async function runTests() {
  console.log('NOTE: Make sure you have a valid society_id in the sampleAsset object');
  console.log('You can get a society_id by running: npm run test-societies\n');

  let createdAssetId = null;

  try {
    // Test 1: Create Asset
    console.log('=== Test 1: Create Asset ===\n');
    console.log('=== POST /assets ===');
    console.log('Request Body:');
    console.log(JSON.stringify(sampleAsset, null, 2));
    console.log('\nSending request...\n');

    const createResponse = await makeRequest('POST', '/assets', sampleAsset);
    
    if (createResponse.status === 201) {
      console.log('✓ Success! Status:', createResponse.status);
      console.log('Response:');
      console.log(JSON.stringify(createResponse.data, null, 2));
      createdAssetId = createResponse.data.id;
      console.log(`\n✓ Asset created with ID: ${createdAssetId}\n`);
    } else {
      console.log('✗ Failed! Status:', createResponse.status);
      console.log('Error:', createResponse.data.message || createResponse.data);
      console.log('\n✗ Failed to create asset');
      console.log('Make sure society_id exists in the database');
      return;
    }

    // Test 2: Get All Assets
    console.log('=== Test 2: Get All Assets ===\n');
    console.log('=== GET /assets ===\n');
    console.log('Sending request...\n');

    const getAllResponse = await makeRequest('GET', '/assets');
    
    if (getAllResponse.status === 200) {
      console.log('✓ Success! Status:', getAllResponse.status);
      console.log('Response:', JSON.stringify(getAllResponse.data, null, 2).substring(0, 500) + '...');
      console.log(`\n✓ Found ${Array.isArray(getAllResponse.data) ? getAllResponse.data.length : 0} assets\n`);
    } else {
      console.log('✗ Failed! Status:', getAllResponse.status);
      console.log('Error:', getAllResponse.data.message || getAllResponse.data);
    }

    // Test 3: Get Asset by ID
    console.log('=== Test 3: Get Asset by ID ===\n');
    console.log(`=== GET /assets/${createdAssetId} ===\n`);
    console.log('Sending request...\n');

    const getByIdResponse = await makeRequest('GET', `/assets/${createdAssetId}`);
    
    if (getByIdResponse.status === 200) {
      console.log('✓ Success! Status:', getByIdResponse.status);
      console.log('Response:');
      console.log(JSON.stringify(getByIdResponse.data, null, 2));
    } else {
      console.log('✗ Failed! Status:', getByIdResponse.status);
      console.log('Error:', getByIdResponse.data.message || getByIdResponse.data);
    }

    // Test 4: Get Active Assets
    console.log('\n=== Test 4: Get Active Assets ===\n');
    console.log('=== GET /assets/active ===\n');
    console.log('Sending request...\n');

    const getActiveResponse = await makeRequest('GET', '/assets/active');
    
    if (getActiveResponse.status === 200) {
      console.log('✓ Success! Status:', getActiveResponse.status);
      console.log(`✓ Found ${Array.isArray(getActiveResponse.data) ? getActiveResponse.data.length : 0} active assets\n`);
    } else {
      console.log('✗ Failed! Status:', getActiveResponse.status);
      console.log('Error:', getActiveResponse.data.message || getActiveResponse.data);
    }

    // Test 5: Get Assets by Society ID
    console.log('=== Test 5: Get Assets by Society ID ===\n');
    console.log(`=== GET /assets/society/${sampleAsset.society_id} ===\n`);
    console.log('Sending request...\n');

    const getBySocietyResponse = await makeRequest('GET', `/assets/society/${sampleAsset.society_id}`);
    
    if (getBySocietyResponse.status === 200) {
      console.log('✓ Success! Status:', getBySocietyResponse.status);
      console.log(`✓ Found ${Array.isArray(getBySocietyResponse.data) ? getBySocietyResponse.data.length : 0} assets for society\n`);
    } else {
      console.log('✗ Failed! Status:', getBySocietyResponse.status);
      console.log('Error:', getBySocietyResponse.data.message || getBySocietyResponse.data);
    }

    // Test 6: Get Active Assets by Society ID
    console.log('=== Test 6: Get Active Assets by Society ID ===\n');
    console.log(`=== GET /assets/society/${sampleAsset.society_id}/active ===\n`);
    console.log('Sending request...\n');

    const getActiveBySocietyResponse = await makeRequest('GET', `/assets/society/${sampleAsset.society_id}/active`);
    
    if (getActiveBySocietyResponse.status === 200) {
      console.log('✓ Success! Status:', getActiveBySocietyResponse.status);
      console.log(`✓ Found ${Array.isArray(getActiveBySocietyResponse.data) ? getActiveBySocietyResponse.data.length : 0} active assets for society\n`);
    } else {
      console.log('✗ Failed! Status:', getActiveBySocietyResponse.status);
      console.log('Error:', getActiveBySocietyResponse.data.message || getActiveBySocietyResponse.data);
    }

    // Test 7: Update Asset
    console.log('=== Test 7: Update Asset ===\n');
    console.log(`=== PUT /assets/${createdAssetId} ===`);
    const updateData = {
      name: 'Generator Set Updated',
      current_value: 120000.00,
      condition: 'excellent',
    };
    console.log('Request Body:');
    console.log(JSON.stringify(updateData, null, 2));
    console.log('\nSending request...\n');

    const updateResponse = await makeRequest('PUT', `/assets/${createdAssetId}`, updateData);
    
    if (updateResponse.status === 200) {
      console.log('✓ Success! Status:', updateResponse.status);
      console.log('Response:');
      console.log(JSON.stringify(updateResponse.data, null, 2));
    } else {
      console.log('✗ Failed! Status:', updateResponse.status);
      console.log('Error:', updateResponse.data.message || updateResponse.data);
    }

    // Test 8: Delete Asset
    console.log('\n=== Test 8: Delete Asset ===\n');
    console.log(`=== DELETE /assets/${createdAssetId} ===\n`);
    console.log('Sending request...\n');

    const deleteResponse = await makeRequest('DELETE', `/assets/${createdAssetId}`);
    
    if (deleteResponse.status === 200) {
      console.log('✓ Success! Status:', deleteResponse.status);
      console.log('Response:');
      console.log(JSON.stringify(deleteResponse.data, null, 2));
    } else {
      console.log('✗ Failed! Status:', deleteResponse.status);
      console.log('Error:', deleteResponse.data.message || deleteResponse.data);
    }

    console.log('\n✓ All tests completed!');

  } catch (error) {
    console.error('Error running tests:', error);
  }
}

runTests();

