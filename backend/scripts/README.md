# Mock Data Insertion Scripts

This directory contains scripts to insert mock/test data into the database.

## Scripts Available

### 1. `insertMockData.js` - Direct Database Insertion
Inserts mock data directly using the service layer (bypasses API).

**Usage:**
```bash
npm run insert-mock-data
# or
node scripts/insertMockData.js
```

**Advantages:**
- Faster (no HTTP overhead)
- Works even if server is not running
- Direct database access

### 2. `insertMockDataViaAPI.js` - API-Based Insertion
Inserts mock data through the REST API endpoints.

**Usage:**
```bash
npm run insert-mock-data-api
# or
node scripts/insertMockDataViaAPI.js
```

**Prerequisites:**
- Server must be running on port 3000
- API endpoint `/api/user/register` must be accessible

**Advantages:**
- Tests the actual API endpoints
- Validates API functionality
- Simulates real client requests

## Mock Data Included

The scripts insert 5 test users:
1. **john_doe** - john.doe@example.com (Active, Email verified)
2. **jane_smith** - jane.smith@example.com (Active, Email & Phone verified)
3. **bob_wilson** - bob.wilson@example.com (Pending verification)
4. **alice_brown** - alice.brown@example.com (Active, Email & Phone verified)
5. **charlie_davis** - charlie.davis@example.com (Pending verification)

## Customization

Edit the `mockUsers` array in either script to:
- Add more users
- Modify user data
- Change test scenarios

## Notes

- Scripts will skip users that already exist (based on email)
- Passwords are hashed automatically by the service
- All validation rules apply (same as regular registration)


