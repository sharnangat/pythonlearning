const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

let createdPermissionId = '';
let createdPermissionCode = `PERM_TEST_${Date.now()}`;

const samplePermission = {
  permission_name: `Test Permission ${Date.now()}`,
  permission_code: createdPermissionCode,
  module: 'users',
  description: 'Test permission for user management',
  is_active: true,
};

const runTest = async (name, fn) => {
  console.log(`\n=== ${name} ===`);
  try {
    await fn();
    console.log(`✓ ${name} Passed!`);
  } catch (error) {
    console.error(`✗ ${name} Failed!`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Error:', error.response.data.message || error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

const testCreatePermission = async () => {
  console.log('\n=== POST /permissions ===');
  console.log('Request Body:\n', JSON.stringify(samplePermission, null, 2));
  const response = await axios.post(`${API_BASE_URL}/permissions`, samplePermission);
  console.log('✓ Success! Status:', response.status);
  console.log('Response:\n', JSON.stringify(response.data, null, 2));
  createdPermissionId = response.data.permission_id;
  createdPermissionCode = response.data.permission_code;
  if (!createdPermissionId) throw new Error('Permission ID not returned');
  console.log('✓ Permission created with ID:', createdPermissionId);
};

const testCreateDuplicatePermission = async () => {
  console.log('\n=== POST /permissions (Duplicate - Should Fail) ===');
  try {
    await axios.post(`${API_BASE_URL}/permissions`, samplePermission);
    throw new Error('Duplicate permission creation should have failed');
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log('✓ Correctly failed to create duplicate permission. Status:', error.response.status);
      console.log('Error:', error.response.data.message);
    } else {
      throw error;
    }
  }
};

const testCreateMultiplePermissions = async () => {
  console.log('\n=== POST /permissions (Multiple Permissions for Same Module) ===');
  const permissions = [
    {
      permission_name: `View Users ${Date.now()}`,
      permission_code: `VIEW_USERS_${Date.now()}`,
      module: 'users',
      description: 'View user list',
      is_active: true,
    },
    {
      permission_name: `Create Users ${Date.now()}`,
      permission_code: `CREATE_USERS_${Date.now()}`,
      module: 'users',
      description: 'Create new users',
      is_active: true,
    },
    {
      permission_name: `Edit Societies ${Date.now()}`,
      permission_code: `EDIT_SOCIETIES_${Date.now()}`,
      module: 'societies',
      description: 'Edit society details',
      is_active: true,
    },
  ];

  for (const perm of permissions) {
    const response = await axios.post(`${API_BASE_URL}/permissions`, perm);
    console.log(`✓ Created: ${perm.permission_name} (${perm.permission_code})`);
  }
};

const testGetAllPermissions = async () => {
  console.log('\n=== GET /permissions ===');
  const response = await axios.get(`${API_BASE_URL}/permissions`);
  console.log('✓ Success! Status:', response.status);
  console.log('Response:\n', JSON.stringify(response.data, null, 2));
  if (!Array.isArray(response.data) || response.data.length === 0) throw new Error('No permissions returned');
};

const testGetPermissionById = async () => {
  console.log(`\n=== GET /permissions/${createdPermissionId} ===`);
  const response = await axios.get(`${API_BASE_URL}/permissions/${createdPermissionId}`);
  console.log('✓ Success! Status:', response.status);
  console.log('Response:\n', JSON.stringify(response.data, null, 2));
  if (response.data.permission_id !== createdPermissionId) throw new Error('Fetched permission ID mismatch');
};

const testGetPermissionByCode = async () => {
  console.log(`\n=== GET /permissions/code/${createdPermissionCode} ===`);
  const response = await axios.get(`${API_BASE_URL}/permissions/code/${createdPermissionCode}`);
  console.log('✓ Success! Status:', response.status);
  console.log('Response:\n', JSON.stringify(response.data, null, 2));
  if (response.data.permission_code !== createdPermissionCode) throw new Error('Fetched permission code mismatch');
};

const testGetPermissionsByModule = async () => {
  console.log('\n=== GET /permissions/module/users ===');
  const response = await axios.get(`${API_BASE_URL}/permissions/module/users`);
  console.log('✓ Success! Status:', response.status);
  console.log('Response:\n', JSON.stringify(response.data, null, 2));
  if (!Array.isArray(response.data) || response.data.length === 0) throw new Error('No permissions returned for module');
  if (response.data.some(perm => perm.module !== 'users')) throw new Error('Permissions from wrong module returned');
};

const testGetActivePermissions = async () => {
  console.log('\n=== GET /permissions/active ===');
  const response = await axios.get(`${API_BASE_URL}/permissions/active`);
  console.log('✓ Success! Status:', response.status);
  console.log('Response:\n', JSON.stringify(response.data, null, 2));
  if (!Array.isArray(response.data) || response.data.some(perm => !perm.is_active)) {
    throw new Error('Inactive permissions returned');
  }
};

const testGetActivePermissionsByModule = async () => {
  console.log('\n=== GET /permissions/module/users/active ===');
  const response = await axios.get(`${API_BASE_URL}/permissions/module/users/active`);
  console.log('✓ Success! Status:', response.status);
  console.log('Response:\n', JSON.stringify(response.data, null, 2));
  if (!Array.isArray(response.data)) throw new Error('Invalid response format');
  if (response.data.some(perm => perm.module !== 'users' || !perm.is_active)) {
    throw new Error('Incorrect permissions returned');
  }
};

const testUpdatePermission = async () => {
  console.log(`\n=== PUT /permissions/${createdPermissionId} ===`);
  const updateData = {
    description: 'Updated test permission description',
    is_active: false,
  };
  console.log('Request Body:\n', JSON.stringify(updateData, null, 2));
  const response = await axios.put(`${API_BASE_URL}/permissions/${createdPermissionId}`, updateData);
  console.log('✓ Success! Status:', response.status);
  console.log('Response:\n', JSON.stringify(response.data, null, 2));
  if (response.data.is_active !== updateData.is_active) {
    throw new Error('Permission update failed');
  }
};

const testUpdatePermissionWithInvalidData = async () => {
  console.log('\n=== PUT /permissions/:id (Invalid Data - Should Fail) ===');
  const invalidUpdateData = {
    permission_code: '', // Empty code should fail
  };
  try {
    await axios.put(`${API_BASE_URL}/permissions/${createdPermissionId}`, invalidUpdateData);
    throw new Error('Update with invalid data should have failed');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly failed to update with invalid data. Status:', error.response.status);
      console.log('Error:', error.response.data.message);
    } else {
      throw error;
    }
  }
};

const testDeletePermission = async () => {
  console.log(`\n=== DELETE /permissions/${createdPermissionId} ===`);
  const response = await axios.delete(`${API_BASE_URL}/permissions/${createdPermissionId}`);
  console.log('✓ Success! Status:', response.status);
  console.log('Response:\n', JSON.stringify(response.data, null, 2));
  if (response.data.message !== 'Permission deleted successfully') throw new Error('Permission deletion failed');
};

const testGetDeletedPermission = async () => {
  console.log(`\n=== GET /permissions/${createdPermissionId} (Deleted Permission - Should Fail) ===`);
  try {
    await axios.get(`${API_BASE_URL}/permissions/${createdPermissionId}`);
    throw new Error('Fetching deleted permission should have failed');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('✓ Correctly failed to fetch deleted permission. Status:', error.response.status);
      console.log('Error:', error.response.data.message);
    } else {
      throw error;
    }
  }
};

const main = async () => {
  console.log('Starting Permissions API tests...');
  await runTest('Create Permission', testCreatePermission);
  await runTest('Create Duplicate Permission (Should Fail)', testCreateDuplicatePermission);
  await runTest('Create Multiple Permissions', testCreateMultiplePermissions);
  await runTest('Get All Permissions', testGetAllPermissions);
  await runTest('Get Permission by ID', testGetPermissionById);
  await runTest('Get Permission by Code', testGetPermissionByCode);
  await runTest('Get Permissions by Module', testGetPermissionsByModule);
  await runTest('Get Active Permissions', testGetActivePermissions);
  await runTest('Get Active Permissions by Module', testGetActivePermissionsByModule);
  await runTest('Update Permission', testUpdatePermission);
  await runTest('Update Permission with Invalid Data (Should Fail)', testUpdatePermissionWithInvalidData);
  await runTest('Delete Permission', testDeletePermission);
  await runTest('Get Deleted Permission (Should Fail)', testGetDeletedPermission);
  console.log('\nAll Permissions API tests completed.');
};

main();

