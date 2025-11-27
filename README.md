# Auto Car Wash & Maintenance Appointment System

## Description
This project is a car wash and auto maintenance management system designed for auto service workshops. The system enables customers to book car wash services and maintenance appointments online, while providing workshop administrators with tools to manage appointments, staff, services, and inventory. The system consists of a frontend built with React and a backend built with Spring Boot.

## Features
- **Online Appointment Booking**: Customers can book car wash and maintenance services with vehicle details.
- **Vehicle Management**: Track customer vehicles with details like license plate, brand, model, and fuel type.
- **Service Management**: Manage car wash services (exterior wash, interior cleaning, detailing) and maintenance services (oil change, brake check, tire rotation, etc.).
- **Maintenance Wizard**: Step-by-step guided flow for selecting maintenance options (oils, filters, inspections).
- **Price Calculator**: Real-time price calculation based on selected services.
- **Staff Management**: Manage mechanics and service staff profiles, schedules, and specializations.
- **Inventory Management**: Track auto products and supplies (motor oil, filters, cleaning products, etc.).
- **Financial Tracking**: Monitor payments and revenue.

## Technologies Used
- **Frontend**: React, React Router, Axios, Bootstrap
- **Backend**: Spring Boot 3.2.2, Java 21, Spring Data JPA, Spring Security
- **Database**: PostgreSQL 14+
- **API Documentation**: OpenAPI 3.0 (Swagger UI)
- **Other**: JWT Authentication, MapStruct, JasperReports, RESTful API

## Domain Model

### Core Entities
- **Vehicle**: Customer vehicle information (license plate, brand, model, year, fuel type, mileage, color)
- **Appointment**: Car wash/maintenance bookings with vehicle, services, date/time, and pricing
- **Service**: Car wash and maintenance services with prices and categories (WASH/MAINTENANCE)
- **AppointmentServiceItem**: Junction table linking appointments to multiple services with quantities
- **MaintenanceOption**: Maintenance wizard options (oils, filters, etc.) categorized by type and fuel compatibility
- **Employee**: Workshop staff (mechanics, service workers) with specializations
- **User**: Customer accounts with authentication
- **Financial**: Payment tracking for appointments

### Key Endpoints

#### Appointments
- `POST /appointment/book` - Create new appointment with vehicle and services
- `POST /appointment/calculate-price` - Calculate total price for selected services
- `GET /appointment/view` - Get all appointments
- `PUT /appointment/status/{id}` - Update appointment status

#### Vehicles
- `POST /api/vehicles` - Register new vehicle
- `GET /api/vehicles/owner/{ownerId}` - Get vehicles by owner
- `GET /api/vehicles/license-plate/{plate}` - Find vehicle by license plate

#### Services
- `GET /api/services` - Get all services
- `GET /api/services?serviceType=WASH` - Filter by service type

#### Maintenance Options
- `GET /api/maintenance-options?activeOnly=true` - Get active maintenance options
- `GET /api/maintenance-options/category/{category}` - Get by category (OIL, FILTER, etc.)
- `GET /api/maintenance-options/fuel-type/{fuelType}` - Get compatible options for fuel type

## Installation
### Prerequisites
- **Node.js** 16+ and npm
- **Java 21** (JDK 21)
- **Maven** 3.8+
- **PostgreSQL** 14+ database server

### Database Setup
See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed PostgreSQL setup instructions.

**Quick Setup:**
```bash
# Create database
psql -U postgres
CREATE DATABASE auto_carwash_db;
\q
```

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/MuhammedJamzeeth/Salon-Management-System.git
cd Auto-Industry-System/backend

# Configure database
# Edit src/main/resources/application.properties
# Update: spring.datasource.username and spring.datasource.password

# Build the backend
mvn clean package -DskipTests

# Run the backend
mvn spring-boot:run
# OR
java -jar target/auto-carwash-management-0.0.1-SNAPSHOT.jar
```

Backend will be available at: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

### Frontend Setup

**Customer Portal:**
```bash
cd frontend-client
npm install
npm start
```
Available at: `http://localhost:3000`

**Admin Panel:**
```bash
cd frontend-admin
npm install
npm start
```
Available at: `http://localhost:3001` (or next available port)

## Usage
1. **Customer Flow**: Browse services → Select car wash/maintenance → Enter vehicle details → Choose date/time → See total price → Confirm booking
2. **Admin Flow**: Sign in → View appointments → Manage services and pricing → Manage staff → Track payments

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the [MIT License](LICENSE).