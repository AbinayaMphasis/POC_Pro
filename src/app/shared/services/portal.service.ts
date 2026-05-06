import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortalCase } from '../models/portal-case';

@Injectable({
  providedIn: 'root'
})
export class PortalService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/portal/cases';

  constructor(private http: HttpClient) {}

  getCases(caseId?: number): Observable<PortalCase[]> {
    if (caseId) {
      return this.http.get<PortalCase[]>(`${this.baseUrl}?caseId=${caseId}`);
    }
    return this.http.get<PortalCase[]>(this.baseUrl);
  }
}
