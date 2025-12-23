const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

let createdPermissionId = '';
let createdPermissionCode = `PERM_TEST_${Date.now()}`;
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  tests: []
};

const samplePermission = {
  permission_name: `Test Permission ${Date.now()}`,
  permission_code: createdPermissionCode,
  module: 'users',
  description: 'Test permission for user management',
  is_active: true,
};

const runTest = async (name, fn, category = 'General') => {
  console.log(`\n=== ${name} ===`);
  testResults.total++;
  try {
    await fn();
    console.log(`✓ ${name} Passed!`);
    testResults.passed++;
    testResults.tests.push({ name, status: 'PASSED', category });
  } catch (error) {
    console.error(`✗ ${name} Failed!`);
    testResults.failed++;
    testResults.tests.push({ name, status: 'FAILED', category, error: error.message });
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Error:', error.response.data.message || error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

// ==================== VALIDATION TESTS ====================

const testCreatePermissionMissingName = async () => {
  const invalidData = {
    permission_code: `CODE_${Date.now()}`,
    module: 'users',
  };
  try {
    await axios.post(`${API_BASE_URL}/permissions`, invalidData);
    throw new Error('Should have failed with missing permission_name');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly rejected missing permission_name');
    } else {
      throw error;
    }
  }
};

const testCreatePermissionMissingCode = async () => {
  const invalidData = {
    permission_name: `Test ${Date.now()}`,
    module: 'users',
  };
  try {
    await axios.post(`${API_BASE_URL}/permissions`, invalidData);
    throw new Error('Should have failed with missing permission_code');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly rejected missing permission_code');
    } else {
      throw error;
    }
  }
};

const testCreatePermissionMissingModule = async () => {
  const invalidData = {
    permission_name: `Test ${Date.now()}`,
    permission_code: `CODE_${Date.now()}`,
  };
  try {
    await axios.post(`${API_BASE_URL}/permissions`, invalidData);
    throw new Error('Should have failed with missing module');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly rejected missing module');
    } else {
      throw error;
    }
  }
};

const testCreatePermissionEmptyName = async () => {
  const invalidData = {
    permission_name: '',
    permission_code: `CODE_${Date.now()}`,
    module: 'users',
  };
  try {
    await axios.post(`${API_BASE_URL}/permissions`, invalidData);
    throw new Error('Should have failed with empty permission_name');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly rejected empty permission_name');
    } else {
      throw error;
    }
  }
};

const testCreatePermissionEmptyCode = async () => {
  const invalidData = {
    permission_name: `Test ${Date.now()}`,
    permission_code: '',
    module: 'users',
  };
  try {
    await axios.post(`${API_BASE_URL}/permissions`, invalidData);
    throw new Error('Should have failed with empty permission_code');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly rejected empty permission_code');
    } else {
      throw error;
    }
  }
};

const testCreatePermissionEmptyModule = async () => {
  const invalidData = {
    permission_name: `Test ${Date.now()}`,
    permission_code: `CODE_${Date.now()}`,
    module: '',
  };
  try {
    await axios.post(`${API_BASE_URL}/permissions`, invalidData);
    throw new Error('Should have failed with empty module');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly rejected empty module');
    } else {
      throw error;
    }
  }
};

const testCreatePermissionNameTooLong = async () => {
  const invalidData = {
    permission_name: 'A'.repeat(101), // Max is 100
    permission_code: `CODE_${Date.now()}`,
    module: 'users',
  };
  try {
    await axios.post(`${API_BASE_URL}/permissions`, invalidData);
    throw new Error('Should have failed with permission_name too long');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly rejected permission_name > 100 chars');
    } else {
      throw error;
    }
  }
};

const testCreatePermissionCodeTooLong = async () => {
  const invalidData = {
    permission_name: `Test ${Date.now()}`,
    permission_code: 'A'.repeat(51), // Max is 50
    module: 'users',
  };
  try {
    await axios.post(`${API_BASE_URL}/permissions`, invalidData);
    throw new Error('Should have failed with permission_code too long');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly rejected permission_code > 50 chars');
    } else {
      throw error;
    }
  }
};

const testCreatePermissionModuleTooLong = async () => {
  const invalidData = {
    permission_name: `Test ${Date.now()}`,
    permission_code: `CODE_${Date.now()}`,
    module: 'A'.repeat(51), // Max is 50
  };
  try {
    await axios.post(`${API_BASE_URL}/permissions`, invalidData);
    throw new Error('Should have failed with module too long');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly rejected module > 50 chars');
    } else {
      throw error;
    }
  }
};

