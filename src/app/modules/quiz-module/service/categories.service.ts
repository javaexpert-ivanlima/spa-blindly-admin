import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const AUTH_API =  environment.API_URL + "v1/admin/categories";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getAllCategories(page: number,filter: string, name: string ): Observable<any> {
    let url : string = AUTH_API;
    if (!page){
        page = 0;
    }
    if (filter && filter == "all"){
      url = url + '?page=' + page;
      if (name){
        url = url + '&name=' + name;
      } 
    }else if (filter && filter == "inactive"){
      url = url + '/inactive?page=' + page;
      if (name){
        url = url + '&name=' + name;
      } 
    }else if (filter && filter == "active"){
      url = url + '/active?page=' + page;
      if (name){
        url = url + '&name=' + name;
      } 
    }else{
      url = url + '?page=' + page;
    }
    return this.http.get( url , httpOptions);
  }
  getAllCategoriesNoPagination(): Observable<any>{
      let url = AUTH_API + '/all' ;
      return this.http.get( url , httpOptions);
  }

  getAllActiveCategoriesNoPagination(): Observable<any>{
    let url = AUTH_API + '/active/all' ;
    return this.http.get( url , httpOptions);
  }

  inactivatedCategory(id: number): Observable<any> {
    let url : string = AUTH_API + "/inactive";
    return this.http.put( url , {"id":id},httpOptions);
  }
  activatedCategory(id: number): Observable<any> {
    let url : string = AUTH_API + "/active";
    return this.http.put( url , {"id":id},httpOptions);
  }

  createCategory(category: string): Observable<any> {
    return this.http.post( AUTH_API , {"nameCategory":category},httpOptions);
  }

  updateCategory(id: number,category: string): Observable<any> {
    return this.http.put( AUTH_API , {"id":id,"nameCategory":category},httpOptions);
  }

  getAuditCategory(page: number,id: number ): Observable<any> {
    let url : string = AUTH_API;
    if (!page){
        page = 0;
    }
    url = url + '/audit?id=' + id + '&page=' + page;
   
    return this.http.get( url , httpOptions);
  }
}
