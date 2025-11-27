# Database Setup Guide - PostgreSQL

## Prerequisites

- PostgreSQL 14 or higher installed
- Java 21 installed
- Maven installed

## Step 1: Install PostgreSQL

### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer
3. Set a password for the `postgres` user (remember this!)
4. Default port: 5432

### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Step 2: Create Database

### Option 1: Using psql command line

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE auto_carwash_db;

# Create a user (optional - recommended for production)
CREATE USER carwash_admin WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE auto_carwash_db TO carwash_admin;

# Exit psql
\q
```

### Option 2: Using pgAdmin GUI

1. Open pgAdmin
2. Right-click on "Databases" → "Create" → "Database"
3. Name: `auto_carwash_db`
4. Click "Save"

## Step 3: Configure Application

1. Navigate to `backend/src/main/resources/`
2. Open `application.properties`
3. Update the following settings:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/auto_carwash_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD_HERE
```

If you created a custom user:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/auto_carwash_db
spring.datasource.username=carwash_admin
spring.datasource.password=your_secure_password
```

## Step 4: Verify Connection

### Test Connection with psql
```bash
psql -U postgres -d auto_carwash_db -h localhost
```

If successful, you'll see:
```
auto_carwash_db=#
```

## Step 5: Run Application

The application will automatically create all tables on first run using Hibernate DDL.

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

## Database Schema

The following tables will be created automatically:

### Core Tables
- `_user` - User accounts and authentication
- `vehicle` - Customer vehicles
- `appointment` - Appointments with services
- `appointment_service_item` - Junction table for appointment-service relationship
- `employee` - Workshop staff
- `service` - Car wash and maintenance services
- `maintenance_option` - Maintenance wizard options
- `product` - Inventory items
- `financial` - Payment tracking
- `review` - Customer reviews
- `contact` - Contact form submissions

### Support Tables
- `role` - User roles enum
- `token` - JWT tokens for authentication
- `attentity` - Staff attendance records

## Useful PostgreSQL Commands

### Connect to database
```bash
psql -U postgres -d auto_carwash_db
```

### List all tables
```sql
\dt
```

### Describe a table
```sql
\d+ appointment
```

### View all appointments
```sql
SELECT * FROM appointment;
```

### View all vehicles
```sql
SELECT * FROM vehicle;
```

### Check database size
```sql
SELECT pg_size_pretty(pg_database_size('auto_carwash_db'));
```

### Backup database
```bash
pg_dump -U postgres auto_carwash_db > backup.sql
```

### Restore database
```bash
psql -U postgres auto_carwash_db < backup.sql
```

## Troubleshooting

### Error: "password authentication failed"
- Check your password in `application.properties`
- Verify PostgreSQL is running: `pg_isready`

### Error: "database does not exist"
- Create the database using Step 2

### Error: "could not connect to server"
- Check if PostgreSQL is running:
  - Windows: Check Services
  - macOS/Linux: `sudo systemctl status postgresql`
- Check if port 5432 is open

### Error: "relation does not exist"
- Tables are created automatically on first run
- Check `spring.jpa.hibernate.ddl-auto=update` in application.properties

## Production Recommendations

1. **Change default password**: Never use `postgres` / `postgres` in production
2. **Create dedicated user**: Don't use the `postgres` superuser
3. **Enable SSL**: Configure SSL for database connections
4. **Regular backups**: Set up automated backups
5. **Connection pooling**: Configure HikariCP settings
6. **Use environment variables**: Don't hardcode credentials

Example with environment variables:
```properties
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://localhost:5432/auto_carwash_db}
spring.datasource.username=${DATABASE_USER:postgres}
spring.datasource.password=${DATABASE_PASSWORD:postgres}
```

Then set in your environment:
```bash
export DATABASE_URL=jdbc:postgresql://your-server:5432/auto_carwash_db
export DATABASE_USER=carwash_admin
export DATABASE_PASSWORD=your_secure_password
```

## Docker Option (Optional)

If you want to run PostgreSQL in Docker:

```bash
docker run --name auto-carwash-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=auto_carwash_db \
  -p 5432:5432 \
  -d postgres:15
```

Check if running:
```bash
docker ps
```

Connect to it:
```bash
docker exec -it auto-carwash-postgres psql -U postgres -d auto_carwash_db
```

## Next Steps

After database is set up:
1. Start the backend application
2. Check Swagger UI: http://localhost:8080/swagger-ui.html
3. Verify tables are created: Use psql or pgAdmin
4. Test API endpoints
