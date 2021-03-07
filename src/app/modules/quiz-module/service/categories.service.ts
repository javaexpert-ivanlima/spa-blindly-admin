import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const AUTH_API =  "http://localhost:8080/v1/admin/categories";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getAllCategories(page: number): Observable<any> {
    let url : string = AUTH_API;
    if (!page){
        page = 0;
    }
    url = url + '?page=' + page;
    return this.http.get( url , httpOptions);
  }

  inactivatedCategory(id: number): Observable<any> {
    let url : string = AUTH_API + "/inactive";
    return this.http.put( url , {"id":id,"createdBy": "spa"},httpOptions);
  }
  activatedCategory(id: number): Observable<any> {
    let url : string = AUTH_API + "/active";
    return this.http.put( url , {"id":id,"createdBy": "spa2"},httpOptions);
  }
}
