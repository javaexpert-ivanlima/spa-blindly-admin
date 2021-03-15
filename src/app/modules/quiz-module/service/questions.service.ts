import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const AUTH_API =  "http://localhost:8080/v1/admin/questions";

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http: HttpClient) { }
 
  getAllQuestionByCategory(page: number,category:number): Observable<any>{
    let url = AUTH_API + '/category?page=' + page + '&categoryId=' +category;
    return this.http.get( url , httpOptions);
  }
}
