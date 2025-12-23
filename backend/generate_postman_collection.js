const fs = require('fs');
const path = require('path');

// Postman Collection Generator
const collection = {
    info: {
        name: 'Society Management System API',
        description: 'Complete API collection for Society Management System',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        _exporter_id: 'society-api',
    },
    auth: {
        type: 'bearer',
        bearer: [
            {
                key: 'token',
                value: '{{auth_token}}',
                type: 'string',
            },
        ],
    },
    variable: [
        {
            key: 'base_url',
            value: 'http://localhost:3000',
            type: 'string',
        },
        {
            key: 'auth_token',
            value: '',
            type: 'string',
        },
        {
            key: 'user_id',
            value: '',
            type: 'string',
        },
        {
            key: 'society_id',
            value: '',
            type: 'string',
        },
        {
            key: 'member_id',
            value: '',
            type: 'string',
        },
    ],
    item: [
        // Health Check
        {
            name: 'Health Check',
            request: {
                method: 'GET',
                header: [],
                url: {
                    raw: '{{base_url}}/health',
                    host: ['{{base_url}}'],
                    path: ['health'],
                },
            },
        },
        // Authentication Folder
        {
            name: 'Authentication',
            item: [
                {
                    name: 'Register User',
                    event: [
                        {
                            listen: 'test',
                            script: {
                                exec: [
                                    "if (pm.response.code === 201) {",
                                    "    const jsonData = pm.response.json();",
                                    "    if (jsonData.data && jsonData.data.token) {",
                                    "        pm.collectionVariables.set('auth_token', jsonData.data.token);",
                                    "        pm.collectionVariables.set('user_id', jsonData.data.user.id);",
                                    "    }",
                                    "}",
                                ],
                            },
                        },
                    ],
                    request: {
                        method: 'POST',
                        header: [
                            {
                                key: 'Content-Type',
                                value: 'application/json',
                            },
                        ],
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
                        url: {
                            raw: '{{base_url}}/api/auth/register',
                            host: ['{{base_url}}'],
                            path: ['api', 'auth', 'register'],
                        },
                    },
                },
                {
                    name: 'Login',
                    event: [
                        {
                            listen: 'test',
                            script: {
                                exec: [
                                    "if (pm.response.code === 200) {",
                                    "    const jsonData = pm.response.json();",
                                    "    if (jsonData.data && jsonData.data.token) {",
                                    "        pm.collectionVariables.set('auth_token', jsonData.data.token);",
                                    "        pm.collectionVariables.set('user_id', jsonData.data.user.id);",
                                    "    }",
                                    "}",
                                ],
                            },
                        },
                    ],
                    request: {
                        method: 'POST',
                        header: [
                            {
                                key: 'Content-Type',
                                value: 'application/json',
                            },
                        ],
                        body: {
                            mode: 'raw',
                            raw: JSON.stringify({
                                username: 'testuser',
                                password: 'Test123456!',
                            }, null, 2),
                        },
                        url: {
                            raw: '{{base_url}}/api/auth/login',
                            host: ['{{base_url}}'],
                            path: ['api', 'auth', 'login'],
                        },
                    },
                },
                {
                    name: 'Get Profile',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'GET',
                        header: [],
                        url: {
                            raw: '{{base_url}}/api/auth/profile',
                            host: ['{{base_url}}'],
                            path: ['api', 'auth', 'profile'],
                        },
                    },
                },
                {
                    name: 'Logout',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'POST',
                        header: [],
                        url: {
                            raw: '{{base_url}}/api/auth/logout',
                            host: ['{{base_url}}'],
                            path: ['api', 'auth', 'logout'],
                        },
                    },
                },
            ],
        },
        // Users Folder
        {
            name: 'Users',
            item: [
                {
                    name: 'Get All Users',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'GET',
                        header: [],
                        url: {
                            raw: '{{base_url}}/api/users?page=1&limit=10',
                            host: ['{{base_url}}'],
                            path: ['api', 'users'],
                            query: [
                                { key: 'page', value: '1' },
                                { key: 'limit', value: '10' },
                                { key: 'search', value: '', disabled: true },
                                { key: 'status', value: '', disabled: true },
                            ],
                        },
                    },
                },
                {
                    name: 'Get User by ID',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'GET',
                        header: [],
                        url: {
                            raw: '{{base_url}}/api/users/{{user_id}}',
                            host: ['{{base_url}}'],
                            path: ['api', 'users', '{{user_id}}'],
                        },
                    },
                },
                {
                    name: 'Update User',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'PUT',
                        header: [
                            {
                                key: 'Content-Type',
                                value: 'application/json',
                            },
                        ],
                        body: {
                            mode: 'raw',
                            raw: JSON.stringify({
                                first_name: 'Updated',
                                last_name: 'Name',
                                phone: '9876543210',
                            }, null, 2),
                        },
                        url: {
                            raw: '{{base_url}}/api/users/{{user_id}}',
                            host: ['{{base_url}}'],
                            path: ['api', 'users', '{{user_id}}'],
                        },
                    },
                },
                {
                    name: 'Delete User',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'DELETE',
                        header: [],
                        url: {
                            raw: '{{base_url}}/api/users/{{user_id}}',
                            host: ['{{base_url}}'],
                            path: ['api', 'users', '{{user_id}}'],
                        },
                    },
                },
                {
                    name: 'Change Password',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'POST',
                        header: [
                            {
                                key: 'Content-Type',
                                value: 'application/json',
                            },
                        ],
                        body: {
                            mode: 'raw',
                            raw: JSON.stringify({
                                current_password: 'Test123456!',
                                new_password: 'NewPassword123!',
                            }, null, 2),
                        },
                        url: {
                            raw: '{{base_url}}/api/users/change-password',
                            host: ['{{base_url}}'],
                            path: ['api', 'users', 'change-password'],
                        },
                    },
                },
            ],
        },
        // Societies Folder
        {
            name: 'Societies',
            item: [
                {
                    name: 'Get All Societies',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'GET',
                        header: [],
                        url: {
                            raw: '{{base_url}}/api/societies?page=1&limit=10',
                            host: ['{{base_url}}'],
                            path: ['api', 'societies'],
                            query: [
                                { key: 'page', value: '1' },
                                { key: 'limit', value: '10' },
                                { key: 'search', value: '', disabled: true },
                                { key: 'status', value: '', disabled: true },
                            ],
                        },
                    },
                },
                {
                    name: 'Get Society by ID',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'GET',
                        header: [],
                        url: {
                            raw: '{{base_url}}/api/societies/{{society_id}}',
                            host: ['{{base_url}}'],
                            path: ['api', 'societies', '{{society_id}}'],
                        },
                    },
                },
                {
                    name: 'Create Society',
                    event: [
                        {
                            listen: 'test',
                            script: {
                                exec: [
                                    "if (pm.response.code === 201) {",
                                    "    const jsonData = pm.response.json();",
                                    "    if (jsonData.data && jsonData.data.society) {",
                                    "        pm.collectionVariables.set('society_id', jsonData.data.society.id);",
                                    "    }",
                                    "}",
                                ],
                            },
                        },
                    ],
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'POST',
                        header: [
                            {
                                key: 'Content-Type',
                                value: 'application/json',
                            },
                        ],
                        body: {
                            mode: 'raw',
                            raw: JSON.stringify({
                                society_name: 'Test Society',
                                registration_number: `REG${Date.now()}`,
                                address: '123 Test Street',
                                city: 'Test City',
                                state: 'Test State',
                                pincode: '123456',
                                country: 'Test Country',
                                phone: '1234567890',
                                email: 'society@example.com',
                            }, null, 2),
                        },
                        url: {
                            raw: '{{base_url}}/api/societies',
                            host: ['{{base_url}}'],
                            path: ['api', 'societies'],
                        },
                    },
                },
                {
                    name: 'Update Society',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'PUT',
                        header: [
                            {
                                key: 'Content-Type',
                                value: 'application/json',
                            },
                        ],
                        body: {
                            mode: 'raw',
                            raw: JSON.stringify({
                                society_name: 'Updated Society Name',
                                phone: '9876543210',
                            }, null, 2),
                        },
                        url: {
                            raw: '{{base_url}}/api/societies/{{society_id}}',
                            host: ['{{base_url}}'],
                            path: ['api', 'societies', '{{society_id}}'],
                        },
                    },
                },
                {
                    name: 'Delete Society',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'DELETE',
                        header: [],
                        url: {
                            raw: '{{base_url}}/api/societies/{{society_id}}',
                            host: ['{{base_url}}'],
                            path: ['api', 'societies', '{{society_id}}'],
                        },
                    },
                },
            ],
        },
        // Members Folder
        {
            name: 'Members',
            item: [
                {
                    name: 'Get All Members',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'GET',
                        header: [],
                        url: {
                            raw: '{{base_url}}/api/members?society_id={{society_id}}',
                            host: ['{{base_url}}'],
                            path: ['api', 'members'],
                            query: [
                                { key: 'society_id', value: '{{society_id}}' },
                                { key: 'status', value: '', disabled: true },
                                { key: 'search', value: '', disabled: true },
                            ],
                        },
                    },
                },
                {
                    name: 'Get Member by ID',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'GET',
                        header: [],
                        url: {
                            raw: '{{base_url}}/api/members/{{member_id}}',
                            host: ['{{base_url}}'],
                            path: ['api', 'members', '{{member_id}}'],
                        },
                    },
                },
                {
                    name: 'Create Member',
                    event: [
                        {
                            listen: 'test',
                            script: {
                                exec: [
                                    "if (pm.response.code === 201) {",
                                    "    const jsonData = pm.response.json();",
                                    "    if (jsonData.data && jsonData.data.member) {",
                                    "        pm.collectionVariables.set('member_id', jsonData.data.member.id);",
                                    "    }",
                                    "}",
                                ],
                            },
                        },
                    ],
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'POST',
                        header: [
                            {
                                key: 'Content-Type',
                                value: 'application/json',
                            },
                        ],
                        body: {
                            mode: 'raw',
                            raw: JSON.stringify({
                                society_id: '{{society_id}}',
                                membership_number: `MEM${Date.now()}`,
                                first_name: 'John',
                                last_name: 'Doe',
                                email: 'member@example.com',
                                phone: '1234567890',
                                flat_number: '101',
                            }, null, 2),
                        },
                        url: {
                            raw: '{{base_url}}/api/members',
                            host: ['{{base_url}}'],
                            path: ['api', 'members'],
                        },
                    },
                },
                {
                    name: 'Update Member',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'PUT',
                        header: [
                            {
                                key: 'Content-Type',
                                value: 'application/json',
                            },
                        ],
                        body: {
                            mode: 'raw',
                            raw: JSON.stringify({
                                first_name: 'Updated',
                                last_name: 'Name',
                                phone: '9876543210',
                            }, null, 2),
                        },
                        url: {
                            raw: '{{base_url}}/api/members/{{member_id}}',
                            host: ['{{base_url}}'],
                            path: ['api', 'members', '{{member_id}}'],
                        },
                    },
                },
                {
                    name: 'Delete Member',
                    request: {
                        auth: {
                            type: 'bearer',
                            bearer: [
                                {
                                    key: 'token',
                                    value: '{{auth_token}}',
                                    type: 'string',
                                },
                            ],
                        },
                        method: 'DELETE',
                        header: [],
                        url: {
                            raw: '{{base_url}}/api/members/{{member_id}}',
                            host: ['{{base_url}}'],
                            path: ['api', 'members', '{{member_id}}'],
                        },
                    },
                },
            ],
        },
    ],
};

// Write collection to file
const collectionPath = path.join(__dirname, 'Society_Management_API.postman_collection.json');
fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
console.log(`✅ Postman collection created: ${collectionPath}`);