const testCreatePermissionInvalidIsActive = async () => {
  const invalidData = {
    permission_name: `Test ${Date.now()}`,
    permission_code: `CODE_${Date.now()}`,
    module: 'users',
    is_active: 'not-a-boolean',
  };
  try {
    await axios.post(`${API_BASE_URL}/permissions`, invalidData);
    throw new Error('Should have failed with invalid is_active');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly rejected invalid is_active type');
    } else {
      throw error;
    }
  }
};

const testGetPermissionByInvalidUUID = async () => {
  try {
    await axios.get(`${API_BASE_URL}/permissions/invalid-uuid-format`);
    throw new Error('Should have failed with invalid UUID');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly rejected invalid UUID format');
    } else {
      throw error;
    }
  }
};

const testGetPermissionByNonExistentUUID = async () => {
  try {
    await axios.get(`${API_BASE_URL}/permissions/00000000-0000-0000-0000-000000000999`);
    throw new Error('Should have failed with non-existent UUID');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('✓ Correctly returned 404 for non-existent permission');
    } else {
      throw error;
    }
  }
};

// ==================== CRUD TESTS ====================

const testCreatePermission = async () => {
  console.log('Request Body:\n', JSON.stringify(samplePermission, null, 2));
  const response = await axios.post(`${API_BASE_URL}/permissions`, samplePermission);
  console.log('✓ Success! Status:', response.status);
  console.log('Response:\n', JSON.stringify(response.data, null, 2));
  createdPermissionId = response.data.permission_id;
  createdPermissionCode = response.data.permission_code;
  if (!createdPermissionId) throw new Error('Permission ID not returned');
  console.log('✓ Permission created with ID:', createdPermissionId);
};

const testCreateDuplicatePermissionByName = async () => {
  try {
    await axios.post(`${API_BASE_URL}/permissions`, samplePermission);
    throw new Error('Duplicate permission name should have failed');
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log('✓ Correctly failed to create duplicate permission name');
    } else {
      throw error;
    }
  }
};

const testCreateDuplicatePermissionByCode = async () => {
  const duplicateCode = {
    permission_name: `Different Name ${Date.now()}`,
    permission_code: createdPermissionCode,
    module: 'users',
  };
  try {
    await axios.post(`${API_BASE_URL}/permissions`, duplicateCode);
    throw new Error('Duplicate permission code should have failed');
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log('✓ Correctly failed to create duplicate permission code');
    } else {
      throw error;
    }
  }
};

const testCreateMultiplePermissionsForDifferentModules = async () => {
  const permissions = [
    {
      permission_name: `View Users ${Date.now()}`,
      permission_code: `VIEW_USERS_${Date.now()}`,
      module: 'users',
      description: 'View user list',
      is_active: true,
    },
    {
      permission_name: `Create Societies ${Date.now()}`,
      permission_code: `CREATE_SOCIETIES_${Date.now()}`,
      module: 'societies',
      description: 'Create new societies',
      is_active: true,
    },
    {
      permission_name: `Edit Members ${Date.now()}`,
      permission_code: `EDIT_MEMBERS_${Date.now()}`,
      module: 'members',
      description: 'Edit member details',
      is_active: true,
    },
    {
      permission_name: `Manage Assets ${Date.now()}`,
      permission_code: `MANAGE_ASSETS_${Date.now()}`,
      module: 'assets',
      description: 'Manage society assets',
      is_active: true,
    },
    {
      permission_name: `Assign Roles ${Date.now()}`,
      permission_code: `ASSIGN_ROLES_${Date.now()}`,
      module: 'roles',
      description: 'Assign roles to users',
      is_active: true,
    },
  ];

  for (const perm of permissions) {
    const response = await axios.post(`${API_BASE_URL}/permissions`, perm);
    console.log(`✓ Created: ${perm.permission_name} (${perm.module})`);
  }
};

const testGetAllPermissions = async () => {
  const response = await axios.get(`${API_BASE_URL}/permissions`);
  console.log('✓ Success! Status:', response.status);
  console.log(`Total permissions: ${response.data.length}`);
  if (!Array.isArray(response.data) || response.data.length === 0) {
    throw new Error('No permissions returned');
  }
};

