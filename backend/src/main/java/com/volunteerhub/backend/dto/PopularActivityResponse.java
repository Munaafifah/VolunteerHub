package com.volunteerhub.backend.dto;

public class PopularActivityResponse {

    private String activityId;
    private String title;
    private String category;
    private String location;
    private long registrationCount;

    public PopularActivityResponse() {
    }

    public PopularActivityResponse(String activityId, String title, String category,
                                    String location, long registrationCount) {
        this.activityId = activityId;
        this.title = title;
        this.category = category;
        this.location = location;
        this.registrationCount = registrationCount;
    }

    public String getActivityId() {
        return activityId;
    }

    public void setActivityId(String activityId) {
        this.activityId = activityId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public long getRegistrationCount() {
        return registrationCount;
    }

    public void setRegistrationCount(long registrationCount) {
        this.registrationCount = registrationCount;
    }
}