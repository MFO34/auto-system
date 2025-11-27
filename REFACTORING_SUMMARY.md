# Refactoring Summary: Salon → Auto Car Wash & Maintenance System

## Overview
This document summarizes the refactoring of the Salon Management System into an Auto Car Wash & Maintenance Appointment System.

**Date**: November 2024
**Status**: Backend Phase 1 & 2 Complete ✅

## Technology Stack Updates ✅
- ✅ **Java 17 → Java 21** - Upgraded to latest LTS version
- ✅ **MySQL → PostgreSQL** - Migrated to PostgreSQL for better performance and features
- ✅ **Spring Boot 3.2.2** - Using latest Spring Boot version with Java 21 support

---

## What Has Been Completed

### Phase 1: Backend Core Domain ✅

#### New Entities Created
1. **Vehicle** ([Vehicle.java](backend/src/main/java/com/jamsy/shop/entity/Vehicle.java))
   - Fields: licensePlate, brand, model, year, fuelType, mileage, color
   - Relationship: ManyToOne with User (owner)
   - Repository: [VehicleRepository.java](backend/src/main/java/com/jamsy/shop/repository/VehicleRepository.java)
   - Service: [VehicleService.java](backend/src/main/java/com/jamsy/shop/service/VehicleService.java), [VehicleServiceImpl.java](backend/src/main/java/com/jamsy/shop/service/VehicleServiceImpl.java)

2. **AppointmentServiceItem** ([AppointmentServiceItem.java](backend/src/main/java/com/jamsy/shop/entity/AppointmentServiceItem.java))
   - Junction table for Appointment-Service many-to-many relationship
   - Fields: appointment, service, quantity, priceAtBooking, subtotal
   - Enables multiple services per appointment

3. **MaintenanceOption** ([MaintenanceOption.java](backend/src/main/java/com/jamsy/shop/entity/MaintenanceOption.java))
   - For maintenance wizard step-by-step flow
   - Fields: category, name, description, price, active, compatibleFuelType, brand, displayOrder
   - Repository: [MaintenanceOptionRepository.java](backend/src/main/java/com/jamsy/shop/repository/MaintenanceOptionRepository.java)

#### Refactored Entities

1. **Appointment** ([Appointment.java](backend/src/main/java/com/jamsy/shop/entity/Appointment.java))
   - **Added**:
     - `phoneNumber`: Customer phone
     - `vehicle`: ManyToOne relationship with Vehicle
     - `appointmentServices`: OneToMany with AppointmentServiceItem
     - `appointmentDate`: LocalDate (was String)
     - `appointmentTime`: LocalTime (was String)
     - `totalPrice`: Double (calculated total)
     - `status`: String (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)
     - `notes`: Additional customer notes
     - `createdAt`: Timestamp
   - **Deprecated** (kept for backward compatibility):
     - `category`, `date`, `time`, `pno`, `approved`

2. **ServiceEntity** ([ServiceEntity.java](backend/src/main/java/com/jamsy/shop/entity/ServiceEntity.java))
   - **Added**:
     - `serviceType`: String (WASH, MAINTENANCE, BOTH)
     - `durationMinutes`: Integer (estimated service duration)
     - `category`: String (e.g., EXTERIOR, INTERIOR, ENGINE)

3. **Employee** - No changes to entity
   - Interpretation: Now represents mechanics/workshop staff
   - `empService` field can be used for specialization (e.g., "Wash Specialist", "Mechanic")

4. **Product** - No changes to entity
   - Interpretation: Now represents auto products (motor oil, filters, cleaning supplies, wax, etc.)

5. **User**, **Financial**, **Review**, **Contact** - No changes
   - These entities are domain-agnostic and work for both salon and car wash

---

### Phase 2: Backend Controllers & Services ✅

#### New Controllers

1. **VehicleController** ([VehicleController.java](backend/src/main/java/com/jamsy/shop/controller/VehicleController.java))
   - `POST /api/vehicles` - Create vehicle
   - `GET /api/vehicles` - Get all vehicles
   - `GET /api/vehicles/{id}` - Get vehicle by ID
   - `GET /api/vehicles/license-plate/{licensePlate}` - Find by license plate
   - `GET /api/vehicles/owner/{ownerId}` - Get vehicles by owner
   - `PUT /api/vehicles/{id}` - Update vehicle
   - `DELETE /api/vehicles/{id}` - Delete vehicle

2. **MaintenanceOptionController** ([MaintenanceOptionController.java](backend/src/main/java/com/jamsy/shop/controller/MaintenanceOptionController.java))
   - `POST /api/maintenance-options` - Create maintenance option
   - `GET /api/maintenance-options?activeOnly=true` - Get all/active options
   - `GET /api/maintenance-options/{id}` - Get by ID
   - `GET /api/maintenance-options/category/{category}` - Get by category
   - `GET /api/maintenance-options/fuel-type/{fuelType}` - Get compatible options for fuel type
   - `PUT /api/maintenance-options/{id}` - Update option
   - `DELETE /api/maintenance-options/{id}` - Delete option

#### New Services

1. **AppointmentBookingService** ([AppointmentBookingService.java](backend/src/main/java/com/jamsy/shop/service/AppointmentBookingService.java))
   - `createAppointment()`: Handles new appointment booking with vehicle and multiple services
   - `calculatePrice()`: Calculates total price for selected services
   - Handles vehicle creation or selection
   - Creates Financial record automatically

2. **MaintenanceOptionService** ([MaintenanceOptionService.java](backend/src/main/java/com/jamsy/shop/service/MaintenanceOptionService.java), [MaintenanceOptionServiceImpl.java](backend/src/main/java/com/jamsy/shop/service/MaintenanceOptionServiceImpl.java))
   - CRUD operations for maintenance options
   - Filter by category, fuel type, active status

#### Updated Controllers

1. **AppointmentController** ([AppointmentController.java](backend/src/main/java/com/jamsy/shop/controller/AppointmentController.java))
   - **Added new endpoints**:
     - `POST /appointment/book` - Create appointment with new domain model
     - `POST /appointment/calculate-price` - Calculate price for services
     - `PUT /appointment/status/{id}` - Update appointment status
   - **Kept legacy endpoints** for backward compatibility:
     - `POST /appointment/save`
     - `GET /appointment/view`
     - `POST /appointment/setApprove/{id}`
     - `DELETE /appointment/delete/{id}`

#### New DTOs

**Request DTOs** (in [backend/src/main/java/com/jamsy/shop/dto/request/](backend/src/main/java/com/jamsy/shop/dto/request/))
- `VehicleRequest.java` - Vehicle information
- `AppointmentServiceItemRequest.java` - Service selection with quantity
- `AppointmentBookingRequest.java` - Complete appointment booking request

**Response DTOs** (in [backend/src/main/java/com/jamsy/shop/dto/response/](backend/src/main/java/com/jamsy/shop/dto/response/))
- `AppointmentResponse.java` - Appointment details with nested vehicle, employee, and services
- `PriceCalculationResponse.java` - Price breakdown with line items

---

## What Remains To Be Done

### Phase 3: Frontend Client (Customer-Facing) 🔜

1. **Update UI Labels and Text**
   - Rename "Salon" → "Car Wash & Maintenance"
   - Update service descriptions
   - Change "Barber/Stylist" → "Mechanic/Service Staff"

2. **Refactor BookingService.js**
   - Add vehicle information form
   - Support multiple service selection
   - Integrate with `/appointment/calculate-price` endpoint
   - Show real-time price calculation
   - Call `/appointment/book` with new request format

3. **Rename Pages**
   - `BarberShop.js` → `OurTeam.js` or `TeamPage.js`
   - Update ServicesPage to show wash vs. maintenance categories

4. **Update Service Display**
   - Filter/categorize by serviceType (WASH vs MAINTENANCE)
   - Show service duration and category

### Phase 4: Frontend Admin (Workshop Management) 🔜

1. **Rename Folders and Components**
   - `Staffs/` → `Employees/`
   - `Appoinments/` → `Appointments/` (fix typo)

2. **Update Appointment Management**
   - Show vehicle details in appointment list
   - Display multiple services per appointment
   - Show calculated total price
   - Update status dropdown (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)

3. **Add Vehicle Management Page**
   - List all registered vehicles
   - Search by license plate
   - View vehicle owner and appointment history

4. **Update Service Management**
   - Add serviceType field (WASH/MAINTENANCE/BOTH)
   - Add category field
   - Add durationMinutes field

5. **Add Maintenance Options Management**
   - CRUD for maintenance wizard options
   - Categorize by OIL, FILTER, BRAKE_CHECK, etc.
   - Set fuel type compatibility

### Phase 5: Maintenance Wizard (Customer Frontend) 🔜

1. **Create Multi-Step Form Component**
   - Step 1: Vehicle information (brand, model, mileage, fuel type)
   - Step 2: Oil selection (filtered by fuel type)
   - Step 3: Filters (oil filter, air filter, pollen filter - optional add-ons)
   - Step 4: Extra services (brake check, tire rotation, general inspection)
   - Step 5: Summary & pricing
   - Step 6: Date/time selection
   - Step 7: Confirmation

