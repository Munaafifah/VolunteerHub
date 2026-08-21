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

                        activityRepository.save(new Activity(
                    "River Cleanup Initiative",
                    "Riverbank cleanup along Sungai Klang to clear litter and prevent water pollution.",
                    "Environment",
                    "Sungai Klang, Puchong",
                    LocalDate.of(2026, 10, 5),
                    "07:00",
                    LocalDate.of(2026, 9, 30),
                    40,
                    18,
                    "ACTIVE",
                    "admin1"
            ));

            activityRepository.save(new Activity(
                    "Tree Planting Day",
                    "Native tree planting session to help restore green cover around the wetland park.",
                    "Environment",
                    "Taman Wetland Putrajaya",
                    LocalDate.of(2026, 10, 12),
                    "08:30",
                    LocalDate.of(2026, 10, 8),
                    60,
                    60,
                    "ACTIVE",
                    "admin2"
            ));

            activityRepository.save(new Activity(
                    "Free Health Screening Camp",
                    "Basic health screening including blood pressure, glucose, and BMI checks for the public.",
                    "Health",
                    "Puchong Utama Community Center",
                    LocalDate.of(2026, 9, 28),
                    "09:00",
                    LocalDate.of(2026, 9, 25),
                    80,
                    45,
                    "ACTIVE",
                    "admin1"
            ));

            activityRepository.save(new Activity(
                    "COVID Booster Vaccination Drive",
                    "Community vaccination drive offering free COVID-19 booster shots.",
                    "Health",
                    "IOI Mall Puchong",
                    LocalDate.of(2026, 8, 15),
                    "09:00",
                    LocalDate.of(2026, 8, 10),
                    100,
                    72,
                    "ACTIVE",
                    "admin2"
            ));

            activityRepository.save(new Activity(
                    "Coding Bootcamp for Teens",
                    "Introductory coding workshop teaching basic programming concepts to teenagers.",
                    "Education",
                    "SMK Bandar Puteri",
                    LocalDate.of(2026, 10, 18),
                    "10:00",
                    LocalDate.of(2026, 10, 14),
                    25,
                    9,
                    "ACTIVE",
                    "admin1"
            ));

            activityRepository.save(new Activity(
                    "Library Reading Program for Kids",
                    "Weekly storytelling and reading session to encourage literacy among young children.",
                    "Education",
                    "Puchong Public Library",
                    LocalDate.of(2026, 9, 6),
                    "15:00",
                    LocalDate.of(2026, 9, 3),
                    20,
                    20,
                    "ACTIVE",
                    "admin2"
            ));

            activityRepository.save(new Activity(
                    "Pet Adoption Drive",
                    "Adoption event connecting rescued cats and dogs with loving new homes.",
                    "Animal Welfare",
                    "Taman Perindustrian Puchong",
                    LocalDate.of(2026, 10, 25),
                    "10:00",
                    LocalDate.of(2026, 10, 20),
                    35,
                    14,
                    "ACTIVE",
                    "admin1"
            ));

            activityRepository.save(new Activity(
                    "Animal Shelter Volunteer Day",
                    "Hands-on volunteering at the shelter including feeding, grooming, and enclosure cleaning.",
                    "Animal Welfare",
                    "SPCA Selangor",
                    LocalDate.of(2026, 11, 2),
                    "09:00",
                    LocalDate.of(2026, 10, 28),
                    20,
                    5,
                    "ACTIVE",
                    "admin2"
            ));

            activityRepository.save(new Activity(
                    "Neighbourhood Watch Meetup",
                    "Community meeting to organise a volunteer neighbourhood watch patrol schedule.",
                    "Community",
                    "Bandar Kinrara Community Hall",
                    LocalDate.of(2026, 9, 12),
                    "19:00",
                    LocalDate.of(2026, 9, 8),
                    50,
                    22,
                    "ACTIVE",
                    "admin1"
            ));

            activityRepository.save(new Activity(
                    "Orphanage Visit & Donation Drive",
                    "Visit to a local orphanage with a donation drive for daily necessities and school supplies.",
                    "Community",
                    "Rumah Anak Yatim Puchong",
                    LocalDate.of(2026, 11, 8),
                    "11:00",
                    LocalDate.of(2026, 11, 3),
                    30,
                    16,
                    "ACTIVE",
                    "admin2"
            ));

            activityRepository.save(new Activity(
                    "Charity Fun Run 5K",
                    "5km community fun run raising funds for underprivileged families.",
                    "Fundraising",
                    "Bandar Puteri Puchong",
                    LocalDate.of(2026, 11, 15),
                    "06:30",
                    LocalDate.of(2026, 11, 10),
                    150,
                    88,
                    "ACTIVE",
                    "admin1"
            ));

            activityRepository.save(new Activity(
                    "Flag Day Collection Drive",
                    "Street collection drive raising funds for a local children's welfare home.",
                    "Fundraising",
                    "Sunway Pyramid",
                    LocalDate.of(2026, 9, 19),
                    "08:00",
                    LocalDate.of(2026, 9, 16),
                    40,
                    40,
                    "ACTIVE",
                    "admin2"
            ));

            activityRepository.save(new Activity(
                    "Community Futsal Tournament",
                    "Friendly futsal tournament open to all skill levels, proceeds go to youth programs.",
                    "Sports",
                    "Puchong Sports Complex",
                    LocalDate.of(2026, 10, 3),
                    "14:00",
                    LocalDate.of(2026, 9, 29),
                    64,
                    32,
                    "ACTIVE",
                    "admin1"
            ));

            activityRepository.save(new Activity(
                    "Charity Badminton Championship",
                    "Doubles badminton championship with proceeds supporting local sports scholarships.",
                    "Sports",
                    "Dewan MPSJ Puchong",
                    LocalDate.of(2026, 11, 22),
                    "09:00",
                    LocalDate.of(2026, 11, 18),
                    48,
                    20,
                    "INACTIVE",
                    "admin2"
            ));

            activityRepository.save(new Activity(
                    "Mural Painting for Community Wall",
                    "Group mural painting session to beautify a public wall with community-designed artwork.",
                    "Arts & Culture",
                    "Taman Wawasan Puchong",
                    LocalDate.of(2026, 10, 30),
                    "08:00",
                    LocalDate.of(2026, 10, 25),
                    15,
                    15,
                    "ACTIVE",
                    "admin1"
            ));
        };
    }
}