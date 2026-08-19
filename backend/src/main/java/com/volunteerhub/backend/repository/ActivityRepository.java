package com.volunteerhub.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.volunteerhub.backend.model.Activity;

public interface ActivityRepository extends MongoRepository<Activity, String> {
}