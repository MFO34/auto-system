package com.jamsy.shop.service;

import com.jamsy.shop.dto.request.AppointmentBookingRequest;
import com.jamsy.shop.dto.request.AppointmentServiceItemRequest;
import com.jamsy.shop.dto.response.AppointmentResponse;
import com.jamsy.shop.dto.response.PriceCalculationResponse;
import com.jamsy.shop.entity.*;
import com.jamsy.shop.exception.NotFoundException;
import com.jamsy.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentBookingService {

    private final AppointmentRepository appointmentRepository;
    private final VehicleRepository vehicleRepository;
    private final EmployeeRepository employeeRepository;
    private final ServiceRepository serviceRepository;
    private final FinancialRepository financialRepository;
    private final UserRepository userRepository;

    @Transactional
    public AppointmentResponse createAppointment(AppointmentBookingRequest request) {
        // 1. Get or create vehicle
        Vehicle vehicle = getOrCreateVehicle(request);

        // 2. Get employee if specified
        Employee employee = null;
        if (request.getPreferredEmployeeId() != null) {
            employee = employeeRepository.findById(request.getPreferredEmployeeId())
                    .orElseThrow(() -> new NotFoundException("Employee not found with id: " + request.getPreferredEmployeeId()));
        }

        // 3. Calculate total price and create service items
        List<AppointmentServiceItem> serviceItems = new ArrayList<>();
        double totalPrice = 0.0;

        for (AppointmentServiceItemRequest serviceReq : request.getServices()) {
            ServiceEntity service = serviceRepository.findById(serviceReq.getServiceId())
                    .orElseThrow(() -> new NotFoundException("Service not found with id: " + serviceReq.getServiceId()));

            double subtotal = service.getServicePrice() * serviceReq.getQuantity();
            totalPrice += subtotal;

            AppointmentServiceItem item = AppointmentServiceItem.builder()
                    .service(service)
                    .quantity(serviceReq.getQuantity())
                    .priceAtBooking(service.getServicePrice())
                    .subtotal(subtotal)
                    .build();

            serviceItems.add(item);
        }

        // 4. Create appointment
        Appointment appointment = Appointment.builder()
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .phoneNumber(request.getPhoneNumber())
                .vehicle(vehicle)
                .employee(employee)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .totalPrice(totalPrice)
                .status("PENDING")
                .paymentMethod(request.getPaymentMethod())
                .notes(request.getNotes())
                .appointmentServices(new ArrayList<>())
                .build();

        // Set appointment reference in service items
        for (AppointmentServiceItem item : serviceItems) {
            item.setAppointment(appointment);
        }
        appointment.setAppointmentServices(serviceItems);

        // 5. Save appointment
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // 6. Create financial record
        Financial financial = new Financial();
        financial.setOrderID(savedAppointment.getId());
        financial.setEmail(savedAppointment.getCustomerEmail());
        financial.setPaymentMethod(savedAppointment.getPaymentMethod() != null ? savedAppointment.getPaymentMethod() : "PENDING");
        financial.setPaymentStatus("PENDING");
        financial.setAmount(totalPrice);
        financial.setMoneyReceived(false);
        financialRepository.save(financial);

        // 7. Convert to response DTO
        return convertToResponse(savedAppointment);
    }

    public PriceCalculationResponse calculatePrice(List<AppointmentServiceItemRequest> services) {
        List<PriceCalculationResponse.ServicePriceItem> items = new ArrayList<>();
        double subtotal = 0.0;

        for (AppointmentServiceItemRequest serviceReq : services) {
            ServiceEntity service = serviceRepository.findById(serviceReq.getServiceId())
                    .orElseThrow(() -> new NotFoundException("Service not found with id: " + serviceReq.getServiceId()));

            double lineTotal = service.getServicePrice() * serviceReq.getQuantity();
            subtotal += lineTotal;

            items.add(PriceCalculationResponse.ServicePriceItem.builder()
                    .serviceId(service.getServiceId())
                    .serviceName(service.getServiceName())
                    .quantity(serviceReq.getQuantity())
                    .unitPrice(service.getServicePrice())
                    .lineTotal(lineTotal)
                    .build());
        }

        double tax = 0.0; // Can add tax calculation here if needed
        double total = subtotal + tax;

        return PriceCalculationResponse.builder()
                .items(items)
                .subtotal(subtotal)
                .tax(tax)
                .total(total)
                .build();
    }

    private Vehicle getOrCreateVehicle(AppointmentBookingRequest request) {
        if (request.getVehicleId() != null) {
            // Use existing vehicle
            return vehicleRepository.findById(request.getVehicleId())
                    .orElseThrow(() -> new NotFoundException("Vehicle not found with id: " + request.getVehicleId()));
        } else if (request.getVehicleDetails() != null) {
            // Create new vehicle
            Vehicle vehicle = Vehicle.builder()
                    .licensePlate(request.getVehicleDetails().getLicensePlate())
                    .brand(request.getVehicleDetails().getBrand())
                    .model(request.getVehicleDetails().getModel())
                    .year(request.getVehicleDetails().getYear())
                    .fuelType(request.getVehicleDetails().getFuelType())
                    .mileage(request.getVehicleDetails().getMileage())
                    .color(request.getVehicleDetails().getColor())
                    .build();

            // Link to user if ownerId provided
            if (request.getVehicleDetails().getOwnerId() != null) {
                User owner = userRepository.findById(request.getVehicleDetails().getOwnerId())
                        .orElseThrow(() -> new NotFoundException("User not found with id: " + request.getVehicleDetails().getOwnerId()));
                vehicle.setOwner(owner);
            }

            return vehicleRepository.save(vehicle);
        } else {
            throw new IllegalArgumentException("Either vehicleId or vehicleDetails must be provided");
        }
    }

    private AppointmentResponse convertToResponse(Appointment appointment) {
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .customerName(appointment.getCustomerName())
                .customerEmail(appointment.getCustomerEmail())
                .phoneNumber(appointment.getPhoneNumber())
                .vehicle(convertVehicleToResponse(appointment.getVehicle()))
                .employee(appointment.getEmployee() != null ? convertEmployeeToResponse(appointment.getEmployee()) : null)
                .services(appointment.getAppointmentServices().stream()
                        .map(this::convertServiceItemToResponse)
                        .collect(Collectors.toList()))
                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .totalPrice(appointment.getTotalPrice())
                .status(appointment.getStatus())
                .notes(appointment.getNotes())
                .createdAt(appointment.getCreatedAt())
                .build();
    }

    private AppointmentResponse.VehicleResponse convertVehicleToResponse(Vehicle vehicle) {
        return AppointmentResponse.VehicleResponse.builder()
                .id(vehicle.getId())
                .licensePlate(vehicle.getLicensePlate())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .year(vehicle.getYear())
                .fuelType(vehicle.getFuelType())
                .color(vehicle.getColor())
                .build();
    }

    private AppointmentResponse.EmployeeResponse convertEmployeeToResponse(Employee employee) {
        return AppointmentResponse.EmployeeResponse.builder()
                .id(employee.getEmpId())
                .firstName(employee.getEmpFirstName())
                .lastName(employee.getEmpLastName())
                .specialization(employee.getEmpService())
                .build();
    }

    private AppointmentResponse.AppointmentServiceItemResponse convertServiceItemToResponse(AppointmentServiceItem item) {
        return AppointmentResponse.AppointmentServiceItemResponse.builder()
                .id(item.getId())
                .serviceName(item.getService().getServiceName())
                .serviceDescription(item.getService().getServiceDesc())
                .quantity(item.getQuantity())
                .priceAtBooking(item.getPriceAtBooking())
                .subtotal(item.getSubtotal())
                .build();
    }
}
