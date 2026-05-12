package com.example.hospital.filter;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.hospital.service.PaAlertsSyncService;

@Component
public class PatientAlertsSyncFilter extends OncePerRequestFilter {

    private static final Pattern PATIENT_DETAILS_PATTERN = Pattern.compile("^/api/v1/patients/(\\d+)$");

    @Autowired
    private PaAlertsSyncService paAlertsSyncService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            String requestUri = request.getRequestURI();
            Matcher matcher = PATIENT_DETAILS_PATTERN.matcher(requestUri);
            if (matcher.matches()) {
                try {
                    long caseDataId = Long.parseLong(matcher.group(1));
                    paAlertsSyncService.syncAlertsForCase(caseDataId);
                } catch (Exception ex) {
                    // Keep patient details response flowing even if alert sync fails
                    logger.error("Failed to sync PA alerts for patient details: " + requestUri, ex);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
