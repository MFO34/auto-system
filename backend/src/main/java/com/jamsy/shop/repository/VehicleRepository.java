package com.jamsy.shop.repository;

import com.jamsy.shop.entity.Vehicle;
import com.jamsy.shop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByLicensePlate(String licensePlate);

    List<Vehicle> findByOwner(User owner);

    List<Vehicle> findByOwnerId(Long ownerId);
}
