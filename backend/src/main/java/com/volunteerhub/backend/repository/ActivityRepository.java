package com.volunteerhub.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.volunteerhub.backend.model.Activity;

public interface ActivityRepository extends MongoRepository<Activity, String> {

    List<Activity> findByStatus(String status);

    List<Activity> findByCategory(String category);

    List<Activity> findByLocation(String location);
}