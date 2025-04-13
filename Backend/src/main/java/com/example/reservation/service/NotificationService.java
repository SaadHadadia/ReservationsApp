package com.example.reservation.service;

import com.example.reservation.exception.ResourceNotFoundException;
import com.example.reservation.model.Notification;
import com.example.reservation.model.User;
import com.example.reservation.repository.NotificationRepository;
import com.example.reservation.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Notification sendNotification(Long userId, String message) {
        // Check if the user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Create and save the notification
        Notification notification = new Notification();
        notification.setMessage(message.trim()); // Store only the message
        notification.setSeen(false);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setUser(user);

        return notificationRepository.save(notification);
    }

    // Retrieve all notifications for the authenticated user
    public List<Notification> getUserNotifications() {
        User user = getAuthenticatedUser();
        return notificationRepository.findByUserId(user.getId());
    }

    // Mark a specific notification as read
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        // Ensure the notification belongs to the authenticated user
        User user = getAuthenticatedUser();
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("You are not authorized to mark this notification as read");
        }

        notification.setSeen(true);
        return notificationRepository.save(notification);
    }

    // Helper method to get the authenticated user
    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        } else {
            throw new IllegalStateException("User not authenticated");
        }
    }
}