package com.example.reservation.controller;

import com.example.reservation.dto.NotificationRequest;
import com.example.reservation.model.Notification;
import com.example.reservation.service.NotificationService;
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
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all notifications for the authenticated user
    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications() {
        List<Notification> notifications = notificationService.getUserNotifications();
        return ResponseEntity.ok(notifications);
    }

    // Mark a specific notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long notificationId) {
        Notification notification = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(notification);
    }
}