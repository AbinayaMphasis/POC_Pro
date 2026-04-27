import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../../../shared/models/patient';
import { PatientService } from '../../../shared/services/patient.service';
import { CustomValidators } from '../../../shared/validators/custom-validators.service';
import { Drug, DrugSelectionService } from './drug-selection.service';
import { LookupService } from '../../../shared/services/lookup.service';
import { IntakeConfigService } from '../../../shared/services/intake-config.service';
import { Subscription } from 'rxjs';
import { CaseTypeSelectionService } from './case-type-selection.service';

export type PageMode = 'create' | 'edit' | 'view';

@Component({
  selector: 'app-createpatient',
  templateUrl: './createpatient.component.html',
  styleUrls: ['./createpatient.component.css']
})
export class CreatepatientComponent implements OnInit, OnDestroy {

  patientForm!: FormGroup;
  submitted = false;
  mode: PageMode = 'create';
  patientId!: number;

  drugs: Drug[] = [];
  availableDrugs: Drug[] = [];
  selectedCaseType = '';
  selectedDrugId: string | null = null;
  private caseTypeSub?: Subscription;

  get isViewMode(): boolean { return this.mode === 'view'; }
  get isEditMode(): boolean { return this.mode === 'edit'; }
  get isCreateMode(): boolean { return this.mode === 'create'; }

  get pageTitle(): string {
    switch (this.mode) {
      case 'view': return 'View Patient Record';
      case 'edit': return 'Update Patient Record';
      default:     return 'New Patient Intake Form';
    }
  }

  get pageSubtitle(): string {
    switch (this.mode) {
      case 'view': return 'Viewing patient details (read-only).';
      case 'edit': return 'Edit the fields below and submit to update the patient record.';
      default:     return 'Fill all required sections to register a new patient case.';
    }
  }

  constructor(
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public drugSelectionService: DrugSelectionService,
    private caseTypeSelectionService: CaseTypeSelectionService,
    private lookupService: LookupService,
    private intakeConfigService: IntakeConfigService
  ) {}

  ngOnInit(): void {
    // Determine mode from route data
    this.mode = this.route.snapshot.data['mode'] || 'create';
    this.patientId = +this.route.snapshot.params['id'];

    this.buildForm();
    this.loadDrugs();

    if (this.isCreateMode) {
      this.caseTypeSub = this.caseTypeSelectionService.selectedCaseType$.subscribe(caseType => {
        this.selectedCaseType = caseType;
        this.filterDrugsByCaseType();
      });
    }

    if (this.isEditMode || this.isViewMode) {
      this.loadPatientData();
    }
  }

  ngOnDestroy(): void {
    this.caseTypeSub?.unsubscribe();
  }

