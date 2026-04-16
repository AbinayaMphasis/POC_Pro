import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  url: string = 'http://localhost:8080/api/auth';
  
  authenticate(username: string, password: string): Observable<any> {
    const user = {
      username: username,
      password: password
    };
    return this.http.post(`${this.url}/login`, user);
  }

  createUser(username: string, password: string, role: string): Observable<any> {
    const user = {
      username: username,
      password: password,
      role: role
    };
    return this.http.post(`${this.url}/create-user`, user);
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('username')
    console.log(!(user === null))
    return !(user === null)
  }

  logOut() {
    sessionStorage.removeItem('username')
  }

}