package com.example.hospital.service;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.hospital.dto.PortalCaseDetailsDto;

@Service
public class PortalService {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public PortalService(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<PortalCaseDetailsDto> getCompleteCaseDetails(Long caseId) {
        String sql = "EXEC dbo.sp_GetCompleteCaseDetails @CaseId = :caseId";
        MapSqlParameterSource parameters = new MapSqlParameterSource("caseId", caseId);
        return jdbcTemplate.query(sql, parameters, portalRowMapper());
    }

    private RowMapper<PortalCaseDetailsDto> portalRowMapper() {
        return (rs, rowNum) -> {
            PortalCaseDetailsDto dto = new PortalCaseDetailsDto();
            dto.setCaseId(safeGetString(rs, "CaseId"));
            dto.setCaseType(safeGetString(rs, "CaseType"));
            dto.setPatientId(safeGetString(rs, "PatientId"));
            dto.setPatientName(safeGetString(rs, "PatientName"));
            dto.setPatientDOB(toIsoDate(rs, "dateOfBirth"));
            dto.setDrugName(firstNonBlank(safeGetString(rs, "SelectedDrugName"), safeGetString(rs, "DrugName")));
            dto.setDose(firstNonBlank(safeGetString(rs, "Dose"), safeGetString(rs, "Dosage")));
            dto.setInsuranceProvider(safeGetString(rs, "InsuranceProvider"));
            dto.setPrescriber(firstNonBlank(safeGetString(rs, "Prescriber"), safeGetString(rs, "PhysicianName")));
            return dto;
        };
    }

    private String toIsoDate(ResultSet rs, String columnName) throws SQLException {
        Date date = rs.getDate(columnName);
        return date != null ? date.toLocalDate().toString() : null;
    }

    private String safeGetString(ResultSet rs, String columnName) {
        try {
            return rs.getString(columnName);
        } catch (SQLException ex) {
            return null;
        }
    }

    private String firstNonBlank(String primary, String fallback) {
        if (primary != null && !primary.trim().isEmpty()) {
            return primary;
        }
        return fallback;
    }
}
