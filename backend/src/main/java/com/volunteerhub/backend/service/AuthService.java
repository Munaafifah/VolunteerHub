package com.volunteerhub.backend.service;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.volunteerhub.backend.dto.AuthResponse;
import com.volunteerhub.backend.dto.LoginRequest;
import com.volunteerhub.backend.dto.RegisterRequest;
import com.volunteerhub.backend.exception.DuplicateResourceException;
import com.volunteerhub.backend.model.User;
import com.volunteerhub.backend.repository.UserRepository;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        AuthenticationManager authenticationManager,
                        JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateResourceException("Email already registered: " + email);
        }

        // Self-registration always creates a VOLUNTEER account.
        // ADMIN accounts are seeded only - never client-assignable.
        User newUser = new User(
                request.getName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                "VOLUNTEER",
                LocalDateTime.now()
        );

        User savedUser = userRepository.save(newUser);
        log.info("Registered new user email={} role={}", savedUser.getEmail(), savedUser.getRole());

        return buildAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow();

        log.info("User logged in email={} role={}", user.getEmail(), user.getRole());

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                "Bearer",
                jwtService.getExpirationMinutes(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}