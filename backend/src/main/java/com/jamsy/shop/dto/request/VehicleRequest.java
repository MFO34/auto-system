package com.jamsy.shop.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRequest {

    @NotBlank(message = "License plate is required")
    private String licensePlate;

    private String brand;
    private String model;
    private Integer year;
    private String fuelType;
    private Integer mileage;
    private String color;
    private Long ownerId;
}
