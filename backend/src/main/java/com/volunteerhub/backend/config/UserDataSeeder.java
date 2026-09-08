package com.volunteerhub.backend.config;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.volunteerhub.backend.model.User;
import com.volunteerhub.backend.repository.UserRepository;

@Configuration
public class UserDataSeeder {

    private static final Logger log = LoggerFactory.getLogger(UserDataSeeder.class);

    @Bean
    @Order(0)
    CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            createUserIfMissing(userRepository, passwordEncoder, "admin1", "Admin One", "admin1@volunteerhub.com", "Admin@12345", "ADMIN");
            createUserIfMissing(userRepository, passwordEncoder, "admin2", "Admin Two", "admin2@volunteerhub.com", "Admin@12345", "ADMIN");
            createUserIfMissing(userRepository, passwordEncoder, "user1", "Volunteer One", "user1@volunteerhub.com", "Volunteer@123", "VOLUNTEER");
            createUserIfMissing(userRepository, passwordEncoder, "user2", "Volunteer Two", "user2@volunteerhub.com", "Volunteer@123", "VOLUNTEER");
            createUserIfMissing(userRepository, passwordEncoder, "user3", "Volunteer Three", "user3@volunteerhub.com", "Volunteer@123", "VOLUNTEER");
            createUserIfMissing(userRepository, passwordEncoder, "user4", "Volunteer Four", "user4@volunteerhub.com", "Volunteer@123", "VOLUNTEER");
            createUserIfMissing(userRepository, passwordEncoder, "user5", "Volunteer Five", "user5@volunteerhub.com", "Volunteer@123", "VOLUNTEER");
        };
    }

    private void createUserIfMissing(UserRepository userRepository, PasswordEncoder passwordEncoder,
                                      String id, String name, String email, String rawPassword, String role) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            log.info("Seed user already exists: {}", email);
            return;
        }

        User user = new User(name, email.toLowerCase(), passwordEncoder.encode(rawPassword), role, LocalDateTime.now());
        user.setId(id);

        userRepository.save(user);
        log.info("Seeded user id={} email={} role={}", user.getId(), user.getEmail(), user.getRole());
    }
}