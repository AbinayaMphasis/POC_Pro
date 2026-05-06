import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PortalListDTO {
  caseId: string;
  caseType: string;
  patientId: string;
  patientName: string;
  patientDOB: string;
  drugName: string;
  dose: string;
  insuranceProvider: string;
  prescriber: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortalService {

  private baseUrl = 'http://localhost:8080/api/v1/cases';

  constructor(private http: HttpClient) {}

  getCases(): Observable<PortalListDTO[]> {
    return this.http.get<PortalListDTO[]>(this.baseUrl);
  }
}
