package com.example.hospital.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.hospital.dto.PortalListDTO;
import com.example.hospital.model.Case;
import com.example.hospital.model.Drugs;
import com.example.hospital.model.Prescription;
import com.example.hospital.repository.DrugsRepository;
import com.example.hospital.repository.PatientRepository;

@Service
public class PortalService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DrugsRepository drugsRepository;

    public List<PortalListDTO> getAllCases() {
        List<Case> cases = patientRepository.findAll();
        return cases.stream().map(this::toPortalListDTO).collect(Collectors.toList());
    }

    private PortalListDTO toPortalListDTO(Case c) {
        String caseId = String.valueOf(c.getId());

        String caseType = c.getCaseType() != null ? c.getCaseType() : "";

        String patientId = "";
        String patientName = "";
        String patientDOB = "";
        if (c.getPatientInfo() != null) {
            patientId = String.valueOf(c.getPatientInfo().getId());
            String first = c.getPatientInfo().getFirstName() != null ? c.getPatientInfo().getFirstName() : "";
            String last  = c.getPatientInfo().getLastName()  != null ? c.getPatientInfo().getLastName()  : "";
            patientName = (first + " " + last).trim();
            patientDOB  = c.getPatientInfo().getDateOfBirth() != null ? c.getPatientInfo().getDateOfBirth() : "";
        }

        // Drug name – look up from Drugs table via selectedDrugId
        String drugName = "";
        if (c.getSelectedDrugId() != null && !c.getSelectedDrugId().isEmpty()) {
            try {
                Long drugKey = Long.parseLong(c.getSelectedDrugId());
                drugName = drugsRepository.findById(drugKey)
                        .map(Drugs::getName)
                        .orElse(c.getSelectedDrugId());
            } catch (NumberFormatException e) {
                drugName = c.getSelectedDrugId();
            }
        }

        // Dose – from first prescription
        String dose = "";
        if (c.getPrescriptions() != null && !c.getPrescriptions().isEmpty()) {
            Prescription rx = c.getPrescriptions().get(0);
            dose = rx.getDosage() != null ? rx.getDosage() : "";
            // Fall back to drug name from prescription if not resolved above
            if (drugName.isEmpty() && rx.getMedicationName() != null) {
                drugName = rx.getMedicationName();
            }
        }

        String insuranceProvider = "";
        if (c.getInsuranceDetails() != null && c.getInsuranceDetails().getProvider() != null) {
            insuranceProvider = c.getInsuranceDetails().getProvider();
        }

        String prescriber = "";
        if (c.getPhysician() != null && c.getPhysician().getName() != null) {
            prescriber = c.getPhysician().getName();
        }

        return new PortalListDTO(caseId, caseType, patientId, patientName,
                patientDOB, drugName, dose, insuranceProvider, prescriber);
    }
}
