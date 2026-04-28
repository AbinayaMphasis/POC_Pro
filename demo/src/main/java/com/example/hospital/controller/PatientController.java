package com.example.hospital.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.example.hospital.repository.PatientRepository;

@RestController
@CrossOrigin(allowedHeaders = "*", origins = "*")
@RequestMapping("/api/v1/")
public class PatientController {

	@Autowired
	private PatientRepository patientRepository;

	@GetMapping("/patients")
	public List<Case> getAllPatients() {
		return patientRepository.findAll();
	}

	@PostMapping("/patients")
	public Case createPatient(@RequestBody Case patient) {
		return patientRepository.save(patient);
	}

	@GetMapping("/patients/{id}")
	public ResponseEntity<Case> getPatientById(@PathVariable Long id) throws AttributeNotFoundException {
		Case patient = patientRepository.findById(id)
				.orElseThrow(() -> new AttributeNotFoundException("Patient not found: " + id));
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
}