const testGetPermissionById = async () => {
  const response = await axios.get(`${API_BASE_URL}/permissions/${createdPermissionId}`);
  console.log('✓ Success! Status:', response.status);
  if (response.data.permission_id !== createdPermissionId) {
    throw new Error('Fetched permission ID mismatch');
  }
};

const testGetPermissionByCode = async () => {
  const response = await axios.get(`${API_BASE_URL}/permissions/code/${createdPermissionCode}`);
  console.log('✓ Success! Status:', response.status);
  if (response.data.permission_code !== createdPermissionCode) {
    throw new Error('Fetched permission code mismatch');
  }
};

const testGetPermissionByName = async () => {
  const response = await axios.get(`${API_BASE_URL}/permissions/name/${encodeURIComponent(samplePermission.permission_name)}`);
  console.log('✓ Success! Status:', response.status);
  if (response.data.permission_name !== samplePermission.permission_name) {
    throw new Error('Fetched permission name mismatch');
  }
};

const testGetPermissionByInvalidName = async () => {
  try {
    await axios.get(`${API_BASE_URL}/permissions/name/NonExistentPermission${Date.now()}`);
    throw new Error('Should have failed with non-existent permission name');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('✓ Correctly returned 404 for non-existent permission name');
    } else {
      throw error;
    }
  }
};

const testGetPermissionsByModule = async () => {
  const modules = ['users', 'societies', 'members', 'assets', 'roles'];
  
  for (const module of modules) {
    const response = await axios.get(`${API_BASE_URL}/permissions/module/${module}`);
    console.log(`✓ Module '${module}': ${response.data.length} permissions`);
    if (!Array.isArray(response.data)) {
      throw new Error(`Invalid response for module ${module}`);
    }
    if (response.data.some(perm => perm.module !== module)) {
      throw new Error(`Wrong module permissions returned for ${module}`);
    }
  }
};

const testGetActivePermissions = async () => {
  const response = await axios.get(`${API_BASE_URL}/permissions/active`);
  console.log('✓ Success! Status:', response.status);
  console.log(`Total active permissions: ${response.data.length}`);
  if (!Array.isArray(response.data)) {
    throw new Error('Invalid response format');
  }
  if (response.data.some(perm => !perm.is_active)) {
    throw new Error('Inactive permissions returned');
  }
};

const testGetActivePermissionsByModule = async () => {
  const response = await axios.get(`${API_BASE_URL}/permissions/module/users/active`);
  console.log('✓ Success! Status:', response.status);
  console.log(`Active permissions in 'users' module: ${response.data.length}`);
  if (!Array.isArray(response.data)) {
    throw new Error('Invalid response format');
  }
  if (response.data.some(perm => perm.module !== 'users' || !perm.is_active)) {
    throw new Error('Incorrect permissions returned');
  }
};

const testUpdatePermission = async () => {
  const updateData = {
    description: 'Updated test permission description',
    is_active: true,
  };
  console.log('Request Body:\n', JSON.stringify(updateData, null, 2));
  const response = await axios.put(`${API_BASE_URL}/permissions/${createdPermissionId}`, updateData);
  console.log('✓ Success! Status:', response.status);
  if (response.data.description !== updateData.description) {
    throw new Error('Permission update failed');
  }
};

const testUpdatePermissionName = async () => {
  const updateData = {
    permission_name: `Updated Permission Name ${Date.now()}`,
  };
  const response = await axios.put(`${API_BASE_URL}/permissions/${createdPermissionId}`, updateData);
  console.log('✓ Permission name updated successfully');
  if (response.data.permission_name !== updateData.permission_name) {
    throw new Error('Permission name update failed');
  }
};

const testUpdatePermissionCode = async () => {
  const newCode = `UPDATED_CODE_${Date.now()}`;
  const updateData = {
    permission_code: newCode,
  };
  const response = await axios.put(`${API_BASE_URL}/permissions/${createdPermissionId}`, updateData);
  console.log('✓ Permission code updated successfully');
  createdPermissionCode = newCode; // Update for future tests
  if (response.data.permission_code !== updateData.permission_code) {
    throw new Error('Permission code update failed');
  }
};

const testUpdatePermissionDeactivate = async () => {
  const updateData = {
    is_active: false,
  };
  const response = await axios.put(`${API_BASE_URL}/permissions/${createdPermissionId}`, updateData);
  console.log('✓ Permission deactivated successfully');
  if (response.data.is_active !== false) {
    throw new Error('Permission deactivation failed');
  }
};

