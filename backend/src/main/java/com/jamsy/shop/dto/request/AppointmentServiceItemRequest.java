package com.jamsy.shop.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentServiceItemRequest {

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;
}
