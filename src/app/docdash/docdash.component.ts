import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { Patient } from '../patient';
import { PatientService } from '../patient.service';
import { CASE_TYPES } from '../constants/intake-config';
import { CaseTypeSelectionService } from '../createpatient/case-type-selection.service';


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
  readonly caseTypes: string[] = CASE_TYPES;

  constructor(private patientService: PatientService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private caseTypeSelectionService: CaseTypeSelectionService) { }

  ngOnInit(): void {
    this.getPatients();
    
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
      console.log(data);
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
