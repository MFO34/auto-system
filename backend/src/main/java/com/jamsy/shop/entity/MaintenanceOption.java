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
@Table(name = "maintenance_option")
public class MaintenanceOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Category: OIL, OIL_FILTER, AIR_FILTER, POLLEN_FILTER, BRAKE_CHECK, TIRE_ROTATION, etc.
    private String category;

    // Option name (e.g., "Synthetic Oil 5W-30", "Standard Air Filter")
    private String name;

    // Detailed description
    @Column(length = 500)
    private String description;

    // Price for this option
    private Double price;

    // Active status (to hide/show options)
    @Builder.Default
    private Boolean active = true;

    // Optional: filter by fuel type (PETROL, DIESEL, ELECTRIC, HYBRID, ALL)
    private String compatibleFuelType;

    // Optional: manufacturer brand (e.g., "Castrol", "Mobil 1")
    private String brand;

    // Display order in wizard
    @Builder.Default
    private Integer displayOrder = 0;
}
