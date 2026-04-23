import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface IntakeConfig {
  caseTypeByDrug: Record<string, string[]>;
}

@Injectable({
  providedIn: 'root'
})
export class IntakeConfigService {

  private static readonly STORAGE_KEY = 'intakeConfig';
  private apiUrl = 'http://localhost:8080/api/v1/intake-config';

  constructor(private http: HttpClient) {}

  /** Call this once after successful login to fetch and store config */
  loadAndStore(): Observable<IntakeConfig> {
    return this.http.get<IntakeConfig>(this.apiUrl).pipe(
      tap(config => localStorage.setItem(IntakeConfigService.STORAGE_KEY, JSON.stringify(config)))
    );
  }

  /** Read config synchronously from localStorage */
  getConfig(): IntakeConfig | null {
    const raw = localStorage.getItem(IntakeConfigService.STORAGE_KEY);
    return raw ? JSON.parse(raw) as IntakeConfig : null;
  }

  /** Get case type keys synchronously */
  getCaseTypes(): string[] {
    const config = this.getConfig();
    return config ? Object.keys(config.caseTypeByDrug) : [];
  }

  /** Get drug names for a case type synchronously */
  getDrugNamesByCaseType(caseType: string): string[] {
    const config = this.getConfig();
    return config?.caseTypeByDrug[caseType] ?? [];
  }

  /** Clear stored config on logout */
  clearConfig(): void {
    localStorage.removeItem(IntakeConfigService.STORAGE_KEY);
  }
}
