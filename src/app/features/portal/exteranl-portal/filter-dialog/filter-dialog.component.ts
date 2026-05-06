import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface PortalFilterFormValue {
  caseId?: string;
  caseType?: string;
  patientId?: string;
  patientName?: string;
  patientDOB?: string;
  drugName?: string;
  dose?: string;
  insuranceProvider?: string;
  prescriber?: string;
}

interface FilterDialogData {
  labels: Record<string, string>;
  values: PortalFilterFormValue;
}

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent {
  readonly form: FormGroup = this.fb.group({
    caseId: [this.data.values.caseId || ''],
    caseType: [this.data.values.caseType || ''],
    patientId: [this.data.values.patientId || ''],
    patientName: [this.data.values.patientName || ''],
    patientDOB: [this.data.values.patientDOB || ''],
    drugName: [this.data.values.drugName || ''],
    dose: [this.data.values.dose || ''],
    insuranceProvider: [this.data.values.insuranceProvider || ''],
    prescriber: [this.data.values.prescriber || '']
  });

  readonly filterKeys = Object.keys(this.data.labels);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogData
  ) {}

  submit(): void {
    this.dialogRef.close(this.form.getRawValue() as PortalFilterFormValue);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
