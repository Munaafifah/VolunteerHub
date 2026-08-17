package com.volunteerhub.backend.dto;

public class ActivityResponse {

    private String id;
    private String title;
    private String description;
    private String category;
    private String location;
    private String activityDate;
    private String activityTime;
    private String registrationDeadline;
    private int capacity;
    private int registeredCount;
    private String status;
    private String createdBy;

    public ActivityResponse(String id, String title, String description, String category, String location,
                             String activityDate, String activityTime, String registrationDeadline,
                             int capacity, int registeredCount, String status, String createdBy) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.location = location;
        this.activityDate = activityDate;
        this.activityTime = activityTime;
        this.registrationDeadline = registrationDeadline;
        this.capacity = capacity;
        this.registeredCount = registeredCount;
        this.status = status;
        this.createdBy = createdBy;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public String getLocation() {
        return location;
    }

    public String getActivityDate() {
        return activityDate;
    }

    public String getActivityTime() {
        return activityTime;
    }

    public String getRegistrationDeadline() {
        return registrationDeadline;
    }

    public int getCapacity() {
        return capacity;
    }

    public int getRegisteredCount() {
        return registeredCount;
    }

    public String getStatus() {
        return status;
    }

    public String getCreatedBy() {
        return createdBy;
    }
}