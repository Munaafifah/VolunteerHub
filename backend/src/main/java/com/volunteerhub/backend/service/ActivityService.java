package com.volunteerhub.backend.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.volunteerhub.backend.dto.ActivityResponse;
import com.volunteerhub.backend.dto.CreateActivityRequest;
import com.volunteerhub.backend.dto.UpdateActivityRequest;
import com.volunteerhub.backend.exception.ResourceNotFoundException;
import com.volunteerhub.backend.model.Activity;
import com.volunteerhub.backend.repository.ActivityRepository;

@Service
public class ActivityService {

    private static final Logger log = LoggerFactory.getLogger(ActivityService.class);

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public List<ActivityResponse> getAllActivities(String status, String category, String location) {
        log.info("Fetching activities with filters - status={}, category={}, location={}", status, category, location);

        List<Activity> activities;

        if (status != null) {
            activities = activityRepository.findByStatus(status);
        } else if (category != null) {
            activities = activityRepository.findByCategory(category);
        } else if (location != null) {
            activities = activityRepository.findByLocation(location);
        } else {
            activities = activityRepository.findAll();
        }

        return activities.stream()
                .map(this::toResponse)
                .toList();
    }

    public Page<ActivityResponse> getPagedActivities(int page, int size, String sortBy, String direction) {
        log.info("Fetching paginated activities - page={}, size={}, sortBy={}, direction={}", page, size, sortBy, direction);

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<Activity> activityPage = activityRepository.findAll(pageable);

        return activityPage.map(this::toResponse);
    }

    public ActivityResponse getActivityById(String id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity " + id + " was not found"));
        return toResponse(activity);
    }

    public ActivityResponse createActivity(CreateActivityRequest request) {
        Activity newActivity = new Activity(
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getLocation(),
                request.getActivityDate(),
                request.getActivityTime(),
                request.getRegistrationDeadline(),
                request.getCapacity(),
                0,
                "ACTIVE",
                request.getCreatedBy()
        );

        Activity saved = activityRepository.save(newActivity);
        log.info("Created new activity with id={}", saved.getId());
        return toResponse(saved);
    }

    public ActivityResponse updateActivity(String id, UpdateActivityRequest request) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity " + id + " was not found"));

        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        activity.setCategory(request.getCategory());
        activity.setLocation(request.getLocation());
        activity.setActivityDate(request.getActivityDate());
        activity.setActivityTime(request.getActivityTime());
        activity.setRegistrationDeadline(request.getRegistrationDeadline());
        activity.setCapacity(request.getCapacity());
        activity.setStatus(request.getStatus());

        Activity updated = activityRepository.save(activity);
        log.info("Updated activity with id={}", updated.getId());
        return toResponse(updated);
    }

    public ActivityResponse deactivateActivity(String id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity " + id + " was not found"));

        activity.setStatus("INACTIVE");

        Activity updated = activityRepository.save(activity);
        log.info("Deactivated activity with id={}", updated.getId());
        return toResponse(updated);
    }

    private ActivityResponse toResponse(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getTitle(),
                activity.getDescription(),
                activity.getCategory(),
                activity.getLocation(),
                activity.getActivityDate().toString(),
                activity.getActivityTime(),
                activity.getRegistrationDeadline().toString(),
                activity.getCapacity(),
                activity.getRegisteredCount(),
                activity.getStatus(),
                activity.getCreatedBy()
        );
    }
}