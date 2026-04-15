import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from '../patient';
import { PatientService } from '../patient.service';
import { catchError, throwError } from 'rxjs';
import { noFutureDate } from './date-validators';
import { DrugSelectionService } from './drug-selection.service';
import { Drug, DRUGS } from './drug.model';
import { getDrugNamesByCaseType } from '../constants/intake-config';
import { Subscription } from 'rxjs';
import { CaseTypeSelectionService } from './case-type-selection.service';

@Component({
  selector: 'app-createpatient',
  templateUrl: './createpatient.component.html',
  styleUrls: ['./createpatient.component.css']
})
export class CreatepatientComponent implements OnInit {

  patientForm!: FormGroup;
  submitted = false;

  readonly drugs: Drug[] = DRUGS;
  availableDrugs: Drug[] = DRUGS;
  selectedCaseType = '';
  selectedDrugId: string | null = null;
  private caseTypeSub?: Subscription;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private fb: FormBuilder,
    public drugSelectionService: DrugSelectionService,
    private caseTypeSelectionService: CaseTypeSelectionService
  ) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({

      // ── Patient Information ──────────────────────────────────────
      patient: this.fb.group({
        firstName:     ['', [Validators.required, Validators.pattern('^[A-Za-z ]{2,50}$')]],
        lastName:      ['', Validators.required],
        dateOfBirth:   ['', [Validators.required, noFutureDate]],
        gender:        ['', Validators.required],
        contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        email:         ['', Validators.email],
        address: this.fb.group({
          street1: [''],
          apt:     [''],
          city:    [''],
          county:  [''],
          state:   [''],
          zip:     ['', Validators.pattern('^[0-9]{5}(-[0-9]{4})?$')]
        }),
        alternativeContact: this.fb.group({
          name:          [''],
          relationship:  [''],
          contactNumber: [''],
          email:         ['', Validators.email]
        })
      }),

      // ── Medical History ─────────────────────────────────────────
      medicalHistory: this.fb.group({
        allergies:          [''],
        currentMedications: [''],
        drugSpecificHistory: ['']
      }),

      // ── Insurance Details ────────────────────────────────────────
      insuranceDetails: this.fb.group({
        provider:        [''],
        policyNumber:    [''],
        coverageDetails: ['']
      }),

      // ── Physician ────────────────────────────────────────────────
      physician: this.fb.group({
        name:          [''],
        contactNumber: [''],
        email:         ['', Validators.email]
      }),

      // ── Prescriptions (array) ──────────────────────────────────────
      prescriptions: this.fb.array([]),

      // ── Consent for Treatment ────────────────────────────────────
      consentForTreatment: this.fb.group({
        consentGiven:  [null, Validators.required],
        dateOfConsent: ['', [Validators.required, noFutureDate]],
        physicianConsentGiven: [null, Validators.required],
        physicianDateOfConsent: ['', [Validators.required, noFutureDate]]
      })

    });
    this.caseTypeSub = this.caseTypeSelectionService.selectedCaseType$.subscribe(caseType => {
      this.applyCaseTypeFilter(caseType);
    });
  }

  ngOnDestroy(): void {
    this.caseTypeSub?.unsubscribe();
  }

  private applyCaseTypeFilter(caseType: string): void {
    this.selectedCaseType = caseType;

    if (!caseType) {
      this.availableDrugs = this.drugs;
      return;
    }

    const allowedDrugNames = new Set(getDrugNamesByCaseType(caseType));
    this.availableDrugs = this.drugs.filter(drug => allowedDrugNames.has(drug.name));

    if (!this.availableDrugs.some(drug => drug.drugId === this.selectedDrugId)) {
      this.selectedDrugId = null;
      this.drugSelectionService.clearDrug();
    }
  }

  /** Map nested intake form to Patient model matching the backend structure */
  private buildPatientPayload(): Patient {
    const raw = this.patientForm.value;
    const p   = raw.patient;
    const addr = p.address;
    const alt  = p.alternativeContact;
    const mh   = raw.medicalHistory;
    const ins  = raw.insuranceDetails;
    const ph   = raw.physician;
    const con  = raw.consentForTreatment;

    return {
      selectedDrugId: this.selectedDrugId ?? undefined,
      caseType: this.selectedCaseType || undefined,
      patientInfo: {
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : undefined,
        gender: p.gender,
        contactNumber: p.contactNumber,
        email: p.email,
        address: {
          street1: addr?.street1,
          apt: addr?.apt,
          city: addr?.city,
          county: addr?.county,
          state: addr?.state,
          zip: addr?.zip
        },
        alternativeContact: {
          altContactName: alt?.name,
          relationship: alt?.relationship,
          altContactNumber: alt?.contactNumber,
          altContactEmail: alt?.email
        }
      },
      medicalHistory: {
        allergies: mh?.allergies,
        currentMedications: mh?.currentMedications,
        drugSpecificHistory: mh?.drugSpecificHistory
      },
      insuranceDetails: {
        provider: ins?.provider,
        policyNumber: ins?.policyNumber,
        coverageDetails: ins?.coverageDetails
      },
      physician: {
        name: ph?.name,
        contactNumber: ph?.contactNumber,
        email: ph?.email
      },
      consentForTreatment: [
        {
          consentType: 1,
          consentGiven: con?.consentGiven,
          dateOfConsent: con?.dateOfConsent ? new Date(con.dateOfConsent).toISOString().split('T')[0] : undefined
        },
        {
          consentType: 2,
          consentGiven: con?.physicianConsentGiven,
          dateOfConsent: con?.physicianDateOfConsent ? new Date(con.physicianDateOfConsent).toISOString().split('T')[0] : undefined
        }
      ]
    };
  }

  savePatient(): void {
    if (this.patientForm.invalid) { return; }
    const patient: Patient = this.buildPatientPayload();
    this.patientService.createPatient(patient).subscribe({
      next: (data) => {
        console.log('Patient saved successfully', data);
        this.goBackToDashboard();
      },
      error: (error) => {
        console.error('Error saving patient', error);
        alert('Failed to save patient. Please check the form and try again.');
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.patientForm.valid) {
      this.savePatient();
    }
  }

  onDrugChange(drugId: string): void {
    const drug = this.availableDrugs.find(d => d.drugId === drugId) ?? null;
    if (drug) {
      this.drugSelectionService.selectDrug(drug);
    } else {
      this.drugSelectionService.clearDrug();
    }
  }

  goBackToDashboard(): void {
    const isDoctorLoggedIn = !!sessionStorage.getItem('username');
    const isAdminLoggedIn  = !!sessionStorage.getItem('username2');
    if (isDoctorLoggedIn) { this.router.navigate(['/docdash']); return; }
    if (isAdminLoggedIn)  { this.router.navigate(['/admindash']); return; }
    this.router.navigate(['/home']);
  }
}

