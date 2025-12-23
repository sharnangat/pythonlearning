# Database Setup Guide

This guide explains how to set up the PostgreSQL database for the Society Management System.

## Prerequisites

1. **PostgreSQL installed and running**
   - Download from: https://www.postgresql.org/download/
   - Default port: 5432

2. **Environment variables configured**
   - Ensure `backend/.env` file exists with database credentials
   - Or set environment variables manually

## Setup Methods

### Method 1: Using PowerShell Script (Windows)

```powershell
cd backend/dbscript
.\setup_database.ps1
```

### Method 2: Using Bash Script (Linux/Mac/Git Bash)

```bash
cd backend/dbscript
chmod +x setup_database.sh
./setup_database.sh
```

### Method 3: Using Node.js Script

```bash
cd backend/dbscript
npm install pg dotenv  # Install dependencies if not already installed
node setup_database.js
```

### Method 4: Manual Setup (Using psql)

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE soc_db;"

# 2. Run schema
psql -U postgres -d soc_db -f schema.sql
```

## Environment Variables

The scripts read from `backend/.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=soc_db
```

## What the Scripts Do

1. **Check PostgreSQL Connection**: Verifies PostgreSQL is accessible
2. **Check Database Exists**: Checks if database already exists
3. **Create Database**: Creates the database if it doesn't exist
4. **Run Schema**: Executes `schema.sql` to create all tables, indexes, triggers, and initial data

## Troubleshooting

### Error: Cannot connect to PostgreSQL

- Ensure PostgreSQL service is running
- Check credentials in `.env` file
- Verify PostgreSQL is listening on the correct port (default: 5432)

### Error: Permission denied

- Ensure database user has CREATE DATABASE permission
- On Windows, run PowerShell as Administrator
- Check PostgreSQL user permissions

### Error: psql command not found

- Add PostgreSQL bin directory to PATH
- Or use full path: `C:\Program Files\PostgreSQL\14\bin\psql.exe`

### Error: Schema file not found

- Ensure you're running the script from `backend/dbscript/` directory
- Or provide full path to `schema.sql`

## Verification

After setup, verify tables were created:

```sql
-- Connect to database
psql -U postgres -d soc_db

-- List all tables
\dt

-- Check specific table
SELECT * FROM users LIMIT 1;
SELECT * FROM roles LIMIT 1;
SELECT * FROM permissions LIMIT 1;
```

## Expected Tables

After successful setup, you should have these tables:

1. users
2. societies
3. roles
4. permissions
5. role_permissions
6. user_roles
7. members
8. assets
9. company_config
10. maintenance_requests
11. audit_logs
12. notifications
13. subscription_plans
14. society_subscriptions
15. payments
16. payment_methods
17. maintenance_charges
18. member_maintenance_charges
19. maintenance_bills
20. maintenance_bill_items
21. maintenance_payments
22. visitors
23. visitor_pre_registrations
24. visitor_logs

## Next Steps

1. **Create Super Admin User**:
   ```sql
   INSERT INTO users (username, email, password_hash, first_name, last_name, status, email_verified)
   VALUES ('superadmin', 'admin@society.com', '$2b$10$hashedpassword', 'Super', 'Admin', 'active', TRUE);
   
   INSERT INTO user_roles (user_id, role_id, is_active)
   SELECT u.id, r.id, TRUE
   FROM users u, roles r
   WHERE u.username = 'superadmin' AND r.role_name = 'superAdmin';
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   node server.js
   ```

## Notes

- The scripts will prompt before dropping existing databases
- All default roles and permissions are created automatically
- Default subscription plans are inserted automatically
- The schema includes triggers for automatic timestamp updates

