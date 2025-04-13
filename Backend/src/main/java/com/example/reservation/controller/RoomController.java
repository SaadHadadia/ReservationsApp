package com.example.reservation.controller;

import com.example.reservation.model.Room;
import com.example.reservation.service.RoomService;
import com.example.reservation.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Room room) {
        try {
            return ResponseEntity.ok(roomService.create(room));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAll() {
        return ResponseEntity.ok(roomService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(roomService.getById(id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Room room) {
        try {
            return ResponseEntity.ok(roomService.update(id, room));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            roomService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}