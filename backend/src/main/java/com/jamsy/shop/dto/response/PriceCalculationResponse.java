package com.jamsy.shop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceCalculationResponse {

    private List<ServicePriceItem> items;
    private Double subtotal;
    private Double tax;
    private Double total;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServicePriceItem {
        private Long serviceId;
        private String serviceName;
        private Integer quantity;
        private Double unitPrice;
        private Double lineTotal;
    }
}
