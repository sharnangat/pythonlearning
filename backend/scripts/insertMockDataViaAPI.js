require('dotenv').config();
const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Mock user data
const mockUsers = [
  {
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: 'password123',
    first_name: 'John',
    last_name: 'Doe',
    phone: '1234567890',
    status: 'active',
    email_verified: true,
    phone_verified: false,
  },
  {
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    first_name: 'Jane',
    last_name: 'Smith',
    phone: '0987654321',
    status: 'active',
    email_verified: true,
    phone_verified: true,
  },
  {
    username: 'bob_wilson',
    email: 'bob.wilson@example.com',
    password: 'test123',
    first_name: 'Bob',
    last_name: 'Wilson',
    phone: '5551234567',
    status: 'pending_verification',
    email_verified: false,
    phone_verified: false,
  },
  {
    username: 'alice_brown',
    email: 'alice.brown@example.com',
    password: 'securepass',
    first_name: 'Alice',
    last_name: 'Brown',
    phone: '5559876543',
    status: 'active',
    email_verified: true,
    phone_verified: true,
  },
  {
    username: 'charlie_davis',
    email: 'charlie.davis@example.com',
    password: 'mypassword',
    first_name: 'Charlie',
    last_name: 'Davis',
    phone: '5555555555',
    status: 'pending_verification',
    email_verified: false,
    phone_verified: false,
  },
];

function createUserViaAPI(userData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(userData);
    const url = new URL(`${API_BASE_URL}/users`);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, data: parsed, statusCode: res.statusCode });
          } else {
            resolve({ success: false, error: parsed.message || data, statusCode: res.statusCode });
          }
        } catch (e) {
          resolve({ success: false, error: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function insertMockDataViaAPI() {
  console.log('Starting mock data insertion via API...\n');
  console.log(`API URL: ${API_BASE_URL}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < mockUsers.length; i++) {
    const userData = mockUsers[i];
    console.log(`[${i + 1}/${mockUsers.length}] Creating user: ${userData.email}`);

    try {
      const result = await createUserViaAPI(userData);
      
      if (result.success) {
        console.log(`✓ User created successfully: ${userData.email} (ID: ${result.data.id})`);
        successCount++;
      } else {
        if (result.error.includes('already exists')) {
          console.log(`⚠ User already exists: ${userData.email}`);
        } else {
          console.log(`✗ Failed to create user: ${result.error}`);
          errorCount++;
        }
      }
    } catch (error) {
      console.log(`✗ Error creating user ${userData.email}:`, error.message);
      errorCount++;
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n=== Mock Data Insertion Summary ===');
  console.log(`Total users: ${mockUsers.length}`);
  console.log(`Successfully created: ${successCount}`);
  console.log(`Errors/Skipped: ${errorCount}`);
  console.log('===================================\n');
}

// Run the script
insertMockDataViaAPI()
  .then(() => {
    console.log('Mock data insertion completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });


