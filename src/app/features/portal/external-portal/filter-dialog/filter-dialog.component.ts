import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface FilterDialogData {
  columns: string[];
  currentFilters: { [key: string]: string };
}

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html'
})
export class FilterDialogComponent implements OnInit {
  filterForm: FormGroup;
  columns: string[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogData
  ) {}

  ngOnInit(): void {
    this.columns = this.data.columns;
    const controls: { [key: string]: [string] } = {};
    this.columns.forEach(col => {
      controls[col] = [this.data.currentFilters[col] || ''];
    });
    this.filterForm = this.fb.group(controls);
  }

  getLabel(col: string): string {
    return col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }

  apply(): void {
    const values = this.filterForm.value;
    const result: { [key: string]: string } = {};
    Object.keys(values).forEach(k => {
      if (values[k] && values[k].trim() !== '') {
        result[k] = values[k].trim();
      }
    });
    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
