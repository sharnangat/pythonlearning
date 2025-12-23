# API Test Suite

Comprehensive test suite for all API endpoints using Jest and Supertest.

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure test database:**
Create `.env.test` file (optional, uses `.env` by default):
```env
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_USER=postgres
TEST_DB_PASSWORD=postgres
TEST_DB_NAME=soc_db_test
```

3. **Run tests:**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with verbose output
npm run test:verbose
```

## Test Structure

```
tests/
├── setup.js                    # Test setup and configuration
├── helpers/
│   └── testHelpers.js         # Test utility functions
├── auth.test.js                # Authentication tests
├── users.test.js               # User management tests
├── societies.test.js           # Society management tests
├── members.test.js             # Member management tests
├── assets.test.js              # Asset management tests
├── maintenance.test.js        # Maintenance tests
├── visitors.test.js            # Visitor management tests
├── notifications.test.js       # Notification tests
├── roles.test.js               # Role management tests
├── payments.test.js            # Payment tests
└── subscriptions.test.js       # Subscription tests
```

## Test Coverage

### Authentication (`auth.test.js`)
- ✅ User registration
- ✅ User login (username/email)
- ✅ Get user profile
- ✅ Logout
- ✅ Error cases (duplicate, invalid credentials, missing fields)

### Users (`users.test.js`)
- ✅ Get all users (with pagination, search, filters)
- ✅ Get user by ID
- ✅ Update user
- ✅ Delete user
- ✅ Change password
- ✅ Permission checks

### Societies (`societies.test.js`)
- ✅ Get all societies
- ✅ Get society by ID
- ✅ Create society
- ✅ Update society
- ✅ Delete society
- ✅ Duplicate validation

### Members (`members.test.js`)
- ✅ Get all members
- ✅ Get member by ID
- ✅ Create member
- ✅ Update member
- ✅ Delete member
- ✅ Filter by society_id, status

### Assets (`assets.test.js`)
- ✅ Get all assets
- ✅ Get asset by ID
- ✅ Create asset
- ✅ Update asset
- ✅ Delete asset
- ✅ Filter by society_id, asset_type

### Maintenance (`maintenance.test.js`)
- ✅ Get maintenance requests
- ✅ Create maintenance request
- ✅ Update maintenance request
- ✅ Get maintenance bills
- ✅ Filter by society_id, status, priority

### Visitors (`visitors.test.js`)
- ✅ Get visitors
- ✅ Create visitor entry
- ✅ Checkout visitor
- ✅ Pre-register visitor
- ✅ Filter by society_id, status

### Notifications (`notifications.test.js`)
- ✅ Get notifications
- ✅ Mark notification as read
- ✅ Mark all as read
- ✅ Pagination support

### Roles (`roles.test.js`)
- ✅ Get all roles
- ✅ Create role
- ✅ Assign role to user
- ✅ Get permissions

### Payments (`payments.test.js`)
- ✅ Get payments
- ✅ Process maintenance payment
- ✅ Filter by society_id

### Subscriptions (`subscriptions.test.js`)
- ✅ Get subscription plans
- ✅ Create subscription plan
- ✅ Get society subscriptions
- ✅ Create society subscription

## Test Helpers

### `testHelpers.js`

Utility functions for tests:

- `generateTestToken(payload)` - Generate JWT token for testing
- `createTestUser(userData)` - Create a test user
- `createTestSociety(societyData)` - Create a test society
- `createTestMember(memberData)` - Create a test member
- `assignRoleToUser(userId, roleName, societyId)` - Assign role to user
- `cleanupTestData()` - Clean up test data
- `getAuthHeader(token)` - Get authorization header

## Running Specific Tests

```bash
# Run specific test file
npm test -- auth.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should login"

# Run tests with coverage
npm test -- --coverage
```

## Test Database

Tests use a separate test database (or the same database with cleanup). Make sure:
- Test database exists or can be created
- Test user has proper permissions
- Test data is cleaned up after tests

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clean up test data after tests
3. **Fixtures**: Use test helpers for common operations
4. **Assertions**: Test both success and error cases
5. **Authentication**: Test with and without proper auth/permissions

## Coverage Goals

- ✅ Authentication endpoints: 100%
- ✅ User management: 100%
- ✅ Society management: 100%
- ✅ Member management: 100%
- ✅ Asset management: 100%
- ✅ Maintenance: 100%
- ✅ Visitors: 100%
- ✅ Notifications: 100%
- ✅ Roles & Permissions: 100%
- ✅ Payments: 100%
- ✅ Subscriptions: 100%

## Continuous Integration

Tests can be integrated into CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test
  env:
    TEST_DB_HOST: localhost
    TEST_DB_NAME: soc_db_test
```

