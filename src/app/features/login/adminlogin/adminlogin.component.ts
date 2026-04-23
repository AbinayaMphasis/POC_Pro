import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminauthService } from '../../../auth/adminauth.service';
import { Router } from '@angular/router';
import { IntakeConfigService } from '../../../shared/services/intake-config.service';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent implements OnInit {

  loginForm!: FormGroup;
  invalidLogin = false;

  constructor(
    private router: Router,
    public loginservice: AdminauthService,
    private intakeConfigService: IntakeConfigService
  ) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)])
    });
  }

  checkLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    const { username, password } = this.loginForm.value;
    if (this.loginservice.authenticate(username, password)) {
      this.intakeConfigService.loadAndStore().subscribe({
        next: () => this.router.navigate(['admindash']),
        error: () => this.router.navigate(['admindash'])
      });
      this.invalidLogin = false;
    } else {
      this.invalidLogin = true;
      alert('Wrong Credentials');
      this.router.navigate(['home']);
    }
  }

}
