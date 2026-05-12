package com.example.hospital.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hospital.model.CaseAlerts;

@Repository
public interface CaseAlertsRepository extends JpaRepository<CaseAlerts, Long> {

    List<CaseAlerts> findByCaseDataId(long caseDataId);

    List<CaseAlerts> findByCaseDataIdIn(List<Long> caseDataIds);

    void deleteByCaseDataId(long caseDataId);
}
