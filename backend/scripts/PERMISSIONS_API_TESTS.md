# Permissions API - Test Cases Documentation

## Overview

This document describes all test cases for the Permissions API, covering validation, CRUD operations, error handling, and edge cases.

## Test Scripts

### 1. Basic Test Suite
**File**: `scripts/testPermissionsAPI.js`  
**Run**: `npm run test-permissions`

**Coverage**: 13 test cases
- Basic CRUD operations
- Duplicate detection
- Multiple permission creation
- Module and code-based queries
- Active permissions filtering
- Update and delete operations

### 2. Extended Test Suite
**File**: `scripts/testPermissionsAPI_Extended.js`  
**Run**: `npm run test-permissions-extended`

**Coverage**: 40+ test cases
- Comprehensive validation tests
- Field length validation
- Data type validation
- UUID format validation
- All CRUD operations with edge cases
- Detailed test reporting

---

## Test Categories

### A. Validation Tests - Required Fields (3 tests)

#### Test 1: Create Permission - Missing Name
**Purpose**: Verify that permission_name is required  
**Expected**: 400 Bad Request  
**Error Message**: "Permission name is required and must be a non-empty string"

#### Test 2: Create Permission - Missing Code
**Purpose**: Verify that permission_code is required  
**Expected**: 400 Bad Request  
**Error Message**: "Permission code is required and must be a non-empty string"

#### Test 3: Create Permission - Missing Module
**Purpose**: Verify that module is required  
**Expected**: 400 Bad Request  
**Error Message**: "Module is required and must be a non-empty string"

---

### B. Validation Tests - Empty Fields (3 tests)

#### Test 4: Create Permission - Empty Name
**Purpose**: Verify that empty strings are rejected for permission_name  
**Expected**: 400 Bad Request

#### Test 5: Create Permission - Empty Code
**Purpose**: Verify that empty strings are rejected for permission_code  
**Expected**: 400 Bad Request

#### Test 6: Create Permission - Empty Module
**Purpose**: Verify that empty strings are rejected for module  
**Expected**: 400 Bad Request

---

### C. Validation Tests - Field Lengths (3 tests)

#### Test 7: Create Permission - Name Too Long
**Purpose**: Verify permission_name max length (100 chars)  
**Test Data**: String with 101 characters  
**Expected**: 400 Bad Request  
**Error Message**: "Permission name must not exceed 100 characters"

#### Test 8: Create Permission - Code Too Long
**Purpose**: Verify permission_code max length (50 chars)  
**Test Data**: String with 51 characters  
**Expected**: 400 Bad Request  
**Error Message**: "Permission code must not exceed 50 characters"

#### Test 9: Create Permission - Module Too Long
**Purpose**: Verify module max length (50 chars)  
**Test Data**: String with 51 characters  
**Expected**: 400 Bad Request  
**Error Message**: "Module must not exceed 50 characters"

---

### D. Validation Tests - Data Types (3 tests)

#### Test 10: Create Permission - Invalid is_active Type
**Purpose**: Verify is_active must be boolean  
**Test Data**: `is_active: "not-a-boolean"`  
**Expected**: 400 Bad Request  
**Error Message**: "is_active must be a boolean"

#### Test 11: Get Permission - Invalid UUID Format
**Purpose**: Verify UUID format validation  
**Test Data**: `GET /permissions/invalid-uuid-format`  
**Expected**: 400 Bad Request  
**Error Message**: "Valid permission ID (UUID) is required"

#### Test 12: Get Permission - Non-Existent UUID
**Purpose**: Verify 404 for valid UUID but non-existent permission  
**Test Data**: `GET /permissions/00000000-0000-0000-0000-000000000999`  
**Expected**: 404 Not Found  
**Error Message**: "Permission not found"

---

### E. CRUD Tests - Create (4 tests)

#### Test 13: Create Permission
**Purpose**: Verify successful permission creation  
**Test Data**:
```json
{
  "permission_name": "Test Permission",
  "permission_code": "TEST_PERM",
  "module": "users",
  "description": "Test permission",
  "is_active": true
}
```
**Expected**: 201 Created  
**Verification**: Response includes permission_id

#### Test 14: Create Duplicate Permission (by Name)
**Purpose**: Verify unique constraint on permission_name  
**Test Data**: Same permission_name as Test 13  
**Expected**: 409 Conflict  
**Error Message**: "Permission with this name already exists"

#### Test 15: Create Duplicate Permission (by Code)
**Purpose**: Verify unique constraint on permission_code  
**Test Data**: Same permission_code as Test 13  
**Expected**: 409 Conflict  
**Error Message**: "Permission with this code already exists"

