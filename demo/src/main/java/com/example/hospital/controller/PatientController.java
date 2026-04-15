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
import com.example.hospital.model.Patient;
import com.example.hospital.repository.PatientRepository;

@RestController
@CrossOrigin(allowedHeaders = "*", origins = "*")
@RequestMapping("/api/v1/")
public class PatientController {

	@Autowired
	private PatientRepository patientRepository;

	@GetMapping("/patients")
	public List<Patient> getAllPatients() {
		return patientRepository.findAll();
	}

	@PostMapping("/patients")
	public Patient createPatient(@RequestBody Patient patient) {
		return patientRepository.save(patient);
	}

	@GetMapping("/patients/{id}")
	public ResponseEntity<Patient> getPatientById(@PathVariable Long id) throws AttributeNotFoundException {
		Patient patient = patientRepository.findById(id)
				.orElseThrow(() -> new AttributeNotFoundException("Patient not found: " + id));
		return ResponseEntity.ok(patient);
	}

	@PutMapping("/patients/{id}")
	public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails)
			throws AttributeNotFoundException {
		Patient patient = patientRepository.findById(id)
				.orElseThrow(() -> new AttributeNotFoundException("Patient not found: " + id));

		patient.setSelectedDrugId(patientDetails.getSelectedDrugId());
		patient.setCaseType(patientDetails.getCaseType());
		patient.setPatientInfo(patientDetails.getPatientInfo());
		patient.setMedicalHistory(patientDetails.getMedicalHistory());
		patient.setInsuranceDetails(patientDetails.getInsuranceDetails());
		patient.setPhysician(patientDetails.getPhysician());
		patient.setConsentForTreatment(patientDetails.getConsentForTreatment());

		Patient updatedPatient = patientRepository.save(patient);
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
