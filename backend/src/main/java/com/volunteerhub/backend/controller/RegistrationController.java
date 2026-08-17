package com.volunteerhub.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.volunteerhub.backend.dto.CreateRegistrationRequest;
import com.volunteerhub.backend.dto.RegistrationResponse;
import com.volunteerhub.backend.service.RegistrationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody CreateRegistrationRequest request,
                                                           @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("userId");
        RegistrationResponse created = registrationService.register(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public RegistrationResponse getRegistrationById(@PathVariable String id) {
        return registrationService.getRegistrationById(id);
    }

    @GetMapping("/my")
    public List<RegistrationResponse> getMyRegistrations(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("userId");
        return registrationService.getMyRegistrations(userId);
    }

    @GetMapping
    public List<RegistrationResponse> getAllRegistrations() {
        return registrationService.getAllRegistrations();
    }

    @DeleteMapping("/{id}")
    public RegistrationResponse cancelRegistration(@PathVariable String id, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("userId");
        String role = jwt.getClaimAsString("role");
        return registrationService.cancel(id, userId, role);
    }
}