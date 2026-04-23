import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../auth/authentication.service';
import { Patient } from '../../../shared/models/patient';
import { PatientService } from '../../../shared/services/patient.service';
import { IntakeConfigService } from '../../../shared/services/intake-config.service';
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
    private intakeConfigService: IntakeConfigService) { }

  ngOnInit(): void {
    this.getPatients();
    this.caseTypes = this.intakeConfigService.getCaseTypes();
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
