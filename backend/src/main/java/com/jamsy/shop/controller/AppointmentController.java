package com.jamsy.shop.controller;

import com.jamsy.shop.dto.request.AppointmentBookingRequest;
import com.jamsy.shop.dto.request.AppointmentServiceItemRequest;
import com.jamsy.shop.dto.response.AppointmentResponse;
import com.jamsy.shop.dto.response.PriceCalculationResponse;
import com.jamsy.shop.entity.Appointment;
import com.jamsy.shop.repository.AppointmentRepository;
import com.jamsy.shop.service.AppointmentBookingService;
import com.jamsy.shop.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/appointment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AppointmentRepository appointmentRepository;
    private final AppointmentBookingService appointmentBookingService;

    @PostMapping("/save")
    public ResponseEntity<?> saveAppointment(@ModelAttribute Appointment appointment){
        System.out.println(appointment);
        List<Appointment> appointmentCheck = appointmentService.getAppointmentDetails();
        for(Appointment appointment1: appointmentCheck ){
            if(appointment1.getDate().equals(appointment.getDate()) && appointment1.getTime().equals(appointment.getTime()) && appointment1.getEmployee().getEmpId().equals(appointment.getEmployee().getEmpId())){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Date and Time already booked!!!, choose another");
            }
        }
        return ResponseEntity.ok(appointmentService.saveAppointment(appointment));
    }
    @GetMapping("/view")
    public ResponseEntity<List<Appointment>> getAllAppointment(){
        List<Appointment> appointment = appointmentService.getAppointmentDetails();
//        System.out.println(appointment);
        return ResponseEntity.ok((appointment));
    }
    @PostMapping("/setApprove/{id}")
    public ResponseEntity<?> setApprove(@RequestBody Boolean isApprove, @PathVariable Long id){
        Optional<Appointment> appointment = appointmentService.setApprove(isApprove, id);
        System.out.println(isApprove);
        return ResponseEntity.ok(appointment);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id){
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        try {
            appointmentRepository.deleteById(id);
            return ResponseEntity.ok(appointment);
        }catch (EmptyResultDataAccessException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Appointment with ID " + id + " not found.");
        }


    }

    @GetMapping("/view/{id}")
    public ResponseEntity<List<Appointment>> getAllAppointmentByEmployeeId(@PathVariable("id") Long id){
        List<Appointment> appointment = appointmentService.getAllAppointmentByEmployeeId(id);

        return ResponseEntity.ok((appointment));
    }

    // New endpoints for car wash booking system

    @PostMapping("/book")
    public ResponseEntity<AppointmentResponse> bookAppointment(@Valid @RequestBody AppointmentBookingRequest request) {
        AppointmentResponse response = appointmentBookingService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/calculate-price")
    public ResponseEntity<PriceCalculationResponse> calculatePrice(@Valid @RequestBody List<AppointmentServiceItemRequest> services) {
        PriceCalculationResponse response = appointmentBookingService.calculatePrice(services);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            appointment.setStatus(status);
            Appointment updated = appointmentRepository.save(appointment);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

}
