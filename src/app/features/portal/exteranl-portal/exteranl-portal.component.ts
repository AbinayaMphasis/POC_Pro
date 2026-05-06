import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PortalCase } from '../../../shared/models/portal-case';
import { PortalService } from '../../../shared/services/portal.service';
import { ColumnsDialogComponent, ColumnOption } from './columns-dialog/columns-dialog.component';
import { FilterDialogComponent, PortalFilterFormValue } from './filter-dialog/filter-dialog.component';

interface ActiveFilter {
  key: keyof PortalCase;
  label: string;
  value: string;
}

@Component({
  selector: 'app-exteranl-portal',
  templateUrl: './exteranl-portal.component.html',
  styleUrls: ['./exteranl-portal.component.css']
})
export class ExteranlPortalComponent implements OnInit, AfterViewInit {
  readonly columnOptions: ColumnOption[] = [
    { key: 'caseId', label: 'Case ID', selected: true },
    { key: 'caseType', label: 'Case Type', selected: true },
    { key: 'patientId', label: 'Patient ID', selected: true },
    { key: 'patientName', label: 'Patient Name', selected: true },
    { key: 'patientDOB', label: 'Patient DOB', selected: true },
    { key: 'drugName', label: 'Drug Name', selected: true },
    { key: 'dose', label: 'Dose', selected: true },
    { key: 'insuranceProvider', label: 'Insurance Provider', selected: true },
    { key: 'prescriber', label: 'Prescriber', selected: true }
  ];

  displayedColumns = this.columnOptions.filter(column => column.selected).map(column => column.key);
  readonly dataSource = new MatTableDataSource<PortalCase>([]);

  readonly columnLabels: Record<keyof PortalCase, string> = {
    caseId: 'Case ID',
    caseType: 'Case Type',
    patientId: 'Patient ID',
    patientName: 'Patient Name',
    patientDOB: 'Patient DOB',
    drugName: 'Drug Name',
    dose: 'Dose',
    insuranceProvider: 'Insurance Provider',
    prescriber: 'Prescriber'
  };

  activeFilters: ActiveFilter[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private portalService: PortalService
  ) {
    this.dataSource.filterPredicate = (record, rawFilter) => {
      const filters = JSON.parse(rawFilter || '{}') as Partial<Record<keyof PortalCase, string>>;
      return (Object.keys(filters) as Array<keyof PortalCase>).every(key => {
        const filterValue = (filters[key] || '').trim().toLowerCase();
        if (!filterValue) {
          return true;
        }
        return String(record[key] || '').toLowerCase().includes(filterValue);
      });
    };
  }

  ngOnInit(): void {
    this.loadCases();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openFilterDialog(): void {
    const currentValues = this.activeFilters.reduce((acc, filter) => {
      acc[filter.key] = filter.value;
      return acc;
    }, {} as Partial<Record<keyof PortalCase, string>>);

    this.dialog.open(FilterDialogComponent, {
      width: '640px',
      data: {
        labels: this.columnLabels,
        values: currentValues
      },
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'portal-dialog-panel'
    }).afterClosed().subscribe((result?: PortalFilterFormValue) => {
      if (!result) {
        return;
      }
      this.applyFilters(result);
    });
  }

  openColumnsDialog(): void {
    this.dialog.open(ColumnsDialogComponent, {
      width: '420px',
      data: {
        columns: this.columnOptions.map(column => ({ ...column }))
      },
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'portal-dialog-panel'
    }).afterClosed().subscribe((result?: ColumnOption[]) => {
      if (!result?.length) {
        return;
      }

      const selected = result.filter(column => column.selected);
      if (!selected.length) {
        return;
      }

      this.columnOptions.splice(0, this.columnOptions.length, ...result);
      this.displayedColumns = selected.map(column => column.key);
    });
  }

  removeFilter(filterKey: keyof PortalCase): void {
    const nextFilters = this.activeFilters
      .filter(filter => filter.key !== filterKey)
      .reduce((acc, filter) => {
        acc[filter.key] = filter.value;
        return acc;
      }, {} as PortalFilterFormValue);

    this.applyFilters(nextFilters);
  }

  resetFilters(): void {
    this.activeFilters = [];
    this.dataSource.filter = JSON.stringify({});
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  logout(): void {
    sessionStorage.clear();
    localStorage.removeItem('token');
    window.location.href = '/home';
  }

  getColumnLabel(column: string): string {
    return this.columnOptions.find(option => option.key === column)?.label || column;
  }

  trackByColumn(_: number, column: string): string {
    return column;
  }

  private loadCases(): void {
    this.portalService.getCases().subscribe({
      next: (cases) => {
        this.dataSource.data = cases || [];
      },
      error: (error) => {
        console.error('Failed to load portal cases', error);
        this.dataSource.data = [];
      }
    });
  }

  private applyFilters(filters: PortalFilterFormValue): void {
    this.activeFilters = (Object.keys(filters) as Array<keyof PortalCase>)
      .filter(key => (filters[key] || '').trim())
      .map(key => ({
        key,
        label: this.columnLabels[key],
        value: (filters[key] || '').trim()
      }));

    this.dataSource.filter = JSON.stringify(filters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
