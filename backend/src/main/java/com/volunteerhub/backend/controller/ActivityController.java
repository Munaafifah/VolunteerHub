package com.volunteerhub.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.volunteerhub.backend.dto.ActivityResponse;
import com.volunteerhub.backend.dto.CreateActivityRequest;
import com.volunteerhub.backend.dto.UpdateActivityRequest;
import com.volunteerhub.backend.service.ActivityService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public List<ActivityResponse> getAllActivities(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        return activityService.getAllActivities(status, category, location);
    }

    @GetMapping("/{id}")
    public ActivityResponse getActivityById(@PathVariable String id) {
        return activityService.getActivityById(id);
    }

    @PostMapping
    public ResponseEntity<ActivityResponse> createActivity(@Valid @RequestBody CreateActivityRequest request,
                                                             @AuthenticationPrincipal Jwt jwt) {
        String createdBy = jwt.getClaimAsString("userId");
        ActivityResponse created = activityService.createActivity(request, createdBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/paged")
    public Page<ActivityResponse> getPagedActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "activityDate") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return activityService.getPagedActivities(page, size, sortBy, direction);
    }

    @PutMapping("/{id}")
    public ActivityResponse updateActivity(@PathVariable String id, @Valid @RequestBody UpdateActivityRequest request) {
        return activityService.updateActivity(id, request);
    }

    @DeleteMapping("/{id}")
    public ActivityResponse deactivateActivity(@PathVariable String id) {
        return activityService.deactivateActivity(id);
    }
}