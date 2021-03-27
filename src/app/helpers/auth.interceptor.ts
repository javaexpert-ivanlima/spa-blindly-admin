import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../modules/login-module';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SpinnerShowService } from '../component/spinner';

 
const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router,private token: TokenStorageService,private service: SpinnerShowService) { }

  private handleAuthError(err: HttpErrorResponse) {
    if (err.status === 401 || err.status === 403) {
        this.router.navigateByUrl('/login/authenticate');
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = request;
    const token = this.token.getToken();
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
  }

  request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
    if (token != null) {
      authReq = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }
    return next.handle(authReq).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            this.service.hideSpinner();
            this.service.hideMainModal();
            this.router.navigateByUrl('/login/authenticate');
          }else{
            this.service.hideSpinner();
            this.service.hideMainModal();
          }
        
        return throwError(error);
      })
    )
    }    
  
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];