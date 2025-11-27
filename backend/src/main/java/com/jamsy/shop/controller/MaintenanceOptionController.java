package com.jamsy.shop.controller;

import com.jamsy.shop.entity.MaintenanceOption;
import com.jamsy.shop.service.MaintenanceOptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-options")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class MaintenanceOptionController {

    private final MaintenanceOptionService maintenanceOptionService;

    @PostMapping
    public ResponseEntity<MaintenanceOption> createMaintenanceOption(@RequestBody MaintenanceOption option) {
        MaintenanceOption savedOption = maintenanceOptionService.saveMaintenanceOption(option);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOption);
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceOption>> getAllMaintenanceOptions(
            @RequestParam(required = false, defaultValue = "false") boolean activeOnly) {
        List<MaintenanceOption> options = activeOnly
                ? maintenanceOptionService.getActiveMaintenanceOptions()
                : maintenanceOptionService.getAllMaintenanceOptions();
        return ResponseEntity.ok(options);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceOption> getMaintenanceOptionById(@PathVariable Long id) {
        MaintenanceOption option = maintenanceOptionService.getMaintenanceOptionById(id);
        return ResponseEntity.ok(option);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MaintenanceOption>> getMaintenanceOptionsByCategory(
            @PathVariable String category,
            @RequestParam(required = false, defaultValue = "false") boolean activeOnly) {
        List<MaintenanceOption> options = activeOnly
                ? maintenanceOptionService.getMaintenanceOptionsByCategoryAndActive(category)
                : maintenanceOptionService.getMaintenanceOptionsByCategory(category);
        return ResponseEntity.ok(options);
    }

    @GetMapping("/fuel-type/{fuelType}")
    public ResponseEntity<List<MaintenanceOption>> getMaintenanceOptionsForFuelType(@PathVariable String fuelType) {
        List<MaintenanceOption> options = maintenanceOptionService.getMaintenanceOptionsForFuelType(fuelType);
        return ResponseEntity.ok(options);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceOption> updateMaintenanceOption(
            @PathVariable Long id,
            @RequestBody MaintenanceOption option) {
        MaintenanceOption updatedOption = maintenanceOptionService.updateMaintenanceOption(id, option);
        return ResponseEntity.ok(updatedOption);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenanceOption(@PathVariable Long id) {
        maintenanceOptionService.deleteMaintenanceOption(id);
        return ResponseEntity.noContent().build();
    }
}
