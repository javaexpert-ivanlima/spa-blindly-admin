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
export class UserService {

  constructor(private http: HttpClient) { }

  getAllAdminUsers(): Observable<any>{
    let url = AUTH_API;
    return this.http.get( url , httpOptions);
  }

  createAdminUser(name: string,login: string,superUser: string){
    let url = AUTH_API;
    return this.http.post( url , {"email":login,"name":name,"isSuperUser":superUser},httpOptions);
  }

  inactivatedQuestion(id: number): Observable<any> {
    let url : string = AUTH_API + "/inactive";
    return this.http.put( url , {"id":id},httpOptions);
  }
  activatedQuestion(id: number): Observable<any> {
    let url : string = AUTH_API + "/active";
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
