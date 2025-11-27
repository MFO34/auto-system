package com.jamsy.shop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "License plate is required")
    @Column(unique = true)
    private String licensePlate;

    private String brand;           // e.g., Toyota, BMW, Mercedes
    private String model;           // e.g., Corolla, 3 Series
    private Integer year;
    private String fuelType;        // Petrol, Diesel, Electric, Hybrid
    private Integer mileage;        // Optional: for maintenance recommendations
    private String color;           // Optional: vehicle color

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;             // Link to customer who owns this vehicle
}
