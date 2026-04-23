package com.example.hospital.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(allowedHeaders = "*", origins = "*")
@RequestMapping("/api/v1")
public class IntakeConfigController {

	@GetMapping(value = "/intake-config", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> getIntakeConfig() throws IOException {
		ClassPathResource resource = new ClassPathResource("config/intake-config.json");
		try (InputStream is = resource.getInputStream()) {
			String json = new String(is.readAllBytes(), StandardCharsets.UTF_8);
			return ResponseEntity.ok(json);
		}
	}

}
