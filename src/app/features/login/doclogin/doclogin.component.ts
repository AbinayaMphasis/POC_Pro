import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../auth/authentication.service';
import { IntakeConfigService } from '../../../shared/services/intake-config.service';

@Component({
  selector: 'app-doclogin',
  templateUrl: './doclogin.component.html',
  styleUrls: ['./doclogin.component.css']
})
export class DocloginComponent implements OnInit {

  loginForm!: FormGroup;
  createUserForm!: FormGroup;
  invalidLogin = false;
  showCreateUserForm = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private router: Router,
    public loginservice: AuthenticationService,
    private intakeConfigService: IntakeConfigService
  ) {
  }

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)])
    });

    this.createUserForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)])
    });
  }

  toggleCreateUserForm(): void {
    this.showCreateUserForm = !this.showCreateUserForm;
    this.successMessage = '';
    this.errorMessage = '';
    if (this.showCreateUserForm) {
      this.loginForm.reset();
    } else {
      this.createUserForm.reset();
    }
  }

  checkLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    const { username, password } = this.loginForm.value;
    
    this.loginservice.authenticate(username, password).subscribe({
      next: (user: any) => {
        if (user && user.role === 'doctor') {
          sessionStorage.setItem('username', username);
          this.intakeConfigService.loadAndStore().subscribe({
            next: () => this.router.navigate(['docdash']),
            error: () => this.router.navigate(['docdash'])
          });
          this.invalidLogin = false;
        } else {
          this.invalidLogin = true;
          alert('Wrong Credentials or not a doctor account');
          this.router.navigate(['home']);
        }
      },
      error: (error: any) => {
        this.invalidLogin = true;
        alert('Wrong Credentials');
        this.router.navigate(['home']);
      }
    });
  }

  createUser(): void {
    if (this.createUserForm.invalid) {
      return;
    }
    const { username, password } = this.createUserForm.value;
    
    this.loginservice.createUser(username, password, 'doctor').subscribe({
      next: (response: any) => {
        this.successMessage = 'User created successfully! You can now login.';
        this.errorMessage = '';
        this.createUserForm.reset();
        setTimeout(() => {
          this.toggleCreateUserForm();
        }, 2000);
      },
      error: (error: any) => {
        this.errorMessage = error.error?.message || 'Error creating user. Please try again.';
        this.successMessage = '';
      }
    });
  }

}
