package com.volunteerhub.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
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
    private final MongoTemplate mongoTemplate;

    public ActivityService(ActivityRepository activityRepository, MongoTemplate mongoTemplate) {
        this.activityRepository = activityRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public Page<ActivityResponse> getPagedActivities(String keyword, String status, String category,
                                                       String location, int page, int size,
                                                       String sortBy, String direction) {
        log.info("Fetching activities - keyword={}, status={}, category={}, location={}, page={}, size={}, sortBy={}, direction={}",
                keyword, status, category, location, page, size, sortBy, direction);

        List<Criteria> criteriaList = new ArrayList<>();

        if (keyword != null && !keyword.isBlank()) {
            // Pattern.quote treats the keyword as a literal string, not a regex,
            // so special characters typed by the user (e.g. "(", "+") don't break the query
            criteriaList.add(Criteria.where("title").regex(Pattern.quote(keyword), "i"));
        }
        if (status != null && !status.isBlank()) {
            criteriaList.add(Criteria.where("status").is(status));
        }
        if (category != null && !category.isBlank()) {
            criteriaList.add(Criteria.where("category").is(category));
        }
        if (location != null && !location.isBlank()) {
            criteriaList.add(Criteria.where("location").is(location));
        }

        Query query = new Query();
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        long total = mongoTemplate.count(query, Activity.class);

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        query.with(pageable);

        List<Activity> activities = mongoTemplate.find(query, Activity.class);

        List<ActivityResponse> content = activities.stream()
                .map(this::toResponse)
                .toList();

        return new PageImpl<>(content, pageable, total);
    }

    public ActivityResponse getActivityById(String id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity " + id + " was not found"));
        return toResponse(activity);
    }

    public ActivityResponse createActivity(CreateActivityRequest request, String createdBy) {
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
                createdBy
        );

        Activity saved = activityRepository.save(newActivity);
        log.info("Created new activity with id={} createdBy={}", saved.getId(), createdBy);
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
