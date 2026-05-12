package com.example.hospital.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Collections;
import java.util.stream.Collectors;

import javax.management.AttributeNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.hospital.model.Case;
import com.example.hospital.model.CaseAlerts;
import com.example.hospital.model.DrugAuthorization;
import com.example.hospital.repository.CaseAlertsRepository;
import com.example.hospital.repository.DrugAuthorizationRepository;
import com.example.hospital.repository.PatientRepository;

@RestController
@CrossOrigin(allowedHeaders = "*", origins = "*")
@RequestMapping("/api/v1/")
public class PatientController {

	@Autowired
	private PatientRepository patientRepository;

	@Autowired
	private DrugAuthorizationRepository drugAuthorizationRepository;

	@Autowired
	private CaseAlertsRepository caseAlertsRepository;

	@GetMapping("/patients")
	public List<Case> getAllPatients() {
		List<Case> patients = patientRepository.findAll();
		enrichPatients(patients);
		return patients;
	}

	@PostMapping("/patients")
	public Case createPatient(@RequestBody Case patient) {
		Case savedPatient = patientRepository.save(patient);
		syncRelatedEntities(savedPatient.getId(), patient);
		enrichPatient(savedPatient);
		return savedPatient;
	}

	@GetMapping("/patients/{id}")
	public ResponseEntity<Case> getPatientById(@PathVariable Long id) throws AttributeNotFoundException {
		Case patient = patientRepository.findById(id)
				.orElseThrow(() -> new AttributeNotFoundException("Patient not found: " + id));
		enrichPatient(patient);
		return ResponseEntity.ok(patient);
	}

	@PutMapping("/patients/{id}")
	public ResponseEntity<Case> updatePatient(@PathVariable Long id, @RequestBody Case patientDetails)
			throws AttributeNotFoundException {
		Case patient = patientRepository.findById(id)
				.orElseThrow(() -> new AttributeNotFoundException("Patient not found: " + id));

		patient.setSelectedDrugId(patientDetails.getSelectedDrugId());
		patient.setCaseType(patientDetails.getCaseType());
		patient.setPatientInfo(patientDetails.getPatientInfo());
		patient.setMedicalHistory(patientDetails.getMedicalHistory());
		patient.setInsuranceDetails(patientDetails.getInsuranceDetails());
		patient.setPhysician(patientDetails.getPhysician());
		patient.setPrescriptions(patientDetails.getPrescriptions());
		patient.setConsents(patientDetails.getConsents());

		Case updatedPatient = patientRepository.save(patient);
		syncRelatedEntities(updatedPatient.getId(), patientDetails);
		enrichPatient(updatedPatient);
		return ResponseEntity.ok(updatedPatient);
	}

	@DeleteMapping("/patients/{id}")
	public ResponseEntity<Map<String, Boolean>> deletePatient(@PathVariable Long id)
			throws AttributeNotFoundException {
		patientRepository.findById(id)
				.orElseThrow(() -> new AttributeNotFoundException("Patient not found: " + id));
		patientRepository.deleteById(id);
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return ResponseEntity.ok(response);
	}

	private void enrichPatients(List<Case> patients) {
		if (patients == null || patients.isEmpty()) {
			return;
		}

		List<Long> caseIds = patients.stream().map(Case::getId).collect(Collectors.toList());

		Map<Long, DrugAuthorization> drugAuthByCaseId = drugAuthorizationRepository.findByCaseDataIdIn(caseIds)
				.stream()
				.collect(Collectors.toMap(DrugAuthorization::getCaseDataId, da -> da, (first, second) -> first));

		Map<Long, List<CaseAlerts>> alertsByCaseId = caseAlertsRepository.findByCaseDataIdIn(caseIds)
				.stream()
				.collect(Collectors.groupingBy(CaseAlerts::getCaseDataId));

		for (Case patient : patients) {
			patient.setDrugAuthorization(drugAuthByCaseId.get(patient.getId()));
			patient.setCaseAlerts(alertsByCaseId.getOrDefault(patient.getId(), Collections.emptyList()));
		}
	}

	private void enrichPatient(Case patient) {
		if (patient == null) {
			return;
		}

		patient.setDrugAuthorization(drugAuthorizationRepository.findFirstByCaseDataId(patient.getId()).orElse(null));
		patient.setCaseAlerts(caseAlertsRepository.findByCaseDataId(patient.getId()));
	}

	private void syncRelatedEntities(long caseId, Case patientDetails) {
		syncDrugAuthorization(caseId, patientDetails.getDrugAuthorization());
		syncCaseAlerts(caseId, patientDetails.getCaseAlerts());
	}

	private void syncDrugAuthorization(long caseId, DrugAuthorization inputDrugAuthorization) {
		if (inputDrugAuthorization == null) {
			return;
		}

		if (isDrugAuthorizationEmpty(inputDrugAuthorization)) {
			drugAuthorizationRepository.findFirstByCaseDataId(caseId)
					.ifPresent(existing -> drugAuthorizationRepository.deleteById(existing.getId()));
			return;
		}

		inputDrugAuthorization.setCaseDataId(caseId);
		drugAuthorizationRepository.findFirstByCaseDataId(caseId)
				.ifPresent(existing -> inputDrugAuthorization.setId(existing.getId()));

		drugAuthorizationRepository.save(inputDrugAuthorization);
	}

	private void syncCaseAlerts(long caseId, List<CaseAlerts> inputCaseAlerts) {
		if (inputCaseAlerts == null) {
			return;
		}

		caseAlertsRepository.deleteByCaseDataId(caseId);

		for (CaseAlerts alert : inputCaseAlerts) {
			if (alert == null) {
				continue;
			}
			alert.setId(null);
			alert.setCaseDataId(caseId);
			caseAlertsRepository.save(alert);
		}
	}

	private boolean isDrugAuthorizationEmpty(DrugAuthorization drugAuthorization) {
		boolean hasCaseDataId = drugAuthorization.getCaseDataId() > 0;
		boolean hasStartDate = drugAuthorization.getStartDate() != null && !drugAuthorization.getStartDate().trim().isEmpty();
		boolean hasEndDate = drugAuthorization.getEndDate() != null && !drugAuthorization.getEndDate().trim().isEmpty();
		boolean hasDrugName = drugAuthorization.getDrugName() != null && !drugAuthorization.getDrugName().trim().isEmpty();

		return !(hasCaseDataId || hasStartDate || hasEndDate || hasDrugName);
	}
}
