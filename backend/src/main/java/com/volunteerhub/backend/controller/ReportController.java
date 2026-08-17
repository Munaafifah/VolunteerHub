package com.volunteerhub.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.volunteerhub.backend.dto.PopularActivityResponse;
import com.volunteerhub.backend.service.RegistrationReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final RegistrationReportService registrationReportService;

    public ReportController(RegistrationReportService registrationReportService) {
        this.registrationReportService = registrationReportService;
    }

    @GetMapping("/popular-activities")
    public List<PopularActivityResponse> getPopularActivities(
            @RequestParam(defaultValue = "5") int limit) {
        return registrationReportService.getMostPopularActivities(limit);
    }
}