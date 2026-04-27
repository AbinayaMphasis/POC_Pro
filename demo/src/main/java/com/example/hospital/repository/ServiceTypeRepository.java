package com.example.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hospital.model.ServiceType;

@Repository
public interface ServiceTypeRepository extends JpaRepository<ServiceType, Long> {
}
