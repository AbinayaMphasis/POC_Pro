package com.example.hospital.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "CaseData")
public class Case {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(name = "selected_drug_id")
	private String selectedDrugId;

	@Column(name = "case_type")
	private String caseType;

	// ── Patient Information ────────────────────────────────────
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "patient_info_id", referencedColumnName = "id")
	private Patient patientInfo;

	// ── Medical History ────────────────────────────────────────
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "medical_history_id", referencedColumnName = "id")
	private MedicalHistory medicalHistory;

	// ── Insurance Details ──────────────────────────────────────
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "insurance_details_id", referencedColumnName = "id")
	private InsuranceDetails insuranceDetails;

	// ── Physician ──────────────────────────────────────────────
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "physician_id", referencedColumnName = "id")
	private PhysicianInfo physician;

	// ── Prescriptions ─────────────────────────────────────────
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "case_id")
	private List<Prescription> prescriptions;

	// ── Consent for Treatment ──────────────────────────────────
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "patient_id")
	private List<Consents> consentForTreatment;
}