  private buildForm(): void {
    this.patientForm = this.fb.group({

      // ── Patient Information ──────────────────────────────────────
      patient: this.fb.group({
        firstName:     ['', [Validators.required, Validators.pattern('^[A-Za-z ]{2,50}$')]],
        lastName:      ['', Validators.required],
        dateOfBirth:   ['', [Validators.required, CustomValidators.noFutureDate]],
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
      }, { validators: CustomValidators.patientNameLength() }),

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
        dateOfConsent: ['', [Validators.required, CustomValidators.noFutureDate]],
        physicianConsentGiven: [null, Validators.required],
        physicianDateOfConsent: ['', [Validators.required, CustomValidators.noFutureDate]]
      })

    });
  }

  private loadPatientData(): void {
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (patient) => {
        this.selectedCaseType = patient.caseType || '';
        this.selectedDrugId = patient.selectedDrugId || null;

        // Notify drug selection service
        if (this.selectedDrugId) {
          const drug = this.drugs.find(d => d.drugId === this.selectedDrugId);
          if (drug) {
            this.drugSelectionService.selectDrug(drug);
          }
        }

        // Map backend patient model to form structure
        const pi = patient.patientInfo;
        const addr = pi?.address;
        const alt = pi?.alternativeContact;

        this.patientForm.patchValue({
          patient: {
            firstName: pi?.firstName || '',
            lastName: pi?.lastName || '',
            dateOfBirth: pi?.dateOfBirth ? new Date(pi.dateOfBirth) : '',
            gender: pi?.gender || '',
            contactNumber: pi?.contactNumber || '',
            email: pi?.email || '',
            address: {
              street1: addr?.street1 || '',
              apt: addr?.apt || '',
              city: addr?.city || '',
              county: addr?.county || '',
              state: addr?.state || '',
              zip: addr?.zip || ''
            },
            alternativeContact: {
              name: alt?.altContactName || '',
              relationship: alt?.relationship || '',
              contactNumber: alt?.altContactNumber || '',
              email: alt?.altContactEmail || ''
            }
          },
          medicalHistory: {
            allergies: patient.medicalHistory?.allergies || '',
            currentMedications: patient.medicalHistory?.currentMedications || '',
            drugSpecificHistory: patient.medicalHistory?.drugSpecificHistory || ''
          },
          insuranceDetails: {
            provider: patient.insuranceDetails?.provider || '',
            policyNumber: patient.insuranceDetails?.policyNumber || '',
            coverageDetails: patient.insuranceDetails?.coverageDetails || ''
          },
          physician: {
            name: patient.physician?.name || '',
            contactNumber: patient.physician?.contactNumber || '',
            email: patient.physician?.email || ''
          },
          consentForTreatment: this.mapConsentsToForm(patient.consentForTreatment || [])
        });

        // Populate prescriptions FormArray
        const prescriptionsArray = this.patientForm.get('prescriptions') as FormArray;
        (patient.prescriptions || []).forEach(rx => {
          prescriptionsArray.push(this.fb.group({
            medicationName:   [rx.medicationName || ''],
            dosage:           [rx.dosage || ''],
            frequency:        [rx.frequency || ''],
            duration:         [rx.duration || ''],
            prescriberSigned: [rx.prescriberSigned ?? null],
            dateSigned:       [rx.dateSigned ? new Date(rx.dateSigned) : '']
          }));
        });

        // Disable entire form in view mode
        if (this.isViewMode) {
          this.patientForm.disable();
        }

        // Try to match drug for consent display after drugs are loaded
        this.tryMatchDrug();
      },
      error: (err) => {
        console.error('Failed to load patient', err);
        alert('Failed to load patient data.');
        this.goBackToDashboard();
      }
    });
  }

  private tryMatchDrug(): void {
    if (this.selectedDrugId) {
      const drug = this.drugs.find(d => d.drugId === this.selectedDrugId);
      if (drug) {
        this.drugSelectionService.selectDrug(drug);
      }
    }
  }

  private mapConsentsToForm(consents: any[]): any {
    const patientConsent = consents.find((c: any) => c.consentType === 1);
    const physicianConsent = consents.find((c: any) => c.consentType === 2);
    return {
      consentGiven: patientConsent?.consentGiven ?? null,
      dateOfConsent: patientConsent?.dateOfConsent ? new Date(patientConsent.dateOfConsent) : '',
      physicianConsentGiven: physicianConsent?.consentGiven ?? null,
      physicianDateOfConsent: physicianConsent?.dateOfConsent ? new Date(physicianConsent.dateOfConsent) : ''
    };
  }

  private loadDrugs(): void {
    this.lookupService.getLookupData(['Drugs']).subscribe({
      next: (data) => {
        const rawDrugs = data['Drugs'] || [];
        this.drugs = rawDrugs
          .filter((d: any) => d.isActive !== false)
          .map((d: any) => ({ drugId: String(d.drugPkId), name: d.name }));
        this.filterDrugsByCaseType();
      },
      error: (err) => {
        console.error('Failed to load drugs', err);
        this.drugs = [];
        this.availableDrugs = [];
      }
    });
  }

  private filterDrugsByCaseType(): void {
    if (!this.selectedCaseType) {
      this.availableDrugs = this.drugs;
      return;
    }

    const allowedDrugNames = new Set(
      this.intakeConfigService.getDrugNamesByCaseType(this.selectedCaseType)
    );
    this.availableDrugs = this.drugs.filter(drug => allowedDrugNames.has(drug.name));

    // Clear selection if the currently selected drug is no longer available
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
      prescriptions: (raw.prescriptions || []).map((rx: any) => ({
        medicationName: rx.medicationName,
        dosage: rx.dosage,
        frequency: rx.frequency,
        duration: rx.duration,
        prescriberSigned: rx.prescriberSigned,
        dateSigned: rx.dateSigned ? new Date(rx.dateSigned).toISOString().split('T')[0] : undefined
      })),
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

    if (this.isEditMode) {
      this.patientService.updatePatient(this.patientId, patient).subscribe({
        next: () => {
          console.log('Patient updated successfully');
          this.goBackToDashboard();
        },
        error: (error) => {
          console.error('Error updating patient', error);
          alert('Failed to update patient. Please check the form and try again.');
        }
      });
    } else {
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

  getSelectedDrugName(): string {
    if (!this.selectedDrugId) { return '-'; }
    const drug = this.drugs.find(d => d.drugId === this.selectedDrugId);
    return drug ? drug.name : this.selectedDrugId;
  }

  goBackToDashboard(): void {
    const isDoctorLoggedIn = !!sessionStorage.getItem('username');
    const isAdminLoggedIn  = !!sessionStorage.getItem('username2');
    if (isDoctorLoggedIn) { this.router.navigate(['/docdash']); return; }
    if (isAdminLoggedIn)  { this.router.navigate(['/admindash']); return; }
    this.router.navigate(['/home']);
  }
}

