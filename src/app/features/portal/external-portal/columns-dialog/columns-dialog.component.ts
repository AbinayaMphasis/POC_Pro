import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ColumnsDialogData {
  allColumns: string[];
  activeColumns: string[];
}

@Component({
  selector: 'app-columns-dialog',
  templateUrl: './columns-dialog.component.html'
})
export class ColumnsDialogComponent implements OnInit {
  columnsForm: FormGroup;
  allColumns: string[] = [];
  selectAll = false;
  isIndeterminate = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ColumnsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ColumnsDialogData
  ) {}

  ngOnInit(): void {
    this.allColumns = this.data.allColumns;
    const controls: { [key: string]: [boolean] } = {};
    this.allColumns.forEach(col => {
      controls[col] = [this.data.activeColumns.includes(col)];
    });
    this.columnsForm = this.fb.group(controls);
    this.updateSelectAllState();

    this.columnsForm.valueChanges.subscribe(() => this.updateSelectAllState());
  }

  private updateSelectAllState(): void {
    const values: boolean[] = Object.values(this.columnsForm.value);
    const checkedCount = values.filter(v => v).length;
    this.selectAll = checkedCount === this.allColumns.length;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.allColumns.length;
  }

  onSelectAllChange(checked: boolean): void {
    const patch: { [key: string]: boolean } = {};
    this.allColumns.forEach(col => (patch[col] = checked));
    this.columnsForm.patchValue(patch);
  }

  getLabel(col: string): string {
    return col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }

  apply(): void {
    const values = this.columnsForm.value;
    const selected = Object.keys(values).filter(k => values[k]);
    this.dialogRef.close(selected.length > 0 ? selected : this.allColumns);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