#### Test 16: Create Multiple Permissions for Different Modules
**Purpose**: Verify permissions can be created for various modules  
**Test Data**: Permissions for users, societies, members, assets, roles modules  
**Expected**: All created successfully (201 for each)

---

### F. CRUD Tests - Read (8 tests)

#### Test 17: Get All Permissions
**Purpose**: Verify retrieval of all permissions  
**Endpoint**: `GET /permissions`  
**Expected**: 200 OK, array of permissions  
**Verification**: Response is non-empty array

#### Test 18: Get Permission by ID
**Purpose**: Verify retrieval by permission_id  
**Endpoint**: `GET /permissions/:id`  
**Expected**: 200 OK, single permission object  
**Verification**: Returned permission_id matches requested

#### Test 19: Get Permission by Code
**Purpose**: Verify retrieval by permission_code  
**Endpoint**: `GET /permissions/code/:code`  
**Expected**: 200 OK, single permission object  
**Verification**: Returned permission_code matches requested

#### Test 20: Get Permission by Name
**Purpose**: Verify retrieval by permission_name  
**Endpoint**: `GET /permissions/name/:name`  
**Expected**: 200 OK, single permission object  
**Verification**: Returned permission_name matches requested

#### Test 21: Get Permission by Invalid Name
**Purpose**: Verify 404 for non-existent permission name  
**Endpoint**: `GET /permissions/name/NonExistent`  
**Expected**: 404 Not Found

#### Test 22: Get Permissions by Module (All Modules)
**Purpose**: Verify filtering by module for all supported modules  
**Test Data**: Query each module (users, societies, members, assets, roles)  
**Expected**: 200 OK for each, filtered results  
**Verification**: All returned permissions have correct module

#### Test 23: Get Active Permissions
**Purpose**: Verify filtering by is_active  
**Endpoint**: `GET /permissions/active`  
**Expected**: 200 OK, array of active permissions  
**Verification**: All returned permissions have is_active = true

#### Test 24: Get Active Permissions by Module
**Purpose**: Verify combined filtering (module + is_active)  
**Endpoint**: `GET /permissions/module/users/active`  
**Expected**: 200 OK  
**Verification**: All returned permissions match module AND are active

---

### G. CRUD Tests - Update (7 tests)

#### Test 25: Update Permission - Description
**Purpose**: Verify updating description field  
**Test Data**: `{ "description": "Updated description" }`  
**Expected**: 200 OK  
**Verification**: Updated description in response

#### Test 26: Update Permission - Name
**Purpose**: Verify updating permission_name  
**Test Data**: `{ "permission_name": "Updated Name" }`  
**Expected**: 200 OK  
**Verification**: Updated name in response

#### Test 27: Update Permission - Code
**Purpose**: Verify updating permission_code  
**Test Data**: `{ "permission_code": "UPDATED_CODE" }`  
**Expected**: 200 OK  
**Verification**: Updated code in response

#### Test 28: Update Permission - Deactivate
**Purpose**: Verify deactivating a permission  
**Test Data**: `{ "is_active": false }`  
**Expected**: 200 OK  
**Verification**: is_active = false in response

#### Test 29: Update Permission - Reactivate
**Purpose**: Verify reactivating a permission  
**Test Data**: `{ "is_active": true }`  
**Expected**: 200 OK  
**Verification**: is_active = true in response

#### Test 30: Update Permission - Invalid Data
**Purpose**: Verify validation during update  
**Test Data**: `{ "permission_code": "" }`  
**Expected**: 400 Bad Request  
**Error Message**: "Permission code must be a non-empty string"

#### Test 31: Update Non-Existent Permission
**Purpose**: Verify 404 for updating non-existent permission  
**Test Data**: Valid UUID but non-existent permission  
**Expected**: 404 Not Found  
**Error Message**: "Permission not found"

---

### H. CRUD Tests - Delete (4 tests)

#### Test 32: Delete Permission
**Purpose**: Verify successful deletion  
**Endpoint**: `DELETE /permissions/:id`  
**Expected**: 200 OK  
**Verification**: Success message returned

#### Test 33: Get Deleted Permission
**Purpose**: Verify deleted permission cannot be retrieved  
**Test Data**: Try to GET deleted permission  
**Expected**: 404 Not Found

#### Test 34: Delete Non-Existent Permission
**Purpose**: Verify 404 for deleting non-existent permission  
**Test Data**: Valid UUID but non-existent permission  
**Expected**: 404 Not Found

#### Test 35: Delete with Invalid UUID
**Purpose**: Verify UUID validation in delete  
**Test Data**: Invalid UUID format  
**Expected**: 400 Bad Request

---

## Test Modules Coverage

### Users Module
- VIEW_USERS
- CREATE_USERS
- EDIT_USERS
- DELETE_USERS

