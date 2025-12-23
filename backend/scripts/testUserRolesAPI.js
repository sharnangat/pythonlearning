require('dotenv').config();
const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Sample user role data - Note: You need valid user_id, society_id, and role_id UUIDs
const sampleUserRole = {
  user_id: '00000000-0000-0000-0000-000000000001', // Replace with actual user_id from your database
  society_id: '00000000-0000-0000-0000-000000000002', // Replace with actual society_id from your database
  role_id: '00000000-0000-0000-0000-000000000003', // Replace with actual role_id from your database
  assigned_by: '00000000-0000-0000-0000-000000000004', // Optional - Replace with actual user_id
  valid_from: '2024-01-01',
  valid_until: '2024-12-31',
  is_active: true,
};

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    const url = new URL(`${API_BASE_URL}${path}`);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + (url.search || ''),
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

async function testUserRolesAPI() {
  try {
    console.log('NOTE: Make sure you have valid user_id, society_id, and role_id UUIDs');
    console.log('You can get these by running:');
    console.log('  - npm run test-users (for user_id)');
    console.log('  - npm run test-societies (for society_id)');
    console.log('  - npm run test-roles (for role_id)\n');

    let userRoleId;

    // Test 1: Create user role with invalid user_id (should fail)
    console.log('=== Test 1: Create User Role with Invalid user_id (Should Fail) ===');
    await makeRequest('POST', '/user-roles', {
      user_id: 'invalid-uuid',
      society_id: sampleUserRole.society_id,
      role_id: sampleUserRole.role_id,
    });

    // Test 2: Create user role with non-existent user_id (should fail)
    console.log('\n=== Test 2: Create User Role with Non-existent user_id (Should Fail) ===');
    await makeRequest('POST', '/user-roles', {
      user_id: '00000000-0000-0000-0000-000000000999',
      society_id: sampleUserRole.society_id,
      role_id: sampleUserRole.role_id,
    });

    // Test 3: Create user role with non-existent society_id (should fail)
    console.log('\n=== Test 3: Create User Role with Non-existent society_id (Should Fail) ===');
    await makeRequest('POST', '/user-roles', {
      user_id: sampleUserRole.user_id,
      society_id: '00000000-0000-0000-0000-000000000999',
      role_id: sampleUserRole.role_id,
    });

    // Test 4: Create user role with non-existent role_id (should fail)
    console.log('\n=== Test 4: Create User Role with Non-existent role_id (Should Fail) ===');
    await makeRequest('POST', '/user-roles', {
      user_id: sampleUserRole.user_id,
      society_id: sampleUserRole.society_id,
      role_id: '00000000-0000-0000-0000-000000000999',
    });

    // Test 5: Create user role with missing required fields (should fail)
    console.log('\n=== Test 5: Create User Role with Missing Required Fields (Should Fail) ===');
    await makeRequest('POST', '/user-roles', {
      user_id: sampleUserRole.user_id,
      // Missing society_id and role_id
    });

    // Test 6: Create user role with invalid date range (should fail)
    console.log('\n=== Test 6: Create User Role with Invalid Date Range (Should Fail) ===');
    await makeRequest('POST', '/user-roles', {
      user_id: sampleUserRole.user_id,
      society_id: sampleUserRole.society_id,
      role_id: sampleUserRole.role_id,
      valid_from: '2024-12-31',
      valid_until: '2024-01-01', // Invalid: until < from
    });

    // Test 7: Create user role with invalid assigned_by (should fail)
    console.log('\n=== Test 7: Create User Role with Invalid assigned_by (Should Fail) ===');
    await makeRequest('POST', '/user-roles', {
      user_id: sampleUserRole.user_id,
      society_id: sampleUserRole.society_id,
      role_id: sampleUserRole.role_id,
      assigned_by: '00000000-0000-0000-0000-000000000999', // Non-existent user
    });

    // Test 8: Create user role (should succeed if IDs are valid)
    console.log('\n=== Test 8: Create User Role ===');
    const createResult = await makeRequest('POST', '/user-roles', sampleUserRole);
    
    if (!createResult.success) {
      console.log('\n✗ Failed to create user role');
      console.log('Make sure user_id, society_id, and role_id exist in the database');
      console.log('You may need to create a user, society, and role first');
      return;
    }

    userRoleId = createResult.data.id;
    console.log(`\n✓ User role created with ID: ${userRoleId}`);

    // Test 9: Try to create duplicate user role (should fail)
    console.log('\n=== Test 9: Create Duplicate User Role (Should Fail) ===');
    await makeRequest('POST', '/user-roles', sampleUserRole);

    // Test 10: Get all user roles
    console.log('\n=== Test 10: Get All User Roles ===');
    await makeRequest('GET', '/user-roles');

    // Test 11: Get active user roles
    console.log('\n=== Test 11: Get Active User Roles ===');
    await makeRequest('GET', '/user-roles/active');

    // Test 12: Get user role by ID
    console.log('\n=== Test 12: Get User Role by ID ===');
    await makeRequest('GET', `/user-roles/${userRoleId}`);

    // Test 13: Get user role with invalid ID (should fail)
    console.log('\n=== Test 13: Get User Role with Invalid ID (Should Fail) ===');
    await makeRequest('GET', '/user-roles/invalid-uuid-id');

    // Test 14: Get user role with non-existent ID (should fail)
    console.log('\n=== Test 14: Get Non-existent User Role (Should Fail) ===');
    await makeRequest('GET', '/user-roles/00000000-0000-0000-0000-000000000000');

    // Test 15: Get user roles by user_id
    console.log('\n=== Test 15: Get User Roles by user_id ===');
    await makeRequest('GET', `/user-roles/user/${sampleUserRole.user_id}`);

    // Test 16: Get active user roles by user_id
    console.log('\n=== Test 16: Get Active User Roles by user_id ===');
    await makeRequest('GET', `/user-roles/user/${sampleUserRole.user_id}/active`);

    // Test 17: Get user roles by society_id
    console.log('\n=== Test 17: Get User Roles by society_id ===');
    await makeRequest('GET', `/user-roles/society/${sampleUserRole.society_id}`);

    // Test 18: Get active user roles by society_id
    console.log('\n=== Test 18: Get Active User Roles by society_id ===');
    await makeRequest('GET', `/user-roles/society/${sampleUserRole.society_id}/active`);

    // Test 19: Get user roles by role_id
    console.log('\n=== Test 19: Get User Roles by role_id ===');
    await makeRequest('GET', `/user-roles/role/${sampleUserRole.role_id}`);

    // Test 20: Get active user roles by role_id
    console.log('\n=== Test 20: Get Active User Roles by role_id ===');
    await makeRequest('GET', `/user-roles/role/${sampleUserRole.role_id}/active`);

    // Test 21: Get user roles by user_id and society_id
    console.log('\n=== Test 21: Get User Roles by user_id and society_id ===');
    await makeRequest('GET', `/user-roles/user/${sampleUserRole.user_id}/society/${sampleUserRole.society_id}`);

    // Test 22: Search user roles with query parameters
    console.log('\n=== Test 22: Search User Roles (by user_id) ===');
    await makeRequest('GET', `/user-roles/search?user_id=${sampleUserRole.user_id}`);

    // Test 23: Search user roles with multiple filters
    console.log('\n=== Test 23: Search User Roles (multiple filters) ===');
    await makeRequest('GET', `/user-roles/search?user_id=${sampleUserRole.user_id}&society_id=${sampleUserRole.society_id}&is_active=true`);

    // Test 24: Search user roles by active status
    console.log('\n=== Test 24: Search User Roles (is_active=false) ===');
    await makeRequest('GET', '/user-roles/search?is_active=false');

    // Test 25: Update user role
    console.log('\n=== Test 25: Update User Role ===');
    const updateData = {
      valid_until: '2025-12-31',
      is_active: true,
    };
    await makeRequest('PUT', `/user-roles/${userRoleId}`, updateData);

    // Test 26: Update user role with invalid user_id (should fail)
    console.log('\n=== Test 26: Update User Role with Invalid user_id (Should Fail) ===');
    await makeRequest('PUT', `/user-roles/${userRoleId}`, {
      user_id: '00000000-0000-0000-0000-000000000999', // Non-existent user
    });

    // Test 27: Update user role with invalid role_id (should fail)
    console.log('\n=== Test 27: Update User Role with Invalid role_id (Should Fail) ===');
    await makeRequest('PUT', `/user-roles/${userRoleId}`, {
      role_id: '00000000-0000-0000-0000-000000000999', // Non-existent role
    });

    // Test 28: Update user role with invalid date range (should fail)
    console.log('\n=== Test 28: Update User Role with Invalid Date Range (Should Fail) ===');
    await makeRequest('PUT', `/user-roles/${userRoleId}`, {
      valid_from: '2025-12-31',
      valid_until: '2025-01-01', // Invalid: until < from
    });

    // Test 29: Update user role to inactive
    console.log('\n=== Test 29: Update User Role to Inactive ===');
    await makeRequest('PUT', `/user-roles/${userRoleId}`, {
      is_active: false,
    });

    // Test 30: Verify inactive user role doesn't appear in active list
    console.log('\n=== Test 30: Verify Inactive User Role Not in Active List ===');
    const activeRolesResult = await makeRequest('GET', '/user-roles/active');
    if (activeRolesResult.success) {
      const roleInList = activeRolesResult.data.find(r => r.id === userRoleId);
      if (roleInList) {
        console.log('⚠ Warning: Inactive user role still appears in active list');
      } else {
        console.log('✓ Inactive user role correctly excluded from active list');
      }
    }

    // Test 31: Reactivate user role
    console.log('\n=== Test 31: Reactivate User Role ===');
    await makeRequest('PUT', `/user-roles/${userRoleId}`, {
      is_active: true,
    });

    // Test 32: Delete user role
    console.log('\n=== Test 32: Delete User Role ===');
    await makeRequest('DELETE', `/user-roles/${userRoleId}`);

    // Test 33: Try to get deleted user role (should fail)
    console.log('\n=== Test 33: Get Deleted User Role (Should Fail) ===');
    await makeRequest('GET', `/user-roles/${userRoleId}`);

    // Test 34: Try to delete non-existent user role (should fail)
    console.log('\n=== Test 34: Delete Non-existent User Role (Should Fail) ===');
    await makeRequest('DELETE', '/user-roles/00000000-0000-0000-0000-000000000000');

    // Test 35: Try to delete with invalid ID (should fail)
    console.log('\n=== Test 35: Delete User Role with Invalid ID (Should Fail) ===');
    await makeRequest('DELETE', '/user-roles/invalid-uuid-id');

    console.log('\n✓ All tests completed!');
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error('Make sure the server is running on port 3000');
    process.exit(1);
  }
}

testUserRolesAPI();

