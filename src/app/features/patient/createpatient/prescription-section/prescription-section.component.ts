import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomValidators } from '../../../../shared/validators/custom-validators.service';
import { DrugSelectionService } from '../drug-selection.service';
import { Drug } from '../drug.model';

@Component({
  selector: 'app-prescription-section',
  templateUrl: './prescription-section.component.html',
  styleUrls: ['./prescription-section.component.css']
})
export class PrescriptionSectionComponent implements OnInit, OnDestroy {
  @Input() patientForm!: FormGroup;

  selectedDrug: Drug | null = null;
  private drugSub!: Subscription;

  /** Index of the row currently being edited (-1 = adding new) */
  editingIndex = -1;

  /** Local entry form for add / edit */
  entryForm: FormGroup;

  readonly frequencies = [
    'Once daily', 'Twice daily', 'Three times daily',
    'Four times daily', 'As needed', 'Weekly'
  ];

  readonly frequencyOptions = this.frequencies.map(frequency => ({
    label: frequency,
    value: frequency
  }));
  readonly maxDate = new Date();

  constructor(private fb: FormBuilder, private drugSelectionService: DrugSelectionService) {
    this.entryForm = this.buildEntry();
  }

  ngOnInit(): void {
    this.drugSub = this.drugSelectionService.selectedDrug$.subscribe(
      drug => (this.selectedDrug = drug)
    );
  }

  ngOnDestroy(): void {
    this.drugSub?.unsubscribe();
  }

  get prescriptionsArray(): FormArray {
    return this.patientForm.get('prescriptions') as FormArray;
  }

  get rows(): FormGroup[] {
    return this.prescriptionsArray.controls as FormGroup[];
  }

  private buildEntry(value?: any): FormGroup {
    return this.fb.group({
      medicationName:   [value?.medicationName   ?? '', Validators.required],
      dosage:           [value?.dosage           ?? '', Validators.required],
      frequency:        [value?.frequency        ?? ''],
      duration:         [value?.duration         ?? ''],
      prescriberSigned: [value?.prescriberSigned ?? null],
      dateSigned:       [value?.dateSigned       ?? '', CustomValidators.noFutureDate]
    });
  }

  addOrUpdate(): void {
    if (this.entryForm.invalid) {
      this.entryForm.markAllAsTouched();
      return;
    }
    const value = this.entryForm.value;
    if (this.editingIndex >= 0) {
      this.prescriptionsArray.at(this.editingIndex).setValue(value);
      this.editingIndex = -1;
    } else {
      this.prescriptionsArray.push(this.buildEntry(value));
    }
    this.entryForm.reset({ prescriberSigned: null });
  }

  editRow(index: number): void {
    this.editingIndex = index;
    const val = this.prescriptionsArray.at(index).value;
    this.entryForm = this.buildEntry(val);
  }

  deleteRow(index: number): void {
    if (this.editingIndex === index) {
      this.cancelEdit();
    }
    this.prescriptionsArray.removeAt(index);
  }

  cancelEdit(): void {
    this.editingIndex = -1;
    this.entryForm.reset({ prescriberSigned: null });
  }

  isInvalid(name: string): boolean {
    const c = this.entryForm.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  hasError(name: string, error: string): boolean {
    const c = this.entryForm.get(name);
    return !!c && !!c.errors?.[error] && (c.dirty || c.touched);
  }
}

