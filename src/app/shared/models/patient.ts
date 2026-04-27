export interface Address {
    street1?: string;
    apt?: string;
    city?: string;
    county?: string;
    state?: string;
    zip?: string;
}

export interface AlternativeContact {
    altContactName?: string;
    relationship?: string;
    altContactNumber?: string;
    altContactEmail?: string;
}

export interface PatientInfo {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    contactNumber?: string;
    email?: string;
    address?: Address;
    alternativeContact?: AlternativeContact;
}

export interface MedicalHistory {
    allergies?: string;
    currentMedications?: string;
    drugSpecificHistory?: string;
}

export interface InsuranceDetails {
    provider?: string;
    policyNumber?: string;
    coverageDetails?: string;
}

export interface PhysicianInfo {
    name?: string;
    contactNumber?: string;
    email?: string;
}

export interface Prescription {
    medicationName?: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    prescriberSigned?: boolean;
    dateSigned?: string;
}

export interface ConsentForTreatment {
    id?: number;
    consentType?: number;  // 1 = Patient Consent, 2 = Physician Consent
    consentGiven?: boolean;
    dateOfConsent?: string;
}

export class Patient {
    id?: number;
    selectedDrugId?: string;
    caseType?: string;
    patientInfo?: PatientInfo;
    medicalHistory?: MedicalHistory;
    insuranceDetails?: InsuranceDetails;
    physician?: PhysicianInfo;
    prescriptions?: Prescription[];
    consentForTreatment?: ConsentForTreatment[];
}
