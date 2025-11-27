package com.jamsy.shop.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="Service")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;

    private String serviceName;
    private String serviceDesc;
    private Double servicePrice;
    private String serviceState;
    private LocalDate serviceDate;

    // New field: Service type - WASH, MAINTENANCE, or BOTH
    // WASH: car wash services (exterior wash, interior cleaning, detailing, etc.)
    // MAINTENANCE: maintenance services (oil change, brake check, tire rotation, etc.)
    // BOTH: services that apply to both categories
    @Builder.Default
    private String serviceType = "WASH";

    // Optional: estimated duration in minutes
    private Integer durationMinutes;

    // Optional: service category for grouping (e.g., "EXTERIOR", "INTERIOR", "ENGINE")
    private String category;
}

