import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenStorageService } from 'src/app/component/';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const AUTH_API =  environment.API_URL + "v1/admin/users";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenStorage: TokenStorageService
    //private userService: UserAdminService

    
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>|boolean {
    let permission:string = route.data.permission as string;
    return this.hasAccess(permission);

  }

  hasAccess(permission:string):Observable<boolean>|boolean{
    if (this.tokenStorage.getToken()) {
      return this.checkPermission(permission).pipe(map( (resp)=>{
          if (resp){
              if (resp.data){
                  //alert('you have permission');
                  return true;
              }
          }
          //alert('do not permission');
          this.router.navigateByUrl('login/accessdenied');
          return false;
      }));
    }else{
      this.router.navigateByUrl('/login/authenticate');
      return false;
    }  

  }

  checkPermission(permission: string): Observable<any> {
    let url : string = AUTH_API;
    url = url + '/checkpermission';
   
    return this.http.post( url , {"name":permission},httpOptions);
  }

}