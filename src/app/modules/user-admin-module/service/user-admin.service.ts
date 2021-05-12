import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const AUTH_API =  environment.API_URL + "v1/admin/users";


@Injectable({
  providedIn: 'root'
})
export class UserAdminService {

  constructor(private http: HttpClient) { }

  getAllAdminUsers(page: number,filter:string,name:string,login:string,sort:any): Observable<any>{
    
    let url : string = AUTH_API;
    if (!page){
        page = 0;
    }
    if (filter && filter == "all"){
      url = url + '?page=' + page;
      if (name){
        url = url + '&name=' + name;
      } 
      if (login){
        url = url + '&login=' + login;
      } 
    }else if (filter && filter == "inactive"){
      url = url + '/inactive?page=' + page;
      if (name){
        url = url + '&name=' + name;
      } 
      if (login){
        url = url + '&login=' + login;
      } 
    }else if (filter && filter == "blocked"){
      url = url + '/blocked?page=' + page;
      if (name){
        url = url + '&name=' + name;
      } 
      if (login){
        url = url + '&login=' + login;
      }  
    } else if (filter && filter == "active"){
      url = url + '/active?page=' + page;
      if (name){
        url = url + '&name=' + name;
      } 
      if (login){
        url = url + '&login=' + login;
      }       
    }else{
      url = url + '?page=' + page;
    }
    if (sort){
      url = url+'&itensPerpage='+sort.itensPerPage+'&sortName='+this.getColumnName(sort.sortName)+'&sortDirection='+sort.sortDirection;
    }

    return this.http.get( url , httpOptions);
  }

  getColumnName(position){
    if (position == 0){
        return "id";
    } else if (position == 1){
        return "login";
    } else if (position == 2){
        return "name";
    } else if (position == 3){
        return "isSuper";
    } else if (position == 4){
      return "active";
    } else if (position == 5){
      return "blocked";
    } else if (position == 6){
      return "lastUpdateDate";
    } else if (position == 7){
      return "modifiedBy";
    }else {
      return "name";
    }
}

  createAdminUser(name: string,login: string,superUser: string,json: any){
    let url = AUTH_API;
    return this.http.post( url , {"email":login,"name":name,"isSuperUser":superUser,"permissions":{"permission":json}},httpOptions);
  }

  updateAdminUser(id: number,form: any,json: any){
    let url = AUTH_API;
    return this.http.put( url , {"id":id,"email":form.login.value,"name":form.name.value,"isSuperUser":form.superUser.value,"permissions":{"permission":json}},httpOptions);
  }

  updateAdminUserWithPassword(id: number,form: any,json: any,superUser:string,fileContent:any){
    let url = AUTH_API;
    return this.http.put( url , {"id":id,"email":form.login.value,"name":form.name.value,"password":form.password.value,"isSuperUser":superUser=='Y'?'Yes':'No',"permissions":null,"file":fileContent},httpOptions);
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

  getAuditAdminUser(page: number,id: number , sort: any): Observable<any> {
    let url : string = AUTH_API;
    if (!page){
        page = 0;
    }
    url = url + '/audit?id=' + id + '&page=' + page;
    if (sort){
      url = url+'&itensPerpage='+sort.itensPerPage+'&sortName='+this.getColumnNameAudit(sort.sortName)+'&sortDirection='+sort.sortDirection;
    }   
    return this.http.get( url , httpOptions);
  }
  getColumnNameAudit(position){
    if (position == 0){
        return "tablePK";
    } else if (position == 1){
        return "changedDate";
    } else if (position == 2){
        return "changedBy";
    } else if (position == 3){
        return "columnName";
    } else if (position == 4){
      return "oldValue";
    } else if (position == 5){
      return "newValue";
    } else {
      return "changedDate";
    }
}
  getAllPermissions(): Observable<any> {
    let url : string = AUTH_API;
    url = url + '/permissions';
   
    return this.http.get( url , httpOptions);
  }
  
}
