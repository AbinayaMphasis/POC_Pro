import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient, Source } from '../../../shared/models/patient';
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
  sources: Source[] = [];
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
    this.loadSources();
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
        sourceId:      [null],
        email:         ['', Validators.email],
        address: this.fb.group({
          street: [''],
          apt:     [''],
          city:    [''],
          county:  [''],
          state:   [''],
          zip:     ['', Validators.pattern('^[0-9]{5}(-[0-9]{4})?$')]
        }),
        alternateContact: this.fb.group({
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
      consents: this.fb.group({
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
        const pi = patient.patientInfo as any;
        const addr = pi?.address;
        const alt = pi?.alternateContact;
        const consentList = (patient as any)?.consents || [];

        this.patientForm.patchValue({
          patient: {
            firstName: pi?.firstName || '',
            lastName: pi?.lastName || '',
            dateOfBirth: pi?.dateOfBirth ? new Date(pi.dateOfBirth) : '',
            gender: pi?.gender || '',
            contactNumber: pi?.contactNumber || '',
            email: pi?.email || '',
            sourceId: pi?.sourceId || null
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
          consents: this.mapConsentsToForm(consentList)
        });

        // Patch address nested form group separately
        const patientGroup = this.patientForm.get('patient') as FormGroup;
        if (patientGroup) {
          patientGroup.patchValue({
            address: {
              street: addr?.street || '',
              apt: addr?.apt || '',
              city: addr?.city || '',
              county: addr?.county || '',
              state: addr?.state || '',
              zip: addr?.zip || ''
            },
            alternateContact: {
              name: alt?.name || alt?.name || '',
              relationship: alt?.relationship || '',
              contactNumber: alt?.contactNumber || alt?.contactNumber || '',
              email: alt?.email || alt?.email || ''
            }
          });
        }

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
    const patientConsent = consents.find((c: any) => Number(c.consentType) === 1);
    const physicianConsent = consents.find((c: any) => Number(c.consentType) === 2);
    return {
      consentGiven: this.toBooleanOrNull(patientConsent?.consentGiven),
      dateOfConsent: patientConsent?.dateOfConsent ? new Date(patientConsent.dateOfConsent) : '',
      physicianConsentGiven: this.toBooleanOrNull(physicianConsent?.consentGiven),
      physicianDateOfConsent: physicianConsent?.dateOfConsent ? new Date(physicianConsent.dateOfConsent) : ''
    };
  }

  private toBooleanOrNull(value: unknown): boolean | null {
    if (value === true || value === false) {
      return value;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') { return true; }
      if (normalized === 'false') { return false; }
    }
    return null;
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

  private loadSources(): void {
    this.lookupService.getLookupData(['Source']).subscribe({
      next: (data) => {
        const rawSources = data['Source'] || [];
        this.sources = rawSources.filter((s: any) => s.isActive !== false);
      },
      error: (err) => {
        console.error('Failed to load sources', err);
        this.sources = [];
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
    const alt  = p.alternateContact;
    const mh   = raw.medicalHistory;
    const ins  = raw.insuranceDetails;
    const ph   = raw.physician;
    const con  = raw.consents;

    return {
      selectedDrugId: this.selectedDrugId ?? undefined,
      caseType: this.selectedCaseType || undefined,
      patientInfo: {
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : undefined,
        gender: p.gender,
        contactNumber: p.contactNumber,
        sourceId: p.sourceId || null,
        email: p.email,
        address: {
          street: addr?.street,
          apt: addr?.apt,
          city: addr?.city,
          county: addr?.county,
          state: addr?.state,
          zip: addr?.zip
        },
        alternateContact: {
          name: alt?.name,
          relationship: alt?.relationship,
          contactNumber: alt?.contactNumber,
          email: alt?.email
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
      consents: [
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

