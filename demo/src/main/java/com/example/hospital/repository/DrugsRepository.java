package com.example.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hospital.model.Drugs;

@Repository
public interface DrugsRepository extends JpaRepository<Drugs, Long> {
}
