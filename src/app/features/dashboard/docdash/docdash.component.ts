import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../auth/authentication.service';
import { Patient } from '../../../shared/models/patient';
import { PatientService } from '../../../shared/services/patient.service';
import { LookupService } from '../../../shared/services/lookup.service';
import { CaseTypeSelectionService } from '../../patient/createpatient/case-type-selection.service';


@Component({
  selector: 'app-docdash',
  templateUrl: './docdash.component.html', 
  styleUrls: ['./docdash.component.css']
})
export class DocdashComponent implements OnInit {
  searchText: string;
  patients: Patient[]; 
  showCaseOptions = false;
  selectedCaseType = '';
  caseTypes: string[] = [];

  constructor(private patientService: PatientService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private caseTypeSelectionService: CaseTypeSelectionService,
    private lookupService: LookupService) { }

  ngOnInit(): void {
    this.getPatients();
    this.loadServiceTypes();
  }

  private loadServiceTypes(): void {
    this.lookupService.getLookupData(['ServiceType']).subscribe({
      next: (data) => {
        const serviceTypes = data['ServiceType'] || [];
        this.caseTypes = serviceTypes
          .filter((st: any) => st.isActive !== false)
          .map((st: any) => st.value);
      },
      error: (err) => {
        console.error('Failed to load service types', err);
        this.caseTypes = [];
      }
    });
  }

  private getPatients(){
    this.patientService.getPatientslist().subscribe(data => { this.patients = data;});
  }

  viewPatient(id: number) {

    this.router.navigate(['viewpatient', id]);

  }
  updatePatient(id: number) {

    this.router.navigate(['updatepatient', id]);

  }

  deletePatient(id: number) {
    this.patientService.deletePatient(id).subscribe(data => {
      this.getPatients();
    } ); 
  }

  toggleCreateCase(): void {
    this.showCaseOptions = !this.showCaseOptions;
  }

  onCaseTypeSelect(caseType: string): void {
    this.selectedCaseType = caseType;
    this.showCaseOptions = false;
    this.caseTypeSelectionService.selectCaseType(caseType);
    this.router.navigate(['/createpatient']);
  }

  logout() {
    this.authenticationService.logOut();
    this.router.navigate(['/home']);
  }

}
