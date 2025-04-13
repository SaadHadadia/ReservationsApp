package com.example.reservation.controller;

import com.example.reservation.dto.NotificationRequest;
import com.example.reservation.model.Notification;
import com.example.reservation.service.NotificationService;
import com.example.reservation.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> sendNotification(@PathVariable Long userId, @RequestBody NotificationRequest request) {
        try {
            Notification notification = notificationService.sendNotification(userId, request.getMessage());
            return ResponseEntity.ok(notification);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send notification: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserNotifications() {
        try {
            return ResponseEntity.ok(notificationService.getUserNotifications());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to retrieve notifications: " + e.getMessage());
        }
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long notificationId) {
        try {
            Notification notification = notificationService.markAsRead(notificationId);
            return ResponseEntity.ok(notification);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}