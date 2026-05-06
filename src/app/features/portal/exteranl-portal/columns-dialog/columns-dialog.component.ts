import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ColumnOption {
  key: string;
  label: string;
  selected: boolean;
}

interface ColumnsDialogData {
  columns: ColumnOption[];
}

@Component({
  selector: 'app-columns-dialog',
  templateUrl: './columns-dialog.component.html',
  styleUrls: ['./columns-dialog.component.css']
})
export class ColumnsDialogComponent {
  readonly columns: ColumnOption[];

  constructor(
    private dialogRef: MatDialogRef<ColumnsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: ColumnsDialogData
  ) {
    this.columns = data.columns.map(column => ({ ...column }));
  }

  get allSelected(): boolean {
    return this.columns.every(column => column.selected);
  }

  toggleSelectAll(checked: boolean): void {
    this.columns.forEach(column => {
      column.selected = checked;
    });
  }

  submit(): void {
    if (!this.columns.some(column => column.selected)) {
      return;
    }
    this.dialogRef.close(this.columns);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
