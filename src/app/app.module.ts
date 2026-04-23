import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Auth services
import { AuthenticationService } from './auth/authentication.service';
import { AdminauthService } from './auth/adminauth.service';

// Guards
import { AuthGaurdService } from './guards/auth-gaurd.service';
import { AdminauthguardService } from './guards/adminauthguard.service';

// Login feature components
import { DocloginComponent } from './features/login/doclogin/doclogin.component';
import { AdminloginComponent } from './features/login/adminlogin/adminlogin.component';

// Dashboard feature components
import { DocdashComponent } from './features/dashboard/docdash/docdash.component';
import { AdmindashComponent } from './features/dashboard/admindash/admindash.component';

// Patient feature components
import { CreatepatientComponent } from './features/patient/createpatient/createpatient.component';
import { UpdatePatientComponent } from './features/patient/update-patient/update-patient.component';
import { ViewPatientComponent } from './features/patient/view-patient/view-patient.component';

// Medicine feature components
import { MedicineListComponent } from './features/medicine/medicine-list/medicine-list.component';
import { CreatemedicineComponent } from './features/medicine/createmedicine/createmedicine.component';
import { UpdateMedicineComponent } from './features/medicine/update-medicine/update-medicine.component';

// Appointment feature components
import { AppointmentListComponent } from './features/appointment/appointment-list/appointment-list.component';
import { CreateAppointmentComponent } from './features/appointment/create-appointment/create-appointment.component';

// Newsfeed
import { NewsfeedComponent } from './features/newsfeed/newsfeed.component';

// Intake section components (under patient/createpatient/)
import { PatientInfoSectionComponent } from './features/patient/createpatient/patient-info-section/patient-info-section.component';
import { MedicalHistorySectionComponent } from './features/patient/createpatient/medical-history-section/medical-history-section.component';
import { InsuranceSectionComponent } from './features/patient/createpatient/insurance-section/insurance-section.component';
import { PhysicianSectionComponent } from './features/patient/createpatient/physician-section/physician-section.component';
import { PrescriptionSectionComponent } from './features/patient/createpatient/prescription-section/prescription-section.component';
import { ConsentSectionComponent } from './features/patient/createpatient/consent-section/consent-section.component';

const routes: Routes = [
  { path: '', component: NewsfeedComponent },
  { path: 'doclogin', component: DocloginComponent },
  { path: 'adlogin', component: AdminloginComponent },
  { path: 'home', component: NewsfeedComponent },
  { path: 'createpatient', component: CreatepatientComponent },
  { path: 'docdash', component: DocdashComponent, canActivate: [AuthGaurdService] },
  { path: 'updatepatient/:id', component: UpdatePatientComponent, canActivate: [AuthGaurdService] },
  { path: 'admindash', component: AdmindashComponent, canActivate: [AdminauthguardService] },
  { path: 'medicinelist', component: MedicineListComponent, canActivate: [AuthGaurdService] },
  { path: 'createmedicine', component: CreatemedicineComponent, canActivate: [AuthGaurdService] },
  { path: 'updatemedicine/:id', component: UpdateMedicineComponent, canActivate: [AuthGaurdService] },
  { path: 'appointmentlist', component: AppointmentListComponent, canActivate: [AuthGaurdService] },
  { path: 'createappointment', component: CreateAppointmentComponent, canActivate: [AuthGaurdService] },
  { path: 'viewpatient/:id', component: ViewPatientComponent }

]

@NgModule({
  declarations: [
    AppComponent,
    NewsfeedComponent,
    DocloginComponent,
    AdminloginComponent,
    DocdashComponent,
    AdmindashComponent,
    CreatepatientComponent,
    UpdatePatientComponent,
    MedicineListComponent,
    CreatemedicineComponent,
    UpdateMedicineComponent,
    AppointmentListComponent,
    CreateAppointmentComponent,
    ViewPatientComponent,
    // Intake section components
    PatientInfoSectionComponent,
    MedicalHistorySectionComponent,
    InsuranceSectionComponent,
    PhysicianSectionComponent,
    PrescriptionSectionComponent,
    ConsentSectionComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    Ng2SearchPipeModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    CalendarModule,
    DropdownModule,
    InputTextareaModule,
    RadioButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
