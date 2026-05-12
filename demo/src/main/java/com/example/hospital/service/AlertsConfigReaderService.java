package com.example.hospital.service;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AlertsConfigReaderService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getPaExpirationQuery() {
        ClassPathResource resource = new ClassPathResource("config/alerts-config.json");
        try (InputStream inputStream = resource.getInputStream()) {
            JsonNode root = objectMapper.readTree(inputStream);
            JsonNode queryNode = root.path("paExpirationAlerts").path("query");
            if (queryNode.isMissingNode() || queryNode.asText().trim().isEmpty()) {
                throw new IllegalStateException("PA expiration query is missing in alerts-config.json");
            }
            return queryNode.asText();
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to read alerts-config.json", ex);
        }
    }
}
