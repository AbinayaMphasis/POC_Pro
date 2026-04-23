package com.example.hospital.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.hospital.model.Case;
import com.example.hospital.repository.PatientRepository;

public class service {
	
	@Autowired
	private PatientRepository patientRepository;
	
	public Case updatePatient(Case patient) {
		Long id = patient.getId();
		Case std = patientRepository.findById(id).get();
		std.setId(patient.getId());
		return patientRepository.save(std);
		
	}

}
