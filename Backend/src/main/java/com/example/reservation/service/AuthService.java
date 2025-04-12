package com.example.reservation.service;

import com.example.reservation.model.User;
import com.example.reservation.repository.UserRepository;
import com.example.reservation.security.JwtService;
import com.example.reservation.dto.AuthRequest;
import com.example.reservation.dto.AuthResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsService userDetailsService;

    // Authentification de l'utilisateur et génération du JWT
    public AuthResponse authenticate(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        String jwtToken = jwtService.generateToken(authRequest.getUsername()); // Use the username (email) directly

        return new AuthResponse(jwtToken);
    }

    // Enregistrer un nouvel utilisateur
    public AuthResponse register(User user) {
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user.getEmail());

        return new AuthResponse(jwtToken);
    }

    public void authenticateUser(String userEmail, String jwt, HttpServletRequest request) {
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail); // Ensure this matches the email
            if (jwtService.isTokenValid(jwt, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
    }
}