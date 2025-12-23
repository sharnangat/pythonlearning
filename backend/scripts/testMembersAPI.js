require('dotenv').config();
const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Sample member data - Note: You need a valid society_id UUID
const sampleMember = {
  society_id: '2931b673-91e5-4811-886b-f81b94607e4e', // Replace with actual society_id from your database
  member_type: 'Owner',
  first_name: 'John',
  middle_name: 'Michael',
  last_name: 'Doe',
  date_of_birth: '1985-05-15',
  gender: 'Male',
  nationality: 'Indian',
  primary_phone: '+911234567890',
  secondary_phone: '+911234567891',
  email: 'john.doe' + Date.now() + '@example.com', // Use timestamp to ensure uniqueness
  emergency_contact_name: 'Jane Doe',
  emergency_contact_phone: '+911234567892',
  permanent_address: '123 Main Street, Mumbai, Maharashtra 400001',
  current_address: '123 Main Street, Mumbai, Maharashtra 400001',
  aadhar_number: '123456789012',
  pan_number: 'ABCDE1234F',
  occupation: 'Software Engineer',
  organization: 'Tech Corp',
  designation: 'Senior Developer',
  membership_number: 'MEM-' + Date.now(), // Use timestamp to ensure uniqueness
  joining_date: '2024-01-01',
  is_active: true,
  has_voting_rights: true,
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

async function testMembersAPI() {
  try {
    console.log('NOTE: Make sure you have a valid society_id in the sampleMember object');
    console.log('You can get a society_id by running: npm run test-societies\n');

    // 1. Create member
    console.log('=== Test 1: Create Member ===');
    const createResult = await makeRequest('POST', '/members', sampleMember);
    
    if (!createResult.success) {
      console.log('\n✗ Failed to create member');
      console.log('Make sure society_id exists in the database');
      return;
    }

    const memberId = createResult.data.id;
    console.log(`\n✓ Member created with ID: ${memberId}`);

    // 2. Get all members
    console.log('\n=== Test 2: Get All Members ===');
    await makeRequest('GET', '/members');

    // 3. Get member by ID
    console.log('\n=== Test 3: Get Member by ID ===');
    await makeRequest('GET', `/members/${memberId}`);

    // 4. Get active members
    console.log('\n=== Test 4: Get Active Members ===');
    await makeRequest('GET', '/members/active');

    // 5. Get members by society_id
    console.log('\n=== Test 5: Get Members by Society ID ===');
    await makeRequest('GET', `/members/society/${sampleMember.society_id}`);

    // 6. Get active members by society_id
    console.log('\n=== Test 6: Get Active Members by Society ID ===');
    await makeRequest('GET', `/members/society/${sampleMember.society_id}/active`);

    // 7. Update member
    console.log('\n=== Test 7: Update Member ===');
    const updateData = {
      first_name: 'John Updated',
      occupation: 'Senior Software Engineer',
    };
    await makeRequest('PUT', `/members/${memberId}`, updateData);

    // 8. Delete member (optional - comment out if you want to keep the data)
    // console.log('\n=== Test 8: Delete Member ===');
    // await makeRequest('DELETE', `/members/${memberId}`);

    console.log('\n✓ All tests completed!');
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error('Make sure the server is running on port 3000');
    process.exit(1);
  }
}

testMembersAPI();

