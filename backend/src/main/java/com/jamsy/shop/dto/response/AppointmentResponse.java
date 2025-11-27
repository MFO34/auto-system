package com.jamsy.shop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {

    private Long id;
    private String customerName;
    private String customerEmail;
    private String phoneNumber;

    // Vehicle information
    private VehicleResponse vehicle;

    // Employee assignment
    private EmployeeResponse employee;

    // Services
    private List<AppointmentServiceItemResponse> services;

    // Scheduling
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;

    // Pricing
    private Double totalPrice;

    // Status
    private String status;

    // Additional info
    private String notes;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VehicleResponse {
        private Long id;
        private String licensePlate;
        private String brand;
        private String model;
        private Integer year;
        private String fuelType;
        private String color;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeeResponse {
        private Long id;
        private String firstName;
        private String lastName;
        private String specialization;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppointmentServiceItemResponse {
        private Long id;
        private String serviceName;
        private String serviceDescription;
        private Integer quantity;
        private Double priceAtBooking;
        private Double subtotal;
    }
}
