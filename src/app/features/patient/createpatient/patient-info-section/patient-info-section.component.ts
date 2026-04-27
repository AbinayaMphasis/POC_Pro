import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DrugSelectionService } from '../drug-selection.service';
import { Drug } from '../drug-selection.service';

@Component({
  selector: 'app-patient-info-section',
  templateUrl: './patient-info-section.component.html',
  styleUrls: ['./patient-info-section.component.css']
})
export class PatientInfoSectionComponent implements OnInit, OnDestroy {
  @Input() patientForm!: FormGroup;

  readonly maxDate = new Date();
  readonly stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID',
    'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
    'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
    'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
    'WI', 'WY'
  ].map(state => ({ label: state, value: state }));
  selectedDrug: Drug | null = null;
  private drugSub!: Subscription;

  constructor(private drugSelectionService: DrugSelectionService) {}

  ngOnInit(): void {
    this.drugSub = this.drugSelectionService.selectedDrug$.subscribe(
      drug => (this.selectedDrug = drug)
    );
  }

  ngOnDestroy(): void {
    this.drugSub?.unsubscribe();
  }

  get patientGroup(): FormGroup {
    return this.patientForm.get('patient') as FormGroup;
  }

  get altContactGroup(): FormGroup {
    return this.patientGroup?.get('alternativeContact') as FormGroup;
  }

  get patientNameLengthInvalid(): boolean | undefined {
    const firstTouched = this.patientGroup.get('firstName')?.dirty || this.patientGroup.get('firstName')?.touched;
    const lastTouched = this.patientGroup.get('lastName')?.dirty || this.patientGroup.get('lastName')?.touched;
    return !!this.patientGroup.errors?.['patientNameLength'] && (firstTouched || lastTouched);
  }
}
