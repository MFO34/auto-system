package com.jamsy.shop.service;

import com.jamsy.shop.entity.MaintenanceOption;
import com.jamsy.shop.exception.NotFoundException;
import com.jamsy.shop.repository.MaintenanceOptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceOptionServiceImpl implements MaintenanceOptionService {

    private final MaintenanceOptionRepository maintenanceOptionRepository;

    @Override
    @Transactional
    public MaintenanceOption saveMaintenanceOption(MaintenanceOption option) {
        return maintenanceOptionRepository.save(option);
    }

    @Override
    public List<MaintenanceOption> getAllMaintenanceOptions() {
        return maintenanceOptionRepository.findAll();
    }

    @Override
    public List<MaintenanceOption> getActiveMaintenanceOptions() {
        return maintenanceOptionRepository.findByActiveTrue();
    }

    @Override
    public MaintenanceOption getMaintenanceOptionById(Long id) {
        return maintenanceOptionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Maintenance option not found with id: " + id));
    }

    @Override
    public List<MaintenanceOption> getMaintenanceOptionsByCategory(String category) {
        return maintenanceOptionRepository.findByCategory(category);
    }

    @Override
    public List<MaintenanceOption> getMaintenanceOptionsByCategoryAndActive(String category) {
        return maintenanceOptionRepository.findByCategoryAndActiveTrue(category);
    }

    @Override
    public List<MaintenanceOption> getMaintenanceOptionsForFuelType(String fuelType) {
        // Include both options compatible with the specific fuel type and options compatible with ALL fuel types
        List<String> compatibleFuelTypes = Arrays.asList(fuelType, "ALL");
        return maintenanceOptionRepository.findByCompatibleFuelTypeInAndActiveTrue(compatibleFuelTypes);
    }

    @Override
    @Transactional
    public MaintenanceOption updateMaintenanceOption(Long id, MaintenanceOption option) {
        MaintenanceOption existingOption = getMaintenanceOptionById(id);

        if (option.getCategory() != null) {
            existingOption.setCategory(option.getCategory());
        }
        if (option.getName() != null) {
            existingOption.setName(option.getName());
        }
        if (option.getDescription() != null) {
            existingOption.setDescription(option.getDescription());
        }
        if (option.getPrice() != null) {
            existingOption.setPrice(option.getPrice());
        }
        if (option.getActive() != null) {
            existingOption.setActive(option.getActive());
        }
        if (option.getCompatibleFuelType() != null) {
            existingOption.setCompatibleFuelType(option.getCompatibleFuelType());
        }
        if (option.getBrand() != null) {
            existingOption.setBrand(option.getBrand());
        }
        if (option.getDisplayOrder() != null) {
            existingOption.setDisplayOrder(option.getDisplayOrder());
        }

        return maintenanceOptionRepository.save(existingOption);
    }

    @Override
    @Transactional
    public void deleteMaintenanceOption(Long id) {
        MaintenanceOption option = getMaintenanceOptionById(id);
        maintenanceOptionRepository.delete(option);
    }
}
