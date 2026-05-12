package com.example.hospital.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hospital.model.CaseAlerts;
import com.example.hospital.repository.CaseAlertsRepository;

@Service
public class PaAlertsSyncService {

    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    @Autowired
    private AlertsConfigReaderService alertsConfigReaderService;

    @Autowired
    private CaseAlertsRepository caseAlertsRepository;

    /**
     * Reads the PA expiration query from alerts-config.json, executes it natively,
     * filters rows for the provided case id, and syncs CaseAlerts table.
     */
    @Transactional
    public List<CaseAlerts> syncAlertsForCase(long caseDataId) {
        String query = alertsConfigReaderService.getPaExpirationQuery();
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("caseDataId", caseDataId);
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(query, params);

        List<CaseAlerts> alerts = new ArrayList<>();
        for (Map<String, Object> row : rows) {
            String drugName = toStringValue(getValueIgnoreCase(row, "drugName", "DrugName"));
            String endDate = toStringValue(getValueIgnoreCase(row, "endDate", "EndDate"));
            String alertType = toStringValue(getValueIgnoreCase(row, "alertType", "AlertType"));
            Number daysToExpire = toNumber(getValueIgnoreCase(row, "daysToExpire", "DaysToExpire"));

            CaseAlerts alert = new CaseAlerts();
            alert.setCaseDataId(caseDataId);
            alert.setAlertType(alertType != null ? alertType : "PA_EXPIRATION_ALERT");
            alert.setAlertmessage(buildMessage(drugName, daysToExpire, endDate));
            alert.setIsActive(Boolean.TRUE);
            alerts.add(alert);
        }

        caseAlertsRepository.deleteByCaseDataId(caseDataId);
        if (!alerts.isEmpty()) {
            caseAlertsRepository.saveAll(alerts);
        }
        return alerts;
    }

    private String buildMessage(String drugName, Number daysToExpire, String endDate) {
        String drugLabel = (drugName == null || drugName.trim().isEmpty()) ? "This PA" : drugName.trim();
        String daysText = daysToExpire == null ? "soon" : (daysToExpire.intValue() == 1 ? "1 day" : daysToExpire.intValue() + " days");
        if (endDate == null || endDate.trim().isEmpty()) {
            return drugLabel + " prior authorization is expiring in " + daysText;
        }
        return drugLabel + " prior authorization is expiring in " + daysText + " (expires on " + endDate + ")";
    }

    private Object getValueIgnoreCase(Map<String, Object> row, String... keys) {
        if (row == null || keys == null) {
            return null;
        }
        for (String key : keys) {
            if (row.containsKey(key)) {
                return row.get(key);
            }
        }
        for (Map.Entry<String, Object> entry : row.entrySet()) {
            for (String key : keys) {
                if (entry.getKey() != null && entry.getKey().equalsIgnoreCase(key)) {
                    return entry.getValue();
                }
            }
        }
        return null;
    }

    private String toStringValue(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private Long toLong(Object value) {
        Number number = toNumber(value);
        return number == null ? null : number.longValue();
    }

    private Number toNumber(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return (Number) value;
        }
        try {
            return new BigDecimal(String.valueOf(value));
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
