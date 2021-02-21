import { Injectable } from '@angular/core';
import { Login } from '../model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  private readonly BASE_URL = "http://localhost:8080/v1/authenticate/admin";

  constructor() { }
  
}
