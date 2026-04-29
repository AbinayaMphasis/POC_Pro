export class Intake {
    patient?: {
        firstName?: string;
        lastName?: string;
        dateOfBirth?: string;
        gender?: string;
        contactNumber?: string;
        email?: string;
        address?: {
            street?: string;
            apt?: string;
            city?: string;
            county?: string;
            state?: string;
            zip?: string;
        };
        alternateContact?: {
            name?: string;
            relationship?: string;
            contactNumber?: string;
            email?: string;
        };
    };
    medicalHistory?: {
        allergies?: string[];
        currentMedications?: string[];
        drugSpecificHistory?: string[];
    };
    insuranceDetails?: {
        provider?: string;
        policyNumber?: string;
        coverageDetails?: string;
    };
    physician?: {
        name?: string;
        contactNumber?: string;
        email?: string;
    };
    prescription?: {
        medicationName?: string;
        dosage?: string;
        frequency?: string;
        duration?: string;
        prescriberSigned?: boolean;
        prescriberSignature?: string;
    };
    consents?: {
        consentGiven?: boolean;
        dateOfConsent?: string;
        physicianConsentGiven?: boolean;
        physicianDateOfConsent?: string;
    };
}