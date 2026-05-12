package com.example.hospital.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.hospital.repository.DrugAuthorizationRepository;

@Service
public class DrugAuthorizationService {

	@Autowired
	private DrugAuthorizationRepository drugAuthorizationRepository;

	/**
	 * Execute the PA expiration alerts query using native SQL.
	 * Finds Drug Authorizations expiring in exactly 15 or 30 days from today.
	 */
	public List<Map<String, Object>> getPAExpirationAlerts(long caseDataId) {
		return drugAuthorizationRepository.findPAExpirationAlerts(caseDataId);
	}

	/**
	 * Get all PA expiration alerts (no case filter).
	 */
	public List<Map<String, Object>> getAllPAExpirationAlerts() {
		return drugAuthorizationRepository.findAllPAExpirationAlerts();
	}
}
