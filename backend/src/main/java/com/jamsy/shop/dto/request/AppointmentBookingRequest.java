package com.jamsy.shop.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentBookingRequest {

    // Customer information
    @NotBlank(message = "Customer name is required")
    @Size(max = 100, message = "Customer name should not exceed 100 characters")
    private String customerName;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Customer email is required")
    private String customerEmail;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{10,15}", message = "Phone number should be 10-15 digits")
    private String phoneNumber;

    // Vehicle information (can be existing vehicle ID or new vehicle details)
    private Long vehicleId;  // If customer selects existing vehicle

    @Valid
    private VehicleRequest vehicleDetails;  // If customer enters new vehicle

    // Services selection
    @NotNull(message = "At least one service must be selected")
    @Size(min = 1, message = "At least one service must be selected")
    @Valid
    private List<AppointmentServiceItemRequest> services;

    // Scheduling
    @NotNull(message = "Appointment date is required")
    private LocalDate appointmentDate;

    @NotNull(message = "Appointment time is required")
    private LocalTime appointmentTime;

    // Optional fields
    private Long preferredEmployeeId;  // Optional: customer can request specific employee

    private String paymentMethod;  // Payment method: CASH, CARD, ONLINE_TRANSFER

    @Size(max = 500, message = "Notes should not exceed 500 characters")
    private String notes;
}
