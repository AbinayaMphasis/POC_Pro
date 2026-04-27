import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  private apiUrl = 'http://localhost:8080/api/v1/lookups';

  constructor(private http: HttpClient) {}

  /**
   * Fetches lookup data for the given table names.
   *
   * @param tableNames e.g. ['ServiceType', 'Drugs']
   * @returns Observable of a map: { ServiceType: [...], Drugs: [...] }
   */
  getLookupData(tableNames: string[]): Observable<Record<string, any[]>> {
    return this.http.post<Record<string, any[]>>(this.apiUrl, tableNames);
  }
}
