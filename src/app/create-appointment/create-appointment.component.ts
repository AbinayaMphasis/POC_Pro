import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Appointment } from '../appointment';
import { AppointmentService } from '../appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.css']
})
export class CreateAppointmentComponent implements OnInit {

  appointmentForm!: FormGroup;
  submitted = false;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.appointmentForm = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z ]{2,50}$')]),
      age: new FormControl('', [Validators.required, Validators.min(0), Validators.max(150)]),
      symptoms: new FormControl('', [Validators.required, Validators.minLength(5)]),
      number: new FormControl('', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')])
    });
  }

  saveAppointment() {
    if (this.appointmentForm.invalid) {
      return;
    }
    const appointment: Appointment = this.appointmentForm.value;
    this.appointmentService.createAppointment(appointment).subscribe(
      data => {
        console.log(data);
        this.goToAppointmentList();
      },
      error => console.log(error)
    );
  }

  goToAppointmentList() {
    this.router.navigate(['/appointmentlist']);
  }

  onSubmit() {
    this.submitted = true;
    if (this.appointmentForm.valid) {
      this.saveAppointment();
    }
  }

}
