import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { ColumnsDialogComponent } from './columns-dialog/columns-dialog.component';
import { PortalService, PortalListDTO } from '../../../shared/services/portal.service';

export type PortalRow = PortalListDTO;

const ALL_COLUMNS: string[] = [
  'caseId', 'caseType', 'patientId', 'patientName',
  'patientDOB', 'drugName', 'dose', 'insuranceProvider', 'prescriber'
];

@Component({
  selector: 'app-external-portal',
  templateUrl: './external-portal.component.html',
  styleUrls: ['./external-portal.component.css']
})
export class ExternalPortalComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  allColumns = ALL_COLUMNS;
  displayedColumns: string[] = [...ALL_COLUMNS];
  dataSource = new MatTableDataSource<PortalRow>();

  activeFilters: { [key: string]: string } = {};
  username = 'Admin';
  isLoading = false;
  errorMessage = '';

  filtersForm: FormGroup;
  columnsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private portalService: PortalService
  ) {
    this.filtersForm = this.fb.group({});
    this.columnsForm = this.fb.group({});
  }

  ngOnInit(): void {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) {
      try { this.username = JSON.parse(stored).username || 'User'; } catch { this.username = 'User'; }
    }

    this.isLoading = true;
    this.portalService.getCases().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load cases. Please try again.';
        this.isLoading = false;
        console.error('Error loading cases:', err);
      }
    });

    this.dataSource.filterPredicate = (data: PortalRow, filter: string) => {
      const filters = JSON.parse(filter) as { [key: string]: string };
      return Object.keys(filters).every(key => {
        const val = (data as any)[key];
        return val != null && val.toString().toLowerCase().includes(filters[key].toLowerCase());
      });
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getFilterLabel(col: string): string {
    return col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }

  get activeFilterKeys(): string[] {
    return Object.keys(this.activeFilters);
  }

  openFiltersDialog(): void {
    const ref = this.dialog.open(FilterDialogComponent, {
      width: '500px',
      data: { columns: this.allColumns, currentFilters: { ...this.activeFilters } }
    });

    ref.afterClosed().subscribe(result => {
      if (result !== null && result !== undefined) {
        this.activeFilters = result;
        this.applyTableFilter();
      }
    });
  }

  openColumnsDialog(): void {
    const ref = this.dialog.open(ColumnsDialogComponent, {
      width: '400px',
      data: { allColumns: this.allColumns, activeColumns: [...this.displayedColumns] }
    });

    ref.afterClosed().subscribe(result => {
      if (result !== null && result !== undefined) {
        this.displayedColumns = result;
      }
    });
  }

  removeFilter(key: string): void {
    delete this.activeFilters[key];
    this.activeFilters = { ...this.activeFilters };
    this.applyTableFilter();
  }

  resetAllFilters(): void {
    this.activeFilters = {};
    this.applyTableFilter();
  }

  private applyTableFilter(): void {
    if (Object.keys(this.activeFilters).length === 0) {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = JSON.stringify(this.activeFilters);
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
