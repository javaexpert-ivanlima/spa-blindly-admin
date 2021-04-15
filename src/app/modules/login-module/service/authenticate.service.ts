import { Injectable } from '@angular/core';
import { Login } from '../model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'Accept-Language':'en_US'})
};

const AUTH_API =  "http://localhost:8080/v1/authenticate/admin";
const ACTIVATE_API = "http://localhost:8080/v1/register/activate?param=";

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

}
