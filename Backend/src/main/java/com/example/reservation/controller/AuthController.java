package com.example.reservation.controller;

import com.example.reservation.dto.AuthRequest;
import com.example.reservation.dto.AuthResponse;
import com.example.reservation.model.User;
import com.example.reservation.service.AuthService;
import com.example.reservation.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            AuthResponse authResponse = authService.authenticate(authRequest);
            return ResponseEntity.ok(authResponse);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            AuthResponse authResponse = authService.register(user);
            return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
}