package com.example.hospital.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.hospital.model.Patient;
import com.example.hospital.repository.PatientRepository;

public class service {
	
	@Autowired
	private PatientRepository patientRepository;
	
	public Patient updatePatient(Patient patient) {
		Long id = patient.getId();
		Patient std = patientRepository.findById(id).get();
		std.setId(patient.getId());
		return patientRepository.save(std);
		
	}

}