### Societies Module
- VIEW_SOCIETIES
- CREATE_SOCIETIES
- EDIT_SOCIETIES
- DELETE_SOCIETIES

### Members Module
- VIEW_MEMBERS
- CREATE_MEMBERS
- EDIT_MEMBERS
- DELETE_MEMBERS

### Assets Module
- VIEW_ASSETS
- MANAGE_ASSETS

### Roles Module
- MANAGE_ROLES
- ASSIGN_ROLES

---

## Running Tests

### Prerequisites
1. Server must be running: `node server.js`
2. Database must be connected and synced
3. Axios and dotenv packages installed

### Run Basic Tests
```bash
npm run test-permissions
```

### Run Extended Tests (Recommended)
```bash
npm run test-permissions-extended
```

### Expected Output (Extended)
```
========================================
   PERMISSIONS API - EXTENDED TESTS
========================================

Base URL: http://localhost:3000/api
Starting tests at: 2024-12-18T...

▶ VALIDATION TESTS - Required Fields
=== Create Permission - Missing Name ===
✓ Create Permission - Missing Name Passed!

... (all tests run)

========================================
         TEST SUMMARY REPORT
========================================

Total Tests: 40
✓ Passed: 40 (100.0%)
✗ Failed: 0 (0.0%)

========================================
         TESTS BY CATEGORY
========================================

Validation - Required Fields:
  Total: 3
  ✓ Passed: 3
  ✗ Failed: 0

Validation - Empty Fields:
  Total: 3
  ✓ Passed: 3
  ✗ Failed: 0

... (all categories)

========================================
ALL TESTS PASSED! ✓
========================================
```

---

## Test Data Patterns

### Valid Permission Examples
```json
{
  "permission_name": "View Users",
  "permission_code": "VIEW_USERS",
  "module": "users",
  "description": "View user list and details",
  "is_active": true
}
```

### Invalid Test Data

**Missing Required Field:**
```json
{
  "permission_code": "VIEW_USERS",
  "module": "users"
  // Missing permission_name
}
```

**Empty Field:**
```json
{
  "permission_name": "",
  "permission_code": "VIEW_USERS",
  "module": "users"
}
```

**Field Too Long:**
```json
{
  "permission_name": "A".repeat(101), // Max 100
  "permission_code": "VIEW_USERS",
  "module": "users"
}
```

**Invalid Data Type:**
```json
{
  "permission_name": "View Users",
  "permission_code": "VIEW_USERS",
  "module": "users",
  "is_active": "not-a-boolean"
}
```

---

## Error Handling Test Matrix

| Scenario | HTTP Status | Error Message |
|----------|-------------|---------------|
| Missing required field | 400 | "[Field] is required" |
| Empty string | 400 | "[Field] must be a non-empty string" |
| Field too long | 400 | "[Field] must not exceed X characters" |
| Invalid data type | 400 | "[Field] must be a [type]" |
| Duplicate name | 409 | "Permission with this name already exists" |
| Duplicate code | 409 | "Permission with this code already exists" |
| Invalid UUID format | 400 | "Valid permission ID (UUID) is required" |
| Permission not found | 404 | "Permission not found" |

---

## Continuous Testing

### Automated Testing
Add to CI/CD pipeline:
```bash
# In CI/CD script
npm run test-permissions-extended
if [ $? -eq 0 ]; then
  echo "All tests passed"
else
  echo "Tests failed"
  exit 1
fi
```

### Manual Testing Checklist
- [ ] Run basic tests after any permission service changes
- [ ] Run extended tests before deployment
- [ ] Verify all modules can create permissions
- [ ] Test with actual database (not mocked)
- [ ] Verify cleanup (delete test data)

---

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "ECONNREFUSED"  
**Solution**: Ensure server is running on port 3000

**Issue**: Tests fail with database errors  
**Solution**: Verify database is connected and permissions table exists

**Issue**: Duplicate errors on subsequent runs  
**Solution**: Test creates unique data using timestamps, should not conflict

**Issue**: Some tests pass but extended tests fail  
**Solution**: Check validation logic in service layer

---

## Test Coverage Summary

- **Validation**: 12 tests (30%)
- **CRUD Create**: 4 tests (10%)
- **CRUD Read**: 8 tests (20%)
- **CRUD Update**: 7 tests (17.5%)
- **CRUD Delete**: 4 tests (10%)
- **Integration**: 5 tests (12.5%)

**Total**: 40 comprehensive test cases

---

## Future Enhancements

1. Add performance tests (bulk operations)
2. Add concurrency tests (simultaneous operations)
3. Add role-permission mapping tests (when implemented)
4. Add permission inheritance tests
5. Add audit log verification tests