2. **API Integration**
   - Call `/api/maintenance-options/fuel-type/{fuelType}` to get compatible options
   - Call `/appointment/calculate-price` after each step
   - Call `/appointment/book` on final confirmation

### Phase 6: Cleanup & Polish 🔜

1. **Database Migration**
   - Remove or migrate legacy fields (category, date, time, pno, approved)
   - Add indexes for performance (licensePlate, appointmentDate, status)

2. **Update All UI Strings**
   - Search and replace remaining salon terminology
   - Update Turkish translations if applicable

3. **API Documentation**
   - Update OpenAPI/Swagger docs with new endpoints
   - Add example requests/responses

4. **Testing**
   - Test appointment booking flow end-to-end
   - Test vehicle management
   - Test price calculation
   - Test maintenance wizard

---

## Technical Decisions Made

### Why These Choices?

1. **Kept existing User/Employee entities**
   - Reduces breaking changes
   - Authentication system works as-is
   - Employee entity is generic enough (just change UI labels)

2. **Added Vehicle as separate entity**
   - Customers can own multiple vehicles
   - Enables vehicle history tracking
   - Prepares for future features (maintenance reminders based on mileage)

3. **AppointmentServiceItem junction table**
   - Supports multiple services per appointment
   - Preserves price at time of booking (price snapshot)
   - Allows quantity (e.g., 2 oil filters)

4. **Kept legacy Appointment fields as @Deprecated**
   - Backward compatibility during transition
   - Existing frontend can still work temporarily
   - Can be removed after full frontend migration

5. **Separate MaintenanceOption from ServiceEntity**
   - Different use case: wizard options vs bookable services
   - More flexibility (fuel type compatibility, display order)
   - Cleaner domain separation

6. **Status field instead of Boolean approved**
   - More flexible workflow (PENDING → CONFIRMED → IN_PROGRESS → COMPLETED)
   - Supports cancellations
   - Better for reporting

---

## Migration Path for Frontend

### Priority Order

1. **High Priority** (Do First):
   - Update booking flow with vehicle details
   - Integrate new `/appointment/book` endpoint
   - Show multiple services in appointment details

2. **Medium Priority**:
   - Rename UI labels and pages
   - Add vehicle management for admin
   - Update service management with new fields

3. **Low Priority** (Nice to Have):
   - Maintenance wizard
   - Advanced filtering
   - Mobile responsiveness improvements

---

## API Examples

### Create Appointment
```json
POST /appointment/book
{
  "customerName": "Ahmet Yılmaz",
  "customerEmail": "ahmet@example.com",
  "phoneNumber": "5551234567",
  "vehicleDetails": {
    "licensePlate": "34ABC123",
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2020,
    "fuelType": "PETROL"
  },
  "services": [
    { "serviceId": 1, "quantity": 1 },
    { "serviceId": 3, "quantity": 1 }
  ],
  "appointmentDate": "2025-11-30",
  "appointmentTime": "14:00",
  "notes": "Arabanın içi çok kirli"
}
```

### Calculate Price
```json
POST /appointment/calculate-price
[
  { "serviceId": 1, "quantity": 1 },
  { "serviceId": 3, "quantity": 1 }
]
```

Response:
```json
{
  "items": [
    {
      "serviceId": 1,
      "serviceName": "Exterior Wash",
      "quantity": 1,
      "unitPrice": 100.0,
      "lineTotal": 100.0
    },
    {
      "serviceId": 3,
      "serviceName": "Interior Cleaning",
      "quantity": 1,
      "unitPrice": 150.0,
      "lineTotal": 150.0
    }
  ],
  "subtotal": 250.0,
  "tax": 0.0,
  "total": 250.0
}
```

---

## Database Schema Changes

### New Tables
- `vehicle` - Vehicle information
- `appointment_service_item` - Junction table for appointments and services
- `maintenance_option` - Maintenance wizard options

### Modified Tables
- `appointment` - Added: vehicle_id, phone_number, appointment_date, appointment_time, total_price, status, notes, created_at
- `service` - Added: service_type, duration_minutes, category

---

## Next Steps

To continue the refactoring:

1. Start with Phase 3 (Frontend Client)
2. Update the main booking flow first
3. Test the new booking API
4. Then move to admin panel updates
5. Finally implement the maintenance wizard

**Recommendation**: Test each phase thoroughly before moving to the next. The backend is now ready and buildable! ✅

---

## Questions or Issues?

If you encounter any problems:
1. Check that all imports are correct
2. Ensure database schema is up to date (run migrations)
3. Verify that new endpoints are accessible
4. Test with Postman/Swagger before integrating frontend

Good luck with the frontend refactoring! 🚀
