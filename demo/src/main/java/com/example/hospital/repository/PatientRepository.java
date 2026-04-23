package com.example.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hospital.model.Case;

@Repository
public interface PatientRepository extends JpaRepository<Case, Long> {
	
}


