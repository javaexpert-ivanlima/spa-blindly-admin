import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardService } from '../../service/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolver implements Resolve<Observable<string>> {
        constructor(
            private router: Router,
            private service: DashboardService
        ) {}
        resolve(): Observable<string> {
            return this.service.getDashboardInfo().pipe(catchError(() => {
                this.router.navigate(['/']);
                return EMPTY;
              }));
        }
}