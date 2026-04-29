import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../../../shared/models/patient';
import { PatientService } from '../../../shared/services/patient.service';

@Component({
  selector: 'app-update-patient',
  templateUrl: './update-patient.component.html',
  styleUrls: ['./update-patient.component.css']
})
export class UpdatePatientComponent implements OnInit {

  id: number;
  patientForm!: FormGroup;
  submitted = false;

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      id: [''],
      selectedDrugId: [''],
      caseType: [''],

      patientInfo: this.fb.group({
        firstName:     ['', [Validators.required, Validators.pattern('^[A-Za-z ]{2,50}$')]],
        lastName:      ['', Validators.required],
        dateOfBirth:   [''],
        gender:        [''],
        contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        email:         ['', Validators.email],
        address: this.fb.group({
          street: [''],
          apt:     [''],
          city:    [''],
          county:  [''],
          state:   [''],
          zip:     ['']
        }),
        alternateContact: this.fb.group({
          name:          [''],
          relationship:  [''],
          contactNumber: [''],
          email:         ['', Validators.email]
        })
      }),

      medicalHistory: this.fb.group({
        allergies:          [''],
        currentMedications: [''],
        drugSpecificHistory: ['']
      }),

      insuranceDetails: this.fb.group({
        provider:        [''],
        policyNumber:    [''],
        coverageDetails: ['']
      }),

      physician: this.fb.group({
        name:          [''],
        contactNumber: [''],
        email:         ['', Validators.email]
      }),

      consents: this.fb.group({
        consentGiven:          [null],
        dateOfConsent:         [''],
        physicianConsentGiven: [null],
        physicianDateOfConsent: ['']
      })
      // Note: consents is an array in the backend.
      // patchValue maps from array; onSubmit rebuilds the array.
    });

    this.id = this.route.snapshot.params['id'];
    this.patientService.getPatientById(this.id).subscribe(
      data => {
        // Map consent array back to flat form fields
        const consents = (data as any).consents || [];
        const patientConsent = consents.find((c: any) => c.consentType === 1);
        const physicianConsent = consents.find((c: any) => c.consentType === 2);

        const patchData = { ...data, consents: {
          consentGiven: patientConsent?.consentGiven ?? null,
          dateOfConsent: patientConsent?.dateOfConsent ?? '',
          physicianConsentGiven: physicianConsent?.consentGiven ?? null,
          physicianDateOfConsent: physicianConsent?.dateOfConsent ?? ''
        }};
        this.patientForm.patchValue(patchData);
      },
      error => console.log(error)
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.patientForm.valid) {
      const raw = this.patientForm.value;
      const con = raw.consents;
      const patient: Patient = {
        ...raw,
        consents: [
          { consentType: 1, consentGiven: con.consentGiven, dateOfConsent: con.dateOfConsent },
          { consentType: 2, consentGiven: con.physicianConsentGiven, dateOfConsent: con.physicianDateOfConsent }
        ]
      };
      this.patientService.updatePatient(this.id, patient).subscribe(
        data => {
          this.goToPatientlist();
        },
        error => console.log(error)
      );
    }
  }

  goToPatientlist() {
    this.router.navigate(['/docdash']);
  }

}
