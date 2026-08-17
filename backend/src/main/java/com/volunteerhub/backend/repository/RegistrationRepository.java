package com.volunteerhub.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.volunteerhub.backend.model.Registration;

public interface RegistrationRepository extends MongoRepository<Registration, String> {

    List<Registration> findByUserId(String userId);

    List<Registration> findByActivityId(String activityId);

    boolean existsByUserIdAndActivityIdAndStatus(String userId, String activityId, String status);
}