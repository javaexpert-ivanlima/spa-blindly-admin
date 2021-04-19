import { Injectable } from '@angular/core';
import { Login } from '../model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'Accept-Language':'en_US'})
};

const AUTH_API =  "http://localhost:8080/v1/authenticate/admin";
const ACTIVATE_API = "http://localhost:8080/v1/register/activate?param=";
const FORGOT_PASSWORD_API = "http://localhost:8080/v1/register/admin/forgotPassword";
const ADMIN_USER_API =  "http://localhost:8080/v1/admin/users?page=0&login=";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http: HttpClient) { }
  
  login(login: Login): Observable<any> {
    return this.http.post(AUTH_API , login, httpOptions);
  }

  activate(token:string): Observable<any> {
    return this.http.post(ACTIVATE_API+token , {}, httpOptions);
  }

  forgotPassword(email:string): Observable<any> {
    return this.http.post(FORGOT_PASSWORD_API , {"email":email}, httpOptions);
  }
  
  getAdminUser(login:string) : Observable<any>{
    return this.http.get( ADMIN_USER_API+login , httpOptions);
  }

}
