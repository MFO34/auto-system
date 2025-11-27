package com.jamsy.shop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@Table(name = "appointment")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Customer information
    private String customerName;
    private String customerEmail;
    private String phoneNumber;

    // Vehicle information
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    // Employee assignment
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    // Services (will be linked via AppointmentServiceItem junction table)
    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AppointmentServiceItem> appointmentServices = new ArrayList<>();

    // Scheduling
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;

    // Pricing
    private Double totalPrice;

    // Status: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
    @Builder.Default
    private String status = "PENDING";

    // Payment method: CASH, CARD, ONLINE_TRANSFER
    private String paymentMethod;

    // Additional notes
    @Column(length = 500)
    private String notes;

    // Metadata
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Legacy fields - keep for backward compatibility during migration
    @Deprecated
    private String category;
    @Deprecated
    private String date;
    @Deprecated
    private String time;
    @Deprecated
    private String pno;
    @Deprecated
    private Boolean approved;
}
