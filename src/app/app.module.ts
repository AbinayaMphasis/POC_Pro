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
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { DocloginComponent } from './doclogin/doclogin.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { DocdashComponent } from './docdash/docdash.component';
import { AdmindashComponent } from './admindash/admindash.component';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from './auth-gaurd.service';
import { CreatepatientComponent } from './createpatient/createpatient.component';
import { AuthenticationService } from './authentication.service';
import { UpdatePatientComponent } from './update-patient/update-patient.component';
import { MedicineListComponent } from './medicine-list/medicine-list.component';
import { CreatemedicineComponent } from './createmedicine/createmedicine.component';
import { UpdateMedicineComponent } from './update-medicine/update-medicine.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { ViewPatientComponent } from './view-patient/view-patient.component';
import { AdminauthService } from './adminauth.service';
import { AdminauthguardService } from './adminauthguard.service';

// Intake section components (under createpatient/)
import { PatientInfoSectionComponent } from './createpatient/patient-info-section/patient-info-section.component';
import { MedicalHistorySectionComponent } from './createpatient/medical-history-section/medical-history-section.component';
import { InsuranceSectionComponent } from './createpatient/insurance-section/insurance-section.component';
import { PhysicianSectionComponent } from './createpatient/physician-section/physician-section.component';
import { PrescriptionSectionComponent } from './createpatient/prescription-section/prescription-section.component';
import { ConsentSectionComponent } from './createpatient/consent-section/consent-section.component';

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
