// Test setup file
// This file is loaded before all tests

// Set test environment
process.env.NODE_ENV = 'test';

// Load environment variables
require('dotenv').config();

// Suppress console logs during tests (optional)
if (process.env.SUPPRESS_TEST_LOGS === 'true') {
    global.console = {
        ...console,
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };
}
