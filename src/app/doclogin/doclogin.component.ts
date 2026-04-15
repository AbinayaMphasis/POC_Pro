import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-doclogin',
  templateUrl: './doclogin.component.html',
  styleUrls: ['./doclogin.component.css']
})
export class DocloginComponent implements OnInit {

  loginForm!: FormGroup;
  invalidLogin = false;

  constructor(
    private router: Router,
    public loginservice: AuthenticationService
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
      this.router.navigate(['docdash']);
      this.invalidLogin = false;
    } else {
      this.invalidLogin = true;
      alert('Wrong Credentials');
      this.router.navigate(['home']);
    }
  }

}
