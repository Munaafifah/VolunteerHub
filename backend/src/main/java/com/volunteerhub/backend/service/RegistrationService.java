package com.volunteerhub.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.volunteerhub.backend.dto.CreateRegistrationRequest;
import com.volunteerhub.backend.dto.RegistrationResponse;
import com.volunteerhub.backend.exception.DuplicateResourceException;
import com.volunteerhub.backend.exception.ForbiddenActionException;
import com.volunteerhub.backend.exception.InvalidRequestException;
import com.volunteerhub.backend.exception.ResourceNotFoundException;
import com.volunteerhub.backend.model.Activity;
import com.volunteerhub.backend.model.Registration;
import com.volunteerhub.backend.repository.ActivityRepository;
import com.volunteerhub.backend.repository.RegistrationRepository;

@Service
public class RegistrationService {

    private static final Logger log = LoggerFactory.getLogger(RegistrationService.class);

    private static final String STATUS_REGISTERED = "REGISTERED";
    private static final String STATUS_CANCELLED = "CANCELLED";
    private static final String ROLE_ADMIN = "ADMIN";

    private final RegistrationRepository registrationRepository;
    private final ActivityRepository activityRepository;

    public RegistrationService(RegistrationRepository registrationRepository, ActivityRepository activityRepository) {
        this.registrationRepository = registrationRepository;
        this.activityRepository = activityRepository;
    }

    public RegistrationResponse register(CreateRegistrationRequest request, String userId) {
        String activityId = request.getActivityId();

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity " + activityId + " was not found"));

        if (registrationRepository.existsByUserIdAndActivityIdAndStatus(userId, activityId, STATUS_REGISTERED)) {
            throw new DuplicateResourceException(
                    "User " + userId + " is already registered for activity " + activityId);
        }

        if (LocalDate.now().isAfter(activity.getRegistrationDeadline())) {
            throw new InvalidRequestException(
                    "Registration deadline for activity " + activityId + " has passed");
        }

        if (activity.getRegisteredCount() >= activity.getCapacity()) {
            throw new InvalidRequestException(
                    "Activity " + activityId + " is already at full capacity");
        }

        Registration newRegistration = new Registration(
                userId,
                activityId,
                STATUS_REGISTERED,
                LocalDateTime.now(),
                null
        );

        Registration saved = registrationRepository.save(newRegistration);

        activity.setRegisteredCount(activity.getRegisteredCount() + 1);
        activityRepository.save(activity);

        log.info("Created registration id={} for userId={}, activityId={}", saved.getId(), userId, activityId);
        return toResponse(saved);
    }

    public RegistrationResponse cancel(String id, String requestingUserId, String requestingRole) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration " + id + " was not found"));

        boolean isOwner = registration.getUserId().equals(requestingUserId);
        boolean isAdmin = ROLE_ADMIN.equals(requestingRole);

        if (!isOwner && !isAdmin) {
            throw new ForbiddenActionException("You can only cancel your own registrations");
        }

        if (STATUS_CANCELLED.equals(registration.getStatus())) {
            throw new InvalidRequestException("Registration " + id + " is already cancelled");
        }

        registration.setStatus(STATUS_CANCELLED);
        registration.setCancelledAt(LocalDateTime.now());

        Registration updated = registrationRepository.save(registration);

        Activity activity = activityRepository.findById(updated.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity " + updated.getActivityId() + " was not found"));

        activity.setRegisteredCount(Math.max(activity.getRegisteredCount() - 1, 0));
        activityRepository.save(activity);

        log.info("Cancelled registration id={} by userId={}", updated.getId(), requestingUserId);
        return toResponse(updated);
    }

    public List<RegistrationResponse> getMyRegistrations(String userId) {
        log.info("Fetching registrations for userId={}", userId);

        return registrationRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<RegistrationResponse> getAllRegistrations() {
        log.info("Fetching all registrations");

        return registrationRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public RegistrationResponse getRegistrationById(String id) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration " + id + " was not found"));
        return toResponse(registration);
    }

    private RegistrationResponse toResponse(Registration registration) {
        return new RegistrationResponse(
                registration.getId(),
                registration.getUserId(),
                registration.getActivityId(),
                registration.getStatus(),
                registration.getRegisteredAt() != null ? registration.getRegisteredAt().toString() : null,
                registration.getCancelledAt() != null ? registration.getCancelledAt().toString() : null
        );
    }
}