require('dotenv').config();
const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Sample role data
const sampleRole = {
  role_name: 'admin_' + Date.now(), // Use timestamp to ensure uniqueness
  display_name: 'Administrator',
  description: 'Full system administrator with all permissions',
  hierarchy_level: 1,
  is_active: true,
};

const sampleRole2 = {
  role_name: 'member_' + Date.now(),
  display_name: 'Member',
  description: 'Regular member with basic permissions',
  hierarchy_level: 5,
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

async function testRolesAPI() {
  try {
    let roleId;

    // Test 1: Create role
    console.log('=== Test 1: Create Role ===');
    const createResult = await makeRequest('POST', '/roles', sampleRole);
    
    if (!createResult.success) {
      console.log('\n✗ Failed to create role');
      console.log('Error:', createResult.error);
      return;
    }

    roleId = createResult.data.id;
    console.log(`\n✓ Role created with ID: ${roleId}`);

    // Test 2: Try to create duplicate role (should fail)
    console.log('\n=== Test 2: Create Duplicate Role (Should Fail) ===');
    await makeRequest('POST', '/roles', sampleRole);

    // Test 3: Create another role
    console.log('\n=== Test 3: Create Second Role ===');
    const createResult2 = await makeRequest('POST', '/roles', sampleRole2);
    if (createResult2.success) {
      console.log(`\n✓ Second role created with ID: ${createResult2.data.id}`);
    }

    // Test 4: Get all roles
    console.log('\n=== Test 4: Get All Roles ===');
    await makeRequest('GET', '/roles');

    // Test 5: Get active roles
    console.log('\n=== Test 5: Get Active Roles ===');
    await makeRequest('GET', '/roles/active');

    // Test 6: Get role by ID
    console.log('\n=== Test 6: Get Role by ID ===');
    await makeRequest('GET', `/roles/${roleId}`);

    // Test 7: Get role with invalid ID (should fail)
    console.log('\n=== Test 7: Get Role with Invalid ID (Should Fail) ===');
    await makeRequest('GET', '/roles/invalid-uuid-id');

    // Test 8: Get role with non-existent ID (should fail)
    console.log('\n=== Test 8: Get Non-existent Role (Should Fail) ===');
    await makeRequest('GET', '/roles/00000000-0000-0000-0000-000000000000');

    // Test 9: Update role
    console.log('\n=== Test 9: Update Role ===');
    const updateData = {
      display_name: 'Administrator Updated',
      description: 'Updated description for administrator role',
      hierarchy_level: 0,
    };
    await makeRequest('PUT', `/roles/${roleId}`, updateData);

    // Test 10: Update role with invalid data (should fail)
    console.log('\n=== Test 10: Update Role with Invalid Data (Should Fail) ===');
    await makeRequest('PUT', `/roles/${roleId}`, {
      display_name: '', // Empty display name should fail
    });

    // Test 11: Update role with invalid hierarchy_level (should fail)
    console.log('\n=== Test 11: Update Role with Invalid Hierarchy Level (Should Fail) ===');
    await makeRequest('PUT', `/roles/${roleId}`, {
      hierarchy_level: 'not-a-number',
    });

    // Test 12: Update role with invalid is_active (should fail)
    console.log('\n=== Test 12: Update Role with Invalid is_active (Should Fail) ===');
    await makeRequest('PUT', `/roles/${roleId}`, {
      is_active: 'not-a-boolean',
    });

    // Test 13: Update role to inactive
    console.log('\n=== Test 13: Update Role to Inactive ===');
    await makeRequest('PUT', `/roles/${roleId}`, {
      is_active: false,
    });

    // Test 14: Verify inactive role doesn't appear in active roles
    console.log('\n=== Test 14: Verify Inactive Role Not in Active List ===');
    const activeRolesResult = await makeRequest('GET', '/roles/active');
    if (activeRolesResult.success) {
      const roleInList = activeRolesResult.data.find(r => r.id === roleId);
      if (roleInList) {
        console.log('⚠ Warning: Inactive role still appears in active roles list');
      } else {
        console.log('✓ Inactive role correctly excluded from active roles list');
      }
    }

    // Test 15: Reactivate role
    console.log('\n=== Test 15: Reactivate Role ===');
    await makeRequest('PUT', `/roles/${roleId}`, {
      is_active: true,
    });

    // Test 16: Create role with missing required fields (should fail)
    console.log('\n=== Test 16: Create Role with Missing Required Fields (Should Fail) ===');
    await makeRequest('POST', '/roles', {
      display_name: 'Test Role',
      // Missing role_name
    });

    // Test 17: Create role with missing display_name (should fail)
    console.log('\n=== Test 17: Create Role with Missing display_name (Should Fail) ===');
    await makeRequest('POST', '/roles', {
      role_name: 'test_role',
      // Missing display_name
    });

    // Test 18: Delete role
    console.log('\n=== Test 18: Delete Role ===');
    await makeRequest('DELETE', `/roles/${roleId}`);

    // Test 19: Try to get deleted role (should fail)
    console.log('\n=== Test 19: Get Deleted Role (Should Fail) ===');
    await makeRequest('GET', `/roles/${roleId}`);

    // Test 20: Try to delete non-existent role (should fail)
    console.log('\n=== Test 20: Delete Non-existent Role (Should Fail) ===');
    await makeRequest('DELETE', '/roles/00000000-0000-0000-0000-000000000000');

    // Test 21: Try to delete with invalid ID (should fail)
    console.log('\n=== Test 21: Delete Role with Invalid ID (Should Fail) ===');
    await makeRequest('DELETE', '/roles/invalid-uuid-id');

    console.log('\n✓ All tests completed!');
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error('Make sure the server is running on port 3000');
    process.exit(1);
  }
}

testRolesAPI();

