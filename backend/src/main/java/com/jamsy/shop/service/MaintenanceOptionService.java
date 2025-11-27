package com.jamsy.shop.service;

import com.jamsy.shop.entity.MaintenanceOption;

import java.util.List;

public interface MaintenanceOptionService {
    MaintenanceOption saveMaintenanceOption(MaintenanceOption option);

    List<MaintenanceOption> getAllMaintenanceOptions();

    List<MaintenanceOption> getActiveMaintenanceOptions();

    MaintenanceOption getMaintenanceOptionById(Long id);

    List<MaintenanceOption> getMaintenanceOptionsByCategory(String category);

    List<MaintenanceOption> getMaintenanceOptionsByCategoryAndActive(String category);

    List<MaintenanceOption> getMaintenanceOptionsForFuelType(String fuelType);

    MaintenanceOption updateMaintenanceOption(Long id, MaintenanceOption option);

    void deleteMaintenanceOption(Long id);
}
