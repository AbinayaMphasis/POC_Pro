import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CaseTypeSelectionService {
  private selectedCaseTypeSubject = new BehaviorSubject<string>('');

  selectedCaseType$: Observable<string> = this.selectedCaseTypeSubject.asObservable();

  selectCaseType(caseType: string): void {
    this.selectedCaseTypeSubject.next(caseType);
  }

  clearCaseType(): void {
    this.selectedCaseTypeSubject.next('');
  }

  get currentCaseType(): string {
    return this.selectedCaseTypeSubject.getValue();
  }
}