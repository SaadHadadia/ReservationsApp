package com.example.reservation.service;

import com.example.reservation.exception.ResourceNotFoundException;
import com.example.reservation.model.User;
import com.example.reservation.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User create(User user) {
        return userRepository.save(user);
    }

    public User update(Long id, User userDetails) {
        if (userDetails == null) {
            throw new IllegalArgumentException("User details cannot be null");
        }
        
        User user = getById(id);
        
        if (userDetails.getEmail() != null) {
            user.setEmail(userDetails.getEmail());
        }
        
        if (userDetails.getFullName() != null) {
            user.setFullName(userDetails.getFullName());
        }
        
        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }
        
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update user: " + e.getMessage());
        }
    }

    public void delete(Long id) {
        User user = getById(id);
        userRepository.delete(user);
    }
}