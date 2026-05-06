package com.example.hospital.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hospital.dto.PortalCaseDetailsDto;
import com.example.hospital.service.PortalService;

@RestController
@CrossOrigin(allowedHeaders = "*", origins = "*")
@RequestMapping("/api/v1/portal")
public class PortalController {

    private final PortalService portalService;

    public PortalController(PortalService portalService) {
        this.portalService = portalService;
    }

    @GetMapping("/cases")
    public List<PortalCaseDetailsDto> getCompleteCaseDetails(@RequestParam(required = false) Long caseId) {
        return portalService.getCompleteCaseDetails(caseId);
    }
}
