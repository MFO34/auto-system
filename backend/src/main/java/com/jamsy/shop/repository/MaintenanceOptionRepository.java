package com.jamsy.shop.repository;

import com.jamsy.shop.entity.MaintenanceOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceOptionRepository extends JpaRepository<MaintenanceOption, Long> {

    List<MaintenanceOption> findByCategory(String category);

    List<MaintenanceOption> findByActiveTrue();

    List<MaintenanceOption> findByCategoryAndActiveTrue(String category);

    List<MaintenanceOption> findByCompatibleFuelTypeInAndActiveTrue(List<String> fuelTypes);

    List<MaintenanceOption> findByCategoryAndCompatibleFuelTypeInAndActiveTrue(String category, List<String> fuelTypes);
}
