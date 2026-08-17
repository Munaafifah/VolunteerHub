package com.volunteerhub.backend.dto;

public class RegistrationResponse {

    private String id;
    private String userId;
    private String activityId;
    private String status;
    private String registeredAt;
    private String cancelledAt;

    public RegistrationResponse(String id, String userId, String activityId, String status,
                                 String registeredAt, String cancelledAt) {
        this.id = id;
        this.userId = userId;
        this.activityId = activityId;
        this.status = status;
        this.registeredAt = registeredAt;
        this.cancelledAt = cancelledAt;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getActivityId() {
        return activityId;
    }

    public String getStatus() {
        return status;
    }

    public String getRegisteredAt() {
        return registeredAt;
    }

    public String getCancelledAt() {
        return cancelledAt;
    }
}