package com.example.reservation.controller;

import com.example.reservation.dto.AuthRequest;
import com.example.reservation.dto.AuthResponse;
import com.example.reservation.model.User;
import com.example.reservation.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Endpoint pour l'authentification
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        AuthResponse authResponse = authService.authenticate(authRequest);
        return ResponseEntity.ok(authResponse);
    }

    // Endpoint pour l'enregistrement d'un nouvel utilisateur
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) {
        AuthResponse authResponse = authService.register(user);
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }
}