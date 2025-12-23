const fs = require('fs');
const path = require('path');

// Helper function to create authenticated request
function createAuthRequest(method, path, body = null, query = []) {
    const request = {
        auth: {
            type: 'bearer',
            bearer: [{ key: 'token', value: '{{auth_token}}', type: 'string' }],
        },
        method: method,
        header: method !== 'GET' && method !== 'DELETE' ? [
            { key: 'Content-Type', value: 'application/json' }
        ] : [],
        url: {
            raw: `{{base_url}}${path}${query.length > 0 ? '?' + query.map(q => `${q.key}=${q.value}`).join('&') : ''}`,
            host: ['{{base_url}}'],
            path: path.split('/').filter(p => p && !p.startsWith(':')),
            query: query,
        },
    };

    if (body) {
        request.body = {
            mode: 'raw',
            raw: JSON.stringify(body, null, 2),
        };
    }

    return request;
}

// Helper function to create request with auto-save variable
function createRequestWithSave(method, path, body, variableName, query = []) {
    const request = createAuthRequest(method, path, body, query);
    request.event = [{
        listen: 'test',
        script: {
            exec: [
                `if (pm.response.code === ${method === 'POST' ? '201' : '200'}) {`,
                '    const jsonData = pm.response.json();',
                `    if (jsonData.data && jsonData.data.${variableName}) {`,
                `        pm.collectionVariables.set('${variableName}', jsonData.data.${variableName}.id);`,
                '    }',
                '}',
            ],
        },
    }];
    return request;
}

// Complete collection with all endpoints
const collection = {
    info: {
        name: 'Society Management System API',
        description: 'Complete API collection for Society Management System - All Endpoints',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        _exporter_id: 'society-api',
    },
    auth: {
        type: 'bearer',
        bearer: [{ key: 'token', value: '{{auth_token}}', type: 'string' }],
    },
    variable: [
        { key: 'base_url', value: 'http://localhost:3000', type: 'string' },
        { key: 'auth_token', value: '', type: 'string' },
        { key: 'user_id', value: '', type: 'string' },
        { key: 'society_id', value: '', type: 'string' },
        { key: 'member_id', value: '', type: 'string' },
        { key: 'role_id', value: '', type: 'string' },
        { key: 'permission_id', value: '', type: 'string' },
        { key: 'asset_id', value: '', type: 'string' },
        { key: 'visitor_id', value: '', type: 'string' },
    ],
    item: [
        // Health Check
        {
            name: 'Health Check',
            request: {
                method: 'GET',
                header: [],
                url: { raw: '{{base_url}}/health', host: ['{{base_url}}'], path: ['health'] },
            },
        },
        // Authentication
        {
            name: 'Authentication',
            item: [
                {
                    name: 'Register User',
                    event: [{
                        listen: 'test',
                        script: {
                            exec: [
                                'if (pm.response.code === 201) {',
                                '    const jsonData = pm.response.json();',
                                '    if (jsonData.data && jsonData.data.token) {',
                                '        pm.collectionVariables.set("auth_token", jsonData.data.token);',
                                '        pm.collectionVariables.set("user_id", jsonData.data.user.id);',
                                '    }',
                                '}',
                            ],
                        },
                    }],
                    request: {
                        method: 'POST',
                        header: [{ key: 'Content-Type', value: 'application/json' }],
                        body: {
                            mode: 'raw',
                            raw: JSON.stringify({
                                username: 'testuser',
                                email: 'test@example.com',
                                password: 'Test123456!',
                                first_name: 'Test',
                                last_name: 'User',
                                phone: '1234567890',
                            }, null, 2),
                        },
                        url: { raw: '{{base_url}}/api/auth/register', host: ['{{base_url}}'], path: ['api', 'auth', 'register'] },
                    },
                },
                {
                    name: 'Login',
                    event: [{
                        listen: 'test',
                        script: {
                            exec: [
                                'if (pm.response.code === 200) {',
                                '    const jsonData = pm.response.json();',
                                '    if (jsonData.data && jsonData.data.token) {',
                                '        pm.collectionVariables.set("auth_token", jsonData.data.token);',
                                '        pm.collectionVariables.set("user_id", jsonData.data.user.id);',
                                '    }',
                                '}',
                            ],
                        },
                    }],
                    request: {
                        method: 'POST',
                        header: [{ key: 'Content-Type', value: 'application/json' }],
                        body: {
                            mode: 'raw',
                            raw: JSON.stringify({ username: 'testuser', password: 'Test123456!' }, null, 2),
                        },
                        url: { raw: '{{base_url}}/api/auth/login', host: ['{{base_url}}'], path: ['api', 'auth', 'login'] },
                    },
                },
                {
                    name: 'Get Profile',
                    request: createAuthRequest('GET', '/api/auth/profile'),
                },
                {
                    name: 'Logout',
                    request: createAuthRequest('POST', '/api/auth/logout'),
                },
            ],
        },
        // Users
        {
            name: 'Users',
            item: [
                { name: 'Get All Users', request: createAuthRequest('GET', '/api/users', null, [{ key: 'page', value: '1' }, { key: 'limit', value: '10' }]) },
                { name: 'Get User by ID', request: createAuthRequest('GET', '/api/users/{{user_id}}') },
                { name: 'Update User', request: createAuthRequest('PUT', '/api/users/{{user_id}}', { first_name: 'Updated', last_name: 'Name' }) },
                { name: 'Delete User', request: createAuthRequest('DELETE', '/api/users/{{user_id}}') },
                { name: 'Change Password', request: createAuthRequest('POST', '/api/users/change-password', { current_password: 'Test123456!', new_password: 'NewPassword123!' }) },
            ],
        },
        // Societies
        {
            name: 'Societies',
            item: [
                { name: 'Get All Societies', request: createAuthRequest('GET', '/api/societies', null, [{ key: 'page', value: '1' }, { key: 'limit', value: '10' }]) },
                { name: 'Get Society by ID', request: createAuthRequest('GET', '/api/societies/{{society_id}}') },
                {
                    name: 'Create Society',
                    request: createRequestWithSave('POST', '/api/societies', {
                        society_name: 'Test Society',
                        registration_number: `REG${Date.now()}`,
                        address: '123 Test Street',
                        city: 'Test City',
                        state: 'Test State',
                        pincode: '123456',
                        country: 'Test Country',
                        phone: '1234567890',
                        email: 'society@example.com',
                    }, 'society'),
                },
                { name: 'Update Society', request: createAuthRequest('PUT', '/api/societies/{{society_id}}', { society_name: 'Updated Society' }) },
                { name: 'Delete Society', request: createAuthRequest('DELETE', '/api/societies/{{society_id}}') },
            ],
        },
        // Members
        {
            name: 'Members',
            item: [
                { name: 'Get All Members', request: createAuthRequest('GET', '/api/members', null, [{ key: 'society_id', value: '{{society_id}}' }]) },
                { name: 'Get Member by ID', request: createAuthRequest('GET', '/api/members/{{member_id}}') },
                {
                    name: 'Create Member',
                    request: createRequestWithSave('POST', '/api/members', {
                        society_id: '{{society_id}}',
                        membership_number: `MEM${Date.now()}`,
                        first_name: 'John',
                        last_name: 'Doe',
                        email: 'member@example.com',
                        phone: '1234567890',
                        flat_number: '101',
                    }, 'member'),
                },
                { name: 'Update Member', request: createAuthRequest('PUT', '/api/members/{{member_id}}', { first_name: 'Updated' }) },
                { name: 'Delete Member', request: createAuthRequest('DELETE', '/api/members/{{member_id}}') },
            ],
        },
        // Roles
        {
            name: 'Roles',
            item: [
                { name: 'Get All Roles', request: createAuthRequest('GET', '/api/roles') },
                { name: 'Get Permissions', request: createAuthRequest('GET', '/api/roles/permissions') },
                { name: 'Assign Role to User', request: createAuthRequest('POST', '/api/roles/assign', { user_id: '{{user_id}}', role_id: '{{role_id}}' }) },
                { name: 'Create Role', request: createAuthRequest('POST', '/api/roles', { role_name: 'test_role', display_name: 'Test Role' }) },
                { name: 'Update Role', request: createAuthRequest('PUT', '/api/roles/{{role_id}}', { display_name: 'Updated Role' }) },
                { name: 'Delete Role', request: createAuthRequest('DELETE', '/api/roles/{{role_id}}') },
            ],
        },
        // Permissions
        {
            name: 'Permissions',
            item: [
                { name: 'Get All Permissions', request: createAuthRequest('GET', '/api/permissions') },
                { name: 'Get Permission by ID', request: createAuthRequest('GET', '/api/permissions/{{permission_id}}') },
                { name: 'Create Permission', request: createAuthRequest('POST', '/api/permissions', { permission_code: 'test_perm', permission_name: 'Test Permission', resource: 'test', action: 'read' }) },
                { name: 'Update Permission', request: createAuthRequest('PUT', '/api/permissions/{{permission_id}}', { display_name: 'Updated' }) },
                { name: 'Delete Permission', request: createAuthRequest('DELETE', '/api/permissions/{{permission_id}}') },
            ],
        },
        // Role Permissions
        {
            name: 'Role Permissions',
            item: [
                { name: 'Get Role Permissions', request: createAuthRequest('GET', '/api/role-permissions', null, [{ key: 'role_id', value: '{{role_id}}' }]) },
                { name: 'Assign Permission to Role', request: createAuthRequest('POST', '/api/role-permissions', { role_id: '{{role_id}}', permission_id: '{{permission_id}}' }) },
                { name: 'Update Role Permission', request: createAuthRequest('PUT', '/api/role-permissions/:id', { granted: true }) },
                { name: 'Remove Permission from Role', request: createAuthRequest('DELETE', '/api/role-permissions/:id') },
            ],
        },
        // User Roles
        {
            name: 'User Roles',
            item: [
                { name: 'Get User Roles', request: createAuthRequest('GET', '/api/user-roles', null, [{ key: 'user_id', value: '{{user_id}}' }]) },
                { name: 'Get User Role by ID', request: createAuthRequest('GET', '/api/user-roles/:id') },
                { name: 'Update User Role', request: createAuthRequest('PUT', '/api/user-roles/:id', { is_active: true }) },
                { name: 'Revoke User Role', request: createAuthRequest('DELETE', '/api/user-roles/:id') },
            ],
        },
        // Assets
        {
            name: 'Assets',
            item: [
                { name: 'Get All Assets', request: createAuthRequest('GET', '/api/assets', null, [{ key: 'society_id', value: '{{society_id}}' }]) },
                { name: 'Get Asset by ID', request: createAuthRequest('GET', '/api/assets/{{asset_id}}') },
                {
                    name: 'Create Asset',
                    request: createRequestWithSave('POST', '/api/assets', {
                        society_id: '{{society_id}}',
                        asset_name: 'Test Asset',
                        asset_type: 'equipment',
                        description: 'Test description',
                        purchase_cost: 10000,
                    }, 'asset'),
                },
                { name: 'Update Asset', request: createAuthRequest('PUT', '/api/assets/{{asset_id}}', { asset_name: 'Updated Asset' }) },
                { name: 'Delete Asset', request: createAuthRequest('DELETE', '/api/assets/{{asset_id}}') },
            ],
        },
        // Maintenance
        {
            name: 'Maintenance',
            item: [
                { name: 'Get Maintenance Requests', request: createAuthRequest('GET', '/api/maintenance/requests', null, [{ key: 'society_id', value: '{{society_id}}' }]) },
                { name: 'Create Maintenance Request', request: createAuthRequest('POST', '/api/maintenance/requests', { society_id: '{{society_id}}', title: 'Test Request', description: 'Test description' }) },
                { name: 'Update Maintenance Request', request: createAuthRequest('PUT', '/api/maintenance/requests/:id', { status: 'in_progress' }) },
                { name: 'Get Maintenance Bills', request: createAuthRequest('GET', '/api/maintenance/bills', null, [{ key: 'society_id', value: '{{society_id}}' }]) },
                { name: 'Get Maintenance Bill by ID', request: createAuthRequest('GET', '/api/maintenance/bills/:id') },
            ],
        },
        // Maintenance Charges
        {
            name: 'Maintenance Charges',
            item: [
                { name: 'Get Maintenance Charges', request: createAuthRequest('GET', '/api/maintenance-charges', null, [{ key: 'society_id', value: '{{society_id}}' }]) },
                { name: 'Get Maintenance Charge by ID', request: createAuthRequest('GET', '/api/maintenance-charges/:id') },
                { name: 'Create Maintenance Charge', request: createAuthRequest('POST', '/api/maintenance-charges', { society_id: '{{society_id}}', charge_name: 'Test Charge', charge_type: 'monthly', base_amount: 1000 }) },
                { name: 'Update Maintenance Charge', request: createAuthRequest('PUT', '/api/maintenance-charges/:id', { base_amount: 1500 }) },
                { name: 'Delete Maintenance Charge', request: createAuthRequest('DELETE', '/api/maintenance-charges/:id') },
            ],
        },
        // Member Maintenance Charges
        {
            name: 'Member Maintenance Charges',
            item: [
                { name: 'Get Member Maintenance Charges', request: createAuthRequest('GET', '/api/member-maintenance-charges', null, [{ key: 'member_id', value: '{{member_id}}' }]) },
                { name: 'Get Member Maintenance Charge by ID', request: createAuthRequest('GET', '/api/member-maintenance-charges/:id') },
                { name: 'Create Member Maintenance Charge', request: createAuthRequest('POST', '/api/member-maintenance-charges', { society_id: '{{society_id}}', member_id: '{{member_id}}', charge_name: 'Test Charge', amount: 1000 }) },
                { name: 'Update Member Maintenance Charge', request: createAuthRequest('PUT', '/api/member-maintenance-charges/:id', { amount: 1500 }) },
                { name: 'Delete Member Maintenance Charge', request: createAuthRequest('DELETE', '/api/member-maintenance-charges/:id') },
            ],
        },
        // Maintenance Bill Items
        {
            name: 'Maintenance Bill Items',
            item: [
                { name: 'Get Bill Items', request: createAuthRequest('GET', '/api/maintenance-bill-items/bill/:bill_id') },
                { name: 'Create Bill Item', request: createAuthRequest('POST', '/api/maintenance-bill-items', { bill_id: ':bill_id', charge_name: 'Test Charge', amount: 1000 }) },
                { name: 'Update Bill Item', request: createAuthRequest('PUT', '/api/maintenance-bill-items/:id', { amount: 1500 }) },
                { name: 'Delete Bill Item', request: createAuthRequest('DELETE', '/api/maintenance-bill-items/:id') },
            ],
        },
        // Visitors
        {
            name: 'Visitors',
            item: [
                { name: 'Get Visitors', request: createAuthRequest('GET', '/api/visitors', null, [{ key: 'society_id', value: '{{society_id}}' }]) },
                {
                    name: 'Create Visitor',
                    request: createRequestWithSave('POST', '/api/visitors', {
                        society_id: '{{society_id}}',
                        member_id: '{{member_id}}',
                        visitor_name: 'John Doe',
                        visitor_phone: '1234567890',
                        purpose_of_visit: 'Meeting',
                    }, 'visitor'),
                },
                { name: 'Checkout Visitor', request: createAuthRequest('PUT', '/api/visitors/{{visitor_id}}/checkout', { exit_gate: 'Main Gate' }) },
                { name: 'Pre-register Visitor', request: createAuthRequest('POST', '/api/visitors/pre-register', { society_id: '{{society_id}}', visitor_name: 'Jane Doe', expected_entry_time: new Date().toISOString() }) },
            ],
        },
        // Visitor Logs
        {
            name: 'Visitor Logs',
            item: [
                { name: 'Get Visitor Logs', request: createAuthRequest('GET', '/api/visitor-logs', null, [{ key: 'visitor_id', value: '{{visitor_id}}' }]) },
                { name: 'Get Visitor Log by ID', request: createAuthRequest('GET', '/api/visitor-logs/:id') },
            ],
        },
        // Notifications
        {
            name: 'Notifications',
            item: [
                { name: 'Get Notifications', request: createAuthRequest('GET', '/api/notifications', null, [{ key: 'is_read', value: 'false' }]) },
                { name: 'Mark Notification as Read', request: createAuthRequest('PUT', '/api/notifications/:id/read') },
                { name: 'Mark All as Read', request: createAuthRequest('PUT', '/api/notifications/read-all') },
            ],
        },
        // Subscriptions
        {
            name: 'Subscriptions',
            item: [
                { name: 'Get Subscription Plans', request: createAuthRequest('GET', '/api/subscriptions/plans') },
                { name: 'Create Subscription Plan', request: createAuthRequest('POST', '/api/subscriptions/plans', { plan_name: 'test_plan', display_name: 'Test Plan', base_price: 1000 }) },
                { name: 'Update Subscription Plan', request: createAuthRequest('PUT', '/api/subscriptions/plans/:id', { base_price: 1500 }) },
                { name: 'Get Society Subscriptions', request: createAuthRequest('GET', '/api/subscriptions', null, [{ key: 'society_id', value: '{{society_id}}' }]) },
                { name: 'Create Society Subscription', request: createAuthRequest('POST', '/api/subscriptions', { society_id: '{{society_id}}', plan_id: ':plan_id' }) },
                { name: 'Update Subscription', request: createAuthRequest('PUT', '/api/subscriptions/:id', { auto_renew: true }) },
            ],
        },
        // Payments
        {
            name: 'Payments',
            item: [
                { name: 'Get Payments', request: createAuthRequest('GET', '/api/payments', null, [{ key: 'society_id', value: '{{society_id}}' }]) },
                { name: 'Process Maintenance Payment', request: createAuthRequest('POST', '/api/payments/maintenance', { bill_id: ':bill_id', payment_amount: 1000, payment_method: 'cash' }) },
            ],
        },
        // Payment Methods
        {
            name: 'Payment Methods',
            item: [
                { name: 'Get Payment Methods', request: createAuthRequest('GET', '/api/payment-methods', null, [{ key: 'society_id', value: '{{society_id}}' }]) },
                { name: 'Get Payment Method by ID', request: createAuthRequest('GET', '/api/payment-methods/:id') },
                { name: 'Create Payment Method', request: createAuthRequest('POST', '/api/payment-methods', { society_id: '{{society_id}}', payment_type: 'bank_transfer', provider: 'Test Bank' }) },
                { name: 'Update Payment Method', request: createAuthRequest('PUT', '/api/payment-methods/:id', { provider: 'Updated Bank' }) },
                { name: 'Delete Payment Method', request: createAuthRequest('DELETE', '/api/payment-methods/:id') },
            ],
        },
        // Audit Logs
        {
            name: 'Audit Logs',
            item: [
                { name: 'Get Audit Logs', request: createAuthRequest('GET', '/api/audit-logs', null, [{ key: 'user_id', value: '{{user_id}}' }]) },
                { name: 'Get Audit Log by ID', request: createAuthRequest('GET', '/api/audit-logs/:id') },
            ],
        },
        // Configuration
        {
            name: 'Configuration',
            item: [
                { name: 'Get Configuration', request: createAuthRequest('GET', '/api/config', null, [{ key: 'society_id', value: '{{society_id}}' }]) },
                { name: 'Update Configuration', request: createAuthRequest('PUT', '/api/config/:id', { config_value: 'Updated Value' }) },
            ],
        },
        // Logs
        {
            name: 'Logs',
            item: [
                { name: 'Get Recent Requests', request: createAuthRequest('GET', '/api/logs/requests', null, [{ key: 'limit', value: '100' }]) },
                { name: 'Get Recent Responses', request: createAuthRequest('GET', '/api/logs/responses', null, [{ key: 'limit', value: '100' }]) },
                { name: 'Get Request-Response Pair', request: createAuthRequest('GET', '/api/logs/pair/:requestId') },
            ],
        },
    ],
};

// Write collection to file
const collectionPath = path.join(__dirname, 'Society_Management_API.postman_collection.json');
fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
console.log(`✅ Complete Postman collection created: ${collectionPath}`);
console.log(`📊 Total folders: ${collection.item.length}`);
console.log(`📝 Total endpoints: ${collection.item.reduce((sum, folder) => sum + (folder.item ? folder.item.length : 1), 0)}`);

