import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const AUTH_API =  environment.API_URL + "v1/admin/questions";
const QUIZ_API =  environment.API_URL + "v1/admin/quiz";

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http: HttpClient) { }
 
  getAllQuestionByCategory(page: number,filter:string,category:number,name:string): Observable<any>{
    let url : string = AUTH_API;
    if (!page){
        page = 0;
    }
    if (filter && filter == "all"){
      url = url + '?page=' + page;
      if (name){
        url = url + '&name=' + name.toUpperCase();
      } 
      if (category){
        url = url + '&categoryId=' + category;
      } 
    }else if (filter && filter == "inactive"){
      url = url + '/inactive?page=' + page;
      if (name){
        url = url + '&name=' + name.toUpperCase();
      } 
      if (category){
        url = url + '&categoryId=' + category;
      } 
    }else if (filter && filter == "active"){
      url = url + '/active?page=' + page;
      if (name){
        url = url + '&name=' + name.toUpperCase();
      } 
      if (category){
        url = url + '&categoryId=' + category;
      }       
    }else{
      url = url + '?page=' + page;
    }
    //let url = AUTH_API + '/category?page=' + page + '&categoryId=' +category;
    return this.http.get( url , httpOptions);
  }

  inactivatedQuestion(id: number): Observable<any> {
    let url : string = AUTH_API + "/inactive";
    return this.http.put( url , {"id":id},httpOptions);
  }
  activatedQuestion(id: number): Observable<any> {
    let url : string = AUTH_API + "/active";
    return this.http.put( url , {"id":id},httpOptions);
  }
  getAuditQuestion(page: number,id: number ): Observable<any> {
    let url : string = AUTH_API;
    if (!page){
        page = 0;
    }
    url = url + '/audit?id=' + id + '&page=' + page;
   
    return this.http.get( url , httpOptions);
  }

  createQuestion(categoryCode: number,question: string,weight: number,multipleChoice: string,answers: any[]): Observable<any> {
    let url : string = AUTH_API;
    return this.http.post( url , {"categoryCode":categoryCode,"question":question,"weight":weight,"multipleChoice":multipleChoice,"answers":answers},httpOptions);
  }

  updateQuestion(questionID:number,categoryCode: number,question: string,weight: number,multipleChoice: string,answers: any[]): Observable<any> {
    let url : string = AUTH_API;
    return this.http.put( url , {"id":questionID,"categoryCode":categoryCode,"question":question,"weight":weight,"multipleChoice":multipleChoice,"answers":answers},httpOptions);
  }

  getQuizOrder(): Observable<any>{
    let url : string = QUIZ_API;
    return this.http.get( url , httpOptions);
  }

  setQuizOrder(questions): Observable<any>{
    let url : string = QUIZ_API;
    return this.http.put( url ,{"questions":questions},httpOptions);
  }
}
