package com.example.hospital.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hospital.service.DrugAuthorizationService;

@RestController
@CrossOrigin(allowedHeaders = "*", origins = "*")
@RequestMapping("/api/v1")
public class AlertsConfigController {

	@Autowired
	private DrugAuthorizationService drugAuthorizationService;

	@GetMapping(value = "/alerts-config", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> getAlertsConfig() throws IOException {
		ClassPathResource resource = new ClassPathResource("config/alerts-config.json");
		try (InputStream is = resource.getInputStream()) {
			String json = new String(is.readAllBytes(), StandardCharsets.UTF_8);
			return ResponseEntity.ok(json);
		}
	}

	/**
	 * Get PA expiration alerts for a specific case (patient).
	 * Returns prior authorizations expiring in 15 or 30 days.
	 */
	@GetMapping(value = "/patients/{caseDataId}/pa-alerts", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Map<String, Object>>> getPAExpirationAlerts(@PathVariable long caseDataId) {
		List<Map<String, Object>> alerts = drugAuthorizationService.getPAExpirationAlerts(caseDataId);
		return ResponseEntity.ok(alerts);
	}

	/**
	 * Get all PA expiration alerts across all cases.
	 */
	@GetMapping(value = "/pa-alerts", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Map<String, Object>>> getAllPAExpirationAlerts() {
		List<Map<String, Object>> alerts = drugAuthorizationService.getAllPAExpirationAlerts();
		return ResponseEntity.ok(alerts);
	}
}

