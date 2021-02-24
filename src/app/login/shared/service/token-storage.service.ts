import { Injectable } from '@angular/core';
import * as moment from 'moment';

const TOKEN_KEY = 'auth-token';
const ROLE_KEY = 'auth-roles';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    let json: any = this.getJsonFromToken(token);
    this.saveRoles(this.getAuthorities(json));
    this.getToken();
  }

  public getToken(): string | null {
        let token: string = window.sessionStorage.getItem(TOKEN_KEY);
        if (token != null){
            let json: any = this.getJsonFromToken(token);
            if (this.isTokenExpired(json)){
              this.signOut();
            }else{
              return token;
            }
        }else{
          this.signOut();
        }
        
    return token;
  }

  private getJsonFromToken(token:string): string{
    return JSON.parse(atob(token.split('.')[1]));
  }

  private getAuthorities(json: any): any{
    return json.authorities;
  }

  public isTokenExpired(json: any): boolean {
    let currentDate: number = Date.now()/1000;
    console.log(currentDate);
    let expiredDate: number = json.exp;
    let isExpired: boolean = moment.unix(currentDate).isAfter(moment.unix(expiredDate));
    console.log("current date "+moment.unix(currentDate).format('dddd, MMMM Do, YYYY h:mm:ss A'));
    console.log("expired token "+moment.unix(expiredDate).format('dddd, MMMM Do, YYYY h:mm:ss A'));
    console.log("expired => " + isExpired);
    return isExpired;
  }

  private saveRoles(roles: any): void {
    window.sessionStorage.removeItem(ROLE_KEY);
    window.sessionStorage.setItem(ROLE_KEY, JSON.stringify(roles));
  }

  public getRoles(): any {
    const roles = window.sessionStorage.getItem(ROLE_KEY);
    if (roles) {
      return JSON.parse(roles);
    }

    return {};
  }

}
