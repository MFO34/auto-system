package com.jamsy.shop.service;

import com.jamsy.shop.entity.Vehicle;
import com.jamsy.shop.exception.NotFoundException;
import com.jamsy.shop.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Override
    @Transactional
    public Vehicle saveVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Override
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Override
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Vehicle not found with id: " + id));
    }

    @Override
    public Vehicle getVehicleByLicensePlate(String licensePlate) {
        return vehicleRepository.findByLicensePlate(licensePlate)
                .orElseThrow(() -> new NotFoundException("Vehicle not found with license plate: " + licensePlate));
    }

    @Override
    public List<Vehicle> getVehiclesByOwnerId(Long ownerId) {
        return vehicleRepository.findByOwnerId(ownerId);
    }

    @Override
    @Transactional
    public Vehicle updateVehicle(Long id, Vehicle vehicle) {
        Vehicle existingVehicle = getVehicleById(id);

        if (vehicle.getLicensePlate() != null) {
            existingVehicle.setLicensePlate(vehicle.getLicensePlate());
        }
        if (vehicle.getBrand() != null) {
            existingVehicle.setBrand(vehicle.getBrand());
        }
        if (vehicle.getModel() != null) {
            existingVehicle.setModel(vehicle.getModel());
        }
        if (vehicle.getYear() != null) {
            existingVehicle.setYear(vehicle.getYear());
        }
        if (vehicle.getFuelType() != null) {
            existingVehicle.setFuelType(vehicle.getFuelType());
        }
        if (vehicle.getMileage() != null) {
            existingVehicle.setMileage(vehicle.getMileage());
        }
        if (vehicle.getColor() != null) {
            existingVehicle.setColor(vehicle.getColor());
        }

        return vehicleRepository.save(existingVehicle);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }
}
