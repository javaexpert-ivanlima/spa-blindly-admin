import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenStorageService } from '../modules/login-module';
import { UserAdminService } from '../modules/user-admin-module';



@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private userService: UserAdminService

    
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>|boolean {
    let permission:string = route.data.permission as string;
    return this.hasAccess(permission);

  }

  hasAccess(permission:string):Observable<boolean>|boolean{
    if (this.tokenStorage.getToken()) {
      return this.userService.checkPermission(permission).pipe(map( (resp)=>{
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

}