package com.example.reservation.controller;

import com.example.reservation.model.Reservation;
import com.example.reservation.model.TimeSlot;
import com.example.reservation.service.ReservationService;
import com.example.reservation.exception.ResourceNotFoundException;
import com.example.reservation.dto.CreateReservationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;
    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody CreateReservationRequest request) {
        logger.info("Received reservation request: {}", request);
        try {
            LocalDateTime startTime = LocalDateTime.parse(request.getDate() + "T" + request.getStartTime());
            LocalDateTime endTime = LocalDateTime.parse(request.getDate() + "T" + request.getEndTime());
            TimeSlot timeSlot = new TimeSlot(startTime, endTime);
            Reservation reservation = reservationService.reserveRoom(timeSlot, request.getRoomId(), request.getPurpose(), request.getAttendees());
            logger.info("Reservation created successfully with ID: {}", reservation.getId());
            return ResponseEntity.ok(reservation);
        } catch (IllegalStateException | IllegalArgumentException e) {
            logger.error("Error creating reservation: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            logger.error("Error creating reservation: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/admin")
    public ResponseEntity<?> createReservationForUser(@RequestBody CreateReservationRequest request) {
        logger.info("Received admin reservation request: {}", request);
        try {
            LocalDateTime startTime = LocalDateTime.parse(request.getDate() + "T" + request.getStartTime());
            LocalDateTime endTime = LocalDateTime.parse(request.getDate() + "T" + request.getEndTime());
            TimeSlot timeSlot = new TimeSlot(startTime, endTime);
            Reservation reservation = reservationService.reserveRoomForUser(
                timeSlot, 
                request.getRoomId(), 
                request.getPurpose(), 
                request.getAttendees(),
                request.getUserId()
            );
            logger.info("Admin reservation created successfully with ID: {}", reservation.getId());
            return ResponseEntity.ok(reservation);
        } catch (IllegalStateException | IllegalArgumentException e) {
            logger.error("Error creating admin reservation: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            logger.error("Error creating admin reservation: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/{roomId}")
    public ResponseEntity<?> create(@PathVariable Long roomId, @RequestBody TimeSlot timeSlot) {
        try {
            Reservation reservation = reservationService.reserveRoom(timeSlot, roomId, "Default purpose", 1);
            return ResponseEntity.ok(reservation);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAll() {
        return ResponseEntity.ok(reservationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(reservationService.getById(id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Reservation reservation) {
        try {
            return ResponseEntity.ok(reservationService.update(id, reservation));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            reservationService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}