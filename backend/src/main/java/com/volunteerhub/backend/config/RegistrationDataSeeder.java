package com.volunteerhub.backend.config;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import com.volunteerhub.backend.model.Activity;
import com.volunteerhub.backend.model.Registration;
import com.volunteerhub.backend.repository.ActivityRepository;
import com.volunteerhub.backend.repository.RegistrationRepository;

@Configuration
public class RegistrationDataSeeder {

    @Bean
    @Order(2)
    CommandLineRunner seedRegistrations(RegistrationRepository registrationRepository,
                                         ActivityRepository activityRepository) {
        return args -> {
            if (registrationRepository.count() > 0) {
                return;
            }

            List<Activity> activities = activityRepository.findAll();

            Activity beachCleanup = findByTitle(activities, "Beach Cleanup Drive");
            Activity bloodDonation = findByTitle(activities, "Blood Donation Camp");
            Activity charityRun = findByTitle(activities, "Charity Run for Clean Water");

            if (beachCleanup == null || bloodDonation == null) {
                return;
            }

            registrationRepository.save(new Registration(
                    "user1", beachCleanup.getId(), "REGISTERED",
                    LocalDateTime.of(2026, 8, 10, 9, 15), null
            ));

            registrationRepository.save(new Registration(
                    "user2", beachCleanup.getId(), "REGISTERED",
                    LocalDateTime.of(2026, 8, 11, 10, 0), null
            ));

            registrationRepository.save(new Registration(
                    "user3", beachCleanup.getId(), "CANCELLED",
                    LocalDateTime.of(2026, 8, 9, 8, 30), LocalDateTime.of(2026, 8, 12, 14, 0)
            ));

            registrationRepository.save(new Registration(
                    "user4", bloodDonation.getId(), "REGISTERED",
                    LocalDateTime.of(2026, 8, 12, 11, 45), null
            ));

            if (charityRun != null) {
                registrationRepository.save(new Registration(
                        "user5", charityRun.getId(), "REGISTERED",
                        LocalDateTime.of(2026, 7, 15, 7, 0), null
                ));
            }
        };
    }

    private Activity findByTitle(List<Activity> activities, String title) {
        return activities.stream()
                .filter(a -> a.getTitle().equals(title))
                .findFirst()
                .orElse(null);
    }
}