const testUpdatePermissionReactivate = async () => {
  const updateData = {
    is_active: true,
  };
  const response = await axios.put(`${API_BASE_URL}/permissions/${createdPermissionId}`, updateData);
  console.log('✓ Permission reactivated successfully');
  if (response.data.is_active !== true) {
    throw new Error('Permission reactivation failed');
  }
};

const testUpdatePermissionWithInvalidData = async () => {
  const invalidUpdateData = {
    permission_code: '', // Empty code should fail
  };
  try {
    await axios.put(`${API_BASE_URL}/permissions/${createdPermissionId}`, invalidUpdateData);
    throw new Error('Update with invalid data should have failed');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly failed to update with invalid data');
    } else {
      throw error;
    }
  }
};

const testUpdateNonExistentPermission = async () => {
  const updateData = {
    description: 'This should fail',
  };
  try {
    await axios.put(`${API_BASE_URL}/permissions/00000000-0000-0000-0000-000000000999`, updateData);
    throw new Error('Update of non-existent permission should have failed');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('✓ Correctly returned 404 for non-existent permission');
    } else {
      throw error;
    }
  }
};

const testDeletePermission = async () => {
  const response = await axios.delete(`${API_BASE_URL}/permissions/${createdPermissionId}`);
  console.log('✓ Success! Status:', response.status);
  if (response.data.message !== 'Permission deleted successfully') {
    throw new Error('Permission deletion failed');
  }
};

const testGetDeletedPermission = async () => {
  try {
    await axios.get(`${API_BASE_URL}/permissions/${createdPermissionId}`);
    throw new Error('Fetching deleted permission should have failed');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('✓ Correctly failed to fetch deleted permission');
    } else {
      throw error;
    }
  }
};

const testDeleteNonExistentPermission = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/permissions/00000000-0000-0000-0000-000000000999`);
    throw new Error('Delete of non-existent permission should have failed');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('✓ Correctly returned 404 for non-existent permission');
    } else {
      throw error;
    }
  }
};

const testDeleteWithInvalidUUID = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/permissions/invalid-uuid`);
    throw new Error('Delete with invalid UUID should have failed');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Correctly rejected invalid UUID in delete');
    } else {
      throw error;
    }
  }
};

// ==================== MAIN TEST RUNNER ====================

const printTestSummary = () => {
  console.log('\n\n========================================');
  console.log('         TEST SUMMARY REPORT');
  console.log('========================================\n');
  
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`✓ Passed: ${testResults.passed} (${((testResults.passed / testResults.total) * 100).toFixed(1)}%)`);
  console.log(`✗ Failed: ${testResults.failed} (${((testResults.failed / testResults.total) * 100).toFixed(1)}%)`);
  
  console.log('\n========================================');
  console.log('         TESTS BY CATEGORY');
  console.log('========================================\n');
  
  const categories = {};
  testResults.tests.forEach(test => {
    if (!categories[test.category]) {
      categories[test.category] = { passed: 0, failed: 0, total: 0 };
    }
    categories[test.category].total++;
    if (test.status === 'PASSED') {
      categories[test.category].passed++;
    } else {
      categories[test.category].failed++;
    }
  });
  
  Object.keys(categories).forEach(category => {
    const stats = categories[category];
    console.log(`${category}:`);
    console.log(`  Total: ${stats.total}`);
    console.log(`  ✓ Passed: ${stats.passed}`);
    console.log(`  ✗ Failed: ${stats.failed}`);
    console.log('');
  });
  
  if (testResults.failed > 0) {
    console.log('========================================');
    console.log('         FAILED TESTS');
    console.log('========================================\n');
    testResults.tests
      .filter(test => test.status === 'FAILED')
      .forEach(test => {
        console.log(`✗ ${test.name} (${test.category})`);
        console.log(`  Error: ${test.error}`);
        console.log('');
      });
  }
  
  console.log('========================================');
  console.log(testResults.failed === 0 ? 'ALL TESTS PASSED! ✓' : `${testResults.failed} TESTS FAILED ✗`);
  console.log('========================================\n');
};

const main = async () => {
  console.log('========================================');
  console.log('   PERMISSIONS API - EXTENDED TESTS');
  console.log('========================================\n');
  console.log(`Base URL: ${API_BASE_URL}`);
  console.log(`Starting tests at: ${new Date().toISOString()}\n`);
  
  // Validation Tests
  console.log('\n\n▶ VALIDATION TESTS - Required Fields');
  await runTest('Create Permission - Missing Name', testCreatePermissionMissingName, 'Validation - Required Fields');
  await runTest('Create Permission - Missing Code', testCreatePermissionMissingCode, 'Validation - Required Fields');
  await runTest('Create Permission - Missing Module', testCreatePermissionMissingModule, 'Validation - Required Fields');
  
  console.log('\n\n▶ VALIDATION TESTS - Empty Fields');
  await runTest('Create Permission - Empty Name', testCreatePermissionEmptyName, 'Validation - Empty Fields');
  await runTest('Create Permission - Empty Code', testCreatePermissionEmptyCode, 'Validation - Empty Fields');
  await runTest('Create Permission - Empty Module', testCreatePermissionEmptyModule, 'Validation - Empty Fields');
  
  console.log('\n\n▶ VALIDATION TESTS - Field Lengths');
  await runTest('Create Permission - Name Too Long (>100)', testCreatePermissionNameTooLong, 'Validation - Field Lengths');
  await runTest('Create Permission - Code Too Long (>50)', testCreatePermissionCodeTooLong, 'Validation - Field Lengths');
  await runTest('Create Permission - Module Too Long (>50)', testCreatePermissionModuleTooLong, 'Validation - Field Lengths');
  
  console.log('\n\n▶ VALIDATION TESTS - Data Types');
  await runTest('Create Permission - Invalid is_active Type', testCreatePermissionInvalidIsActive, 'Validation - Data Types');
  await runTest('Get Permission - Invalid UUID Format', testGetPermissionByInvalidUUID, 'Validation - UUID');
  await runTest('Get Permission - Non-Existent UUID', testGetPermissionByNonExistentUUID, 'Validation - UUID');
  
  // CRUD Tests
  console.log('\n\n▶ CRUD TESTS - Create');
  await runTest('Create Permission', testCreatePermission, 'CRUD - Create');
  await runTest('Create Duplicate Permission (by Name)', testCreateDuplicatePermissionByName, 'CRUD - Create');
  await runTest('Create Duplicate Permission (by Code)', testCreateDuplicatePermissionByCode, 'CRUD - Create');
  await runTest('Create Multiple Permissions for Different Modules', testCreateMultiplePermissionsForDifferentModules, 'CRUD - Create');
  
  console.log('\n\n▶ CRUD TESTS - Read');
  await runTest('Get All Permissions', testGetAllPermissions, 'CRUD - Read');
  await runTest('Get Permission by ID', testGetPermissionById, 'CRUD - Read');
  await runTest('Get Permission by Code', testGetPermissionByCode, 'CRUD - Read');
  await runTest('Get Permission by Name', testGetPermissionByName, 'CRUD - Read');
  await runTest('Get Permission by Invalid Name', testGetPermissionByInvalidName, 'CRUD - Read');
  await runTest('Get Permissions by Module (All Modules)', testGetPermissionsByModule, 'CRUD - Read');
  await runTest('Get Active Permissions', testGetActivePermissions, 'CRUD - Read');
  await runTest('Get Active Permissions by Module', testGetActivePermissionsByModule, 'CRUD - Read');
  
  console.log('\n\n▶ CRUD TESTS - Update');
  await runTest('Update Permission - Description', testUpdatePermission, 'CRUD - Update');
  await runTest('Update Permission - Name', testUpdatePermissionName, 'CRUD - Update');
  await runTest('Update Permission - Code', testUpdatePermissionCode, 'CRUD - Update');
  await runTest('Update Permission - Deactivate', testUpdatePermissionDeactivate, 'CRUD - Update');
  await runTest('Update Permission - Reactivate', testUpdatePermissionReactivate, 'CRUD - Update');
  await runTest('Update Permission - Invalid Data', testUpdatePermissionWithInvalidData, 'CRUD - Update');
  await runTest('Update Non-Existent Permission', testUpdateNonExistentPermission, 'CRUD - Update');
  
  console.log('\n\n▶ CRUD TESTS - Delete');
  await runTest('Delete Permission', testDeletePermission, 'CRUD - Delete');
  await runTest('Get Deleted Permission', testGetDeletedPermission, 'CRUD - Delete');
  await runTest('Delete Non-Existent Permission', testDeleteNonExistentPermission, 'CRUD - Delete');
  await runTest('Delete with Invalid UUID', testDeleteWithInvalidUUID, 'CRUD - Delete');
  
  // Print Summary
  printTestSummary();
};

main();


