package com.example.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortalListDTO {

    private String caseId;
    private String caseType;
    private String patientId;
    private String patientName;
    private String patientDOB;
    private String drugName;
    private String dose;
    private String insuranceProvider;
    private String prescriber;
}
