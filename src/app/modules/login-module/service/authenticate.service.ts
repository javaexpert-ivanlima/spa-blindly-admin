import { Injectable } from '@angular/core';
import { Login } from '../model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from 'src/app/component';


const AUTH_API =  environment.API_URL + "v1/authenticate/admin";
const ACTIVATE_API = environment.API_URL + "v1/register/activate?param=";
const FORGOT_PASSWORD_API = environment.API_URL + "v1/register/admin/forgotPassword";
const ADMIN_USER_API =  environment.API_URL + "v1/admin/users?page=0&login=";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }
  
  login(login: Login): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'Accept-Language':this.tokenStorage.getAcceptLanguage()})
    };
    return this.http.post(AUTH_API , login, httpOptions);
  }

  activate(token:string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'Accept-Language':this.tokenStorage.getAcceptLanguage()})
    };
    return this.http.post(ACTIVATE_API+token , {}, httpOptions);
  }

  forgotPassword(email:string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'Accept-Language':this.tokenStorage.getAcceptLanguage()})
    };
    return this.http.post(FORGOT_PASSWORD_API , {"email":email}, httpOptions);
  }
  
  getAdminUser(login:string) : Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'Accept-Language':this.tokenStorage.getAcceptLanguage()})
    };
    return this.http.get( ADMIN_USER_API+login , httpOptions);
  }

}
