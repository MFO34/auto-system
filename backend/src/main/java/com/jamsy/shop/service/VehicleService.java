package com.jamsy.shop.service;

import com.jamsy.shop.entity.Vehicle;

import java.util.List;

public interface VehicleService {
    Vehicle saveVehicle(Vehicle vehicle);

    List<Vehicle> getAllVehicles();

    Vehicle getVehicleById(Long id);

    Vehicle getVehicleByLicensePlate(String licensePlate);

    List<Vehicle> getVehiclesByOwnerId(Long ownerId);

    Vehicle updateVehicle(Long id, Vehicle vehicle);

    void deleteVehicle(Long id);
}
