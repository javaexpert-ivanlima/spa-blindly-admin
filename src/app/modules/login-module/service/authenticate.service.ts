import { Injectable } from '@angular/core';
import { Login } from '../model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const AUTH_API =  "http://localhost:8080/v1/authenticate/admin";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http: HttpClient) { }
  
  login(login: Login): Observable<any> {
    return this.http.post(AUTH_API , login, httpOptions);
  }

}