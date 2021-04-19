import { Injectable } from '@angular/core';
import * as moment from 'moment';

const TOKEN_KEY = 'auth-token';
const ROLE_KEY = 'auth-roles';
const SUB_KEY = 'auth-sub';
const USER_KEY = 'auth-user';

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
    this.saveSub(json);
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
    let expiredDate: number = json.exp;
    let isExpired: boolean = moment.unix(currentDate).isAfter(moment.unix(expiredDate));
    return isExpired;
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return user;
    }

    return null;
  }

  private saveRoles(roles: any): void {
    window.sessionStorage.removeItem(ROLE_KEY);
    window.sessionStorage.setItem(ROLE_KEY, JSON.stringify(roles));
  }

  private saveSub(json: any): void {
    window.sessionStorage.removeItem(SUB_KEY);
    window.sessionStorage.setItem(SUB_KEY, json.sub);
  }
  public getRoles(): any {
    const roles = window.sessionStorage.getItem(ROLE_KEY);
    if (roles) {
      return JSON.parse(roles);
    }

    return {};
  }

  public getSub(): any {
    const sub = window.sessionStorage.getItem(SUB_KEY);
    if (sub) {
      return sub;
    }

    return null;
  }

  public getExpireDate(): any {
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      let json: any = this.getJsonFromToken(token);   
      return json.exp;
    }

    return null;
  }

}
