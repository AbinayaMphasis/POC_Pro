import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Drug } from './drug.model';

@Injectable({ providedIn: 'root' })
export class DrugSelectionService {

  private selectedDrugSubject = new BehaviorSubject<Drug | null>(null);

  /** Emits the currently selected drug, or null if none is selected. */
  selectedDrug$: Observable<Drug | null> = this.selectedDrugSubject.asObservable();

  selectDrug(drug: Drug): void {
    this.selectedDrugSubject.next(drug);
  }

  clearDrug(): void {
    this.selectedDrugSubject.next(null);
  }

  get currentDrug(): Drug | null {
    return this.selectedDrugSubject.getValue();
  }
}
