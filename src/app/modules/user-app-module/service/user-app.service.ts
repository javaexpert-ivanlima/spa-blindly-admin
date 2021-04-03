import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const AUTH_API =  "http://localhost:8080/v1/admin/users";


@Injectable({
  providedIn: 'root'
})
export class UserAppService {

  constructor(private http: HttpClient) { }

  getAllAdminUsers(page: number,filter:string,name:string,login:string): Observable<any>{
    
    let url : string = AUTH_API;
    if (!page){
        page = 0;
    }
    if (filter && filter == "all"){
      url = url + '?page=' + page;
      if (name){
        url = url + '&name=' + name.toUpperCase();
      } 
      if (login){
        url = url + '&login=' + login;
      } 
    }else if (filter && filter == "inactive"){
      url = url + '/inactive?page=' + page;
      if (name){
        url = url + '&name=' + name.toUpperCase();
      } 
      if (login){
        url = url + '&login=' + login;
      } 
    }else if (filter && filter == "blocked"){
      url = url + '/blocked?page=' + page;
      if (name){
        url = url + '&name=' + name.toUpperCase();
      } 
      if (login){
        url = url + '&login=' + login;
      }  
    } else if (filter && filter == "active"){
      url = url + '/active?page=' + page;
      if (name){
        url = url + '&name=' + name.toUpperCase();
      } 
      if (login){
        url = url + '&login=' + login;
      }       
    }else{
      url = url + '?page=' + page;
    }
    return this.http.get( url , httpOptions);
  }

  createAdminUser(name: string,login: string,superUser: string){
    let url = AUTH_API;
    return this.http.post( url , {"email":login,"name":name,"isSuperUser":superUser},httpOptions);
  }

  updateAdminUser(id: number,form: any){
    let url = AUTH_API;
    return this.http.put( url , {"id":id,"email":form.login.value,"name":form.name.value,"isSuperUser":form.superUser.value},httpOptions);
  }

  inactivatedAdminUser(id: number): Observable<any> {
    let url : string = AUTH_API + "/inactive";
    return this.http.put( url , {"id":id},httpOptions);
  }
  activatedAdminUser(id: number): Observable<any> {
    let url : string = AUTH_API + "/active";
    return this.http.put( url , {"id":id},httpOptions);
  }

  unblockedAdminUser(id: number): Observable<any> {
    let url : string = AUTH_API + "/unblocked";
    return this.http.put( url , {"id":id},httpOptions);
  }

  getAuditAdminUser(page: number,id: number ): Observable<any> {
    let url : string = AUTH_API;
    if (!page){
        page = 0;
    }
    url = url + '/audit?id=' + id + '&page=' + page;
   
    return this.http.get( url , httpOptions);
  }

}
