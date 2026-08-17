package com.volunteerhub.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateRegistrationRequest {

    @NotBlank(message = "Activity id is required")
    private String activityId;

    public String getActivityId() {
        return activityId;
    }

    public void setActivityId(String activityId) {
        this.activityId = activityId;
    }
}