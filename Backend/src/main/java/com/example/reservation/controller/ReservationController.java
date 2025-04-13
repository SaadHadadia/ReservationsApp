package com.example.reservation.controller;

import com.example.reservation.model.Reservation;
import com.example.reservation.model.TimeSlot;
import com.example.reservation.service.ReservationService;
import com.example.reservation.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/{roomId}")
    public ResponseEntity<?> create(@PathVariable Long roomId, @RequestBody TimeSlot timeSlot) {
        try {
            Reservation reservation = reservationService.reserveRoom(timeSlot, roomId);
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