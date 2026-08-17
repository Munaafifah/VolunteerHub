package com.volunteerhub.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateRegistrationRequest {

    @NotBlank(message = "User id is required")
    private String userId;

    @NotBlank(message = "Activity id is required")
    private String activityId;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getActivityId() {
        return activityId;
    }

    public void setActivityId(String activityId) {
        this.activityId = activityId;
    }
}