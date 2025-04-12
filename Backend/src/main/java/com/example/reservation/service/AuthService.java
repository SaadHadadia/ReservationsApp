package com.example.reservation.service;

import com.example.reservation.model.User;
import com.example.reservation.repository.UserRepository;
import com.example.reservation.security.JwtService;
import com.example.reservation.dto.AuthRequest;
import com.example.reservation.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    // Authentification de l'utilisateur et génération du JWT
    public AuthResponse authenticate(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        String jwtToken = jwtService.generateToken(String.valueOf(authentication));

        return new AuthResponse(jwtToken);
    }

    // Enregistrer un nouvel utilisateur
    public AuthResponse register(User user) {
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user.getEmail());

        return new AuthResponse(jwtToken);
    }
}