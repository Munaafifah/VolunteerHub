package com.volunteerhub.backend.config;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import com.volunteerhub.backend.model.Activity;
import com.volunteerhub.backend.repository.ActivityRepository;

@Configuration
@Order(1)
public class ActivityDataSeeder {

    @Bean
    CommandLineRunner seedActivities(ActivityRepository activityRepository) {
        return args -> {
            if (activityRepository.count() > 0) {
                return;
            }

            activityRepository.save(new Activity(
                    "Beach Cleanup Drive",
                    "Community beach cleanup to remove plastic waste and debris along the shoreline.",
                    "Environment",
                    "Sunway Beach",
                    LocalDate.of(2026, 9, 15),
                    "08:00",
                    LocalDate.of(2026, 9, 10),
                    30,
                    12,
                    "ACTIVE",
                    "admin1"
            ));

            activityRepository.save(new Activity(
                    "Blood Donation Camp",
                    "Blood donation drive in partnership with the local hospital blood bank.",
                    "Health",
                    "Puchong Community Hall",
                    LocalDate.of(2026, 9, 20),
                    "09:00",
                    LocalDate.of(2026, 9, 18),
                    50,
                    50,
                    "ACTIVE",
                    "admin1"
            ));

            activityRepository.save(new Activity(
                    "Tuition for Underprivileged Kids",
                    "Weekend tuition support for underprivileged primary school children.",
                    "Education",
                    "SJK Taman Wawasan",
                    LocalDate.of(2026, 9, 25),
                    "14:00",
                    LocalDate.of(2026, 9, 22),
                    15,
                    6,
                    "ACTIVE",
                    "admin2"
            ));

            activityRepository.save(new Activity(
                    "Stray Animal Feeding Program",
                    "Feeding and basic health checks for stray animals around the neighbourhood.",
                    "Animal Welfare",
                    "Bandar Puteri",
                    LocalDate.of(2026, 10, 1),
                    "07:30",
                    LocalDate.of(2026, 9, 28),
                    20,
                    3,
                    "ACTIVE",
                    "admin2"
            ));

            activityRepository.save(new Activity(
                    "Elderly Home Visit",
                    "Visit and spend time with residents at the elderly care home.",
                    "Community",
                    "Rumah Seri Kenangan",
                    LocalDate.of(2026, 8, 25),
                    "10:00",
                    LocalDate.of(2026, 8, 20),
                    25,
                    10,
                    "INACTIVE",
                    "admin1"
            ));
        };
    }
}