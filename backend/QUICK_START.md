# Quick Start Guide

## Prerequisites
- Node.js installed
- PostgreSQL installed and running
- Database created (run `npm run setup-db`)

## Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
Create a `.env` file in the `backend` directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=soc_db
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

3. **Setup Database** (if not done)
```bash
npm run setup-db
npm run insert-mock-data
```

4. **Start Server**
```bash
npm start
# or for development with auto-reload
npm run dev
```

## Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

Save the token from the response.

### 3. Get Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Get Societies
```bash
curl -X GET http://localhost:3000/api/societies \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Get Members
```bash
curl -X GET http://localhost:3000/api/members \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Default Users

After running `npm run insert-mock-data`, you can login with any of the created users. Check the database for usernames, or use:
- Username: Any username from the mock data
- Password: `password123` (all mock users use this password)

## API Documentation

See `README_API.md` for complete API documentation.

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection
├── controllers/              # Request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── societyController.js
│   └── memberController.js
├── middleware/               # Middleware functions
│   ├── auth.js              # Authentication & authorization
│   ├── errorHandler.js      # Error handling
│   └── validation.js        # Input validation
├── routes/                   # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── societyRoutes.js
│   └── ...
├── dbscript/                 # Database scripts
│   ├── schema.sql
│   ├── setup_database.js
│   └── insert_mock_data.js
├── server.js                 # Main server file
└── package.json
```

## Features

✅ User Registration & Authentication (JWT)
✅ Role-Based Access Control (RBAC)
✅ Permission-Based Access Control
✅ User Management
✅ Society Management
✅ Member Management
✅ Asset Management
✅ Maintenance Requests & Bills
✅ Visitor Management
✅ Notifications
✅ Subscriptions & Payments
✅ Configuration Management
✅ Audit Logging
✅ Error Handling
✅ Input Validation

## Next Steps

1. Test all endpoints using Postman or curl
2. Customize permissions and roles as needed
3. Add email verification functionality
4. Implement file uploads for documents/images
5. Add more validation rules
6. Set up production environment variables

