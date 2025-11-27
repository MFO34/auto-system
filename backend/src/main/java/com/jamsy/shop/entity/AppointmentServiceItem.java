package com.jamsy.shop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "appointment_service_item")
public class AppointmentServiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    // Quantity (e.g., 2 oil filters, 1 wash service)
    @Builder.Default
    private Integer quantity = 1;

    // Price snapshot at time of booking (preserves price even if service price changes later)
    private Double priceAtBooking;

    // Subtotal for this line item (priceAtBooking * quantity)
    private Double subtotal;
}
