package com.example.hospital.repository;

import java.util.List;
import java.util.Optional;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.hospital.model.DrugAuthorization;

@Repository
public interface DrugAuthorizationRepository extends JpaRepository<DrugAuthorization, Long> {

    Optional<DrugAuthorization> findFirstByCaseDataId(long caseDataId);

    List<DrugAuthorization> findByCaseDataIdIn(List<Long> caseDataIds);

    /**
     * Execute native SQL query to find PA expirations in 15 or 30 days for a specific case.
     */
    @Query(value = "SELECT Id, CasedataId as caseDataId, drugName, endDate, " +
            "DATEDIFF(day, DATEADD(day, -1, CAST(GETDATE() AS date)), TRY_CONVERT(date, endDate)) AS daysToExpire, " +
            "CASE WHEN DATEDIFF(day, DATEADD(day, -1, CAST(GETDATE() AS date)), TRY_CONVERT(date, endDate)) = 30 " +
            "  THEN 'EXPIRING_IN_30_DAYS' " +
            "  WHEN DATEDIFF(day, DATEADD(day, -1, CAST(GETDATE() AS date)), TRY_CONVERT(date, endDate)) = 15 " +
            "  THEN 'EXPIRING_IN_15_DAYS' END AS alertType " +
            "FROM DrugAuthorization " +
            "WHERE CasedataId = :caseDataId " +
            "AND TRY_CONVERT(date, endDate) IS NOT NULL " +
            "AND DATEDIFF(day, DATEADD(day, -1, CAST(GETDATE() AS date)), TRY_CONVERT(date, endDate)) IN (15, 30) " +
            "ORDER BY TRY_CONVERT(date, endDate), CasedataId", nativeQuery = true)
    List<Map<String, Object>> findPAExpirationAlerts(@Param("caseDataId") long caseDataId);

    /**
     * Execute native SQL query to find all PA expirations in 15 or 30 days (no case filter).
     */
    @Query(value = "SELECT Id, CasedataId as caseDataId, drugName, endDate, " +
            "DATEDIFF(day, DATEADD(day, -1, CAST(GETDATE() AS date)), TRY_CONVERT(date, endDate)) AS daysToExpire, " +
            "CASE WHEN DATEDIFF(day, DATEADD(day, -1, CAST(GETDATE() AS date)), TRY_CONVERT(date, endDate)) = 30 " +
            "  THEN 'EXPIRING_IN_30_DAYS' " +
            "  WHEN DATEDIFF(day, DATEADD(day, -1, CAST(GETDATE() AS date)), TRY_CONVERT(date, endDate)) = 15 " +
            "  THEN 'EXPIRING_IN_15_DAYS' END AS alertType " +
            "FROM DrugAuthorization " +
            "WHERE TRY_CONVERT(date, endDate) IS NOT NULL " +
            "AND DATEDIFF(day, DATEADD(day, -1, CAST(GETDATE() AS date)), TRY_CONVERT(date, endDate)) IN (15, 30) " +
            "ORDER BY TRY_CONVERT(date, endDate), CasedataId", nativeQuery = true)
    List<Map<String, Object>> findAllPAExpirationAlerts();

}
