import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const AUTH_API =  environment.API_URL + "v1/admin/app/users";


@Injectable({
  providedIn: 'root'
})
export class UserAppService {

  constructor(private http: HttpClient) { }

  makeUrlFromAll(filter:string,page:number,name:string,login:string): string{
    let url : string = '';
    if (filter && filter == "inactive"){
      url = url + '/inactive';
    } else if (filter && filter == "active"){
      url = url + '/active';
    }else if (filter && filter == "blocked"){
      url = url + '/blocked';
    } else if (filter && filter == "pending"){
      url = url + '/pending';
    } else if (filter && filter == "completed"){
      url = url + '/completed';
    } else if (filter && filter == "today"){
      url = url + '/today';
    } else if (filter && filter == "geolocation"){
      url = url + '/geolocation';
    } 
    url = url + '?page=' + page;
    if (name){
      url = url + '&name=' + name.toUpperCase();
    } 
    if (login){
      url = url + '&login=' + login;
    } 
    return url;
  }

  getAllAppUsers(page: number,filter:string,name:string,login:string): Observable<any>{
    
    let url : string = AUTH_API;
    if (!page){
        page = 0;
    }
    url = url + this.makeUrlFromAll(filter,page,name,login);
    return this.http.get( url , httpOptions);
  }

  inactivatedAppUser(id: number): Observable<any> {
    let url : string = AUTH_API + "/inactive";
    return this.http.put( url , {"id":id},httpOptions);
  }
  activatedAppUser(id: number): Observable<any> {
    let url : string = AUTH_API + "/active";
    return this.http.put( url , {"id":id},httpOptions);
  }

  unblockedAppUser(id: number): Observable<any> {
    let url : string = AUTH_API + "/unblocked";
    return this.http.put( url , {"id":id},httpOptions);
  }

  getAuditAppUser(page: number,id: number ): Observable<any> {
    let url : string = AUTH_API;
    if (!page){
        page = 0;
    }
    url = url + '/audit?id=' + id + '&page=' + page;
   
    return this.http.get( url , httpOptions);
  }

}
