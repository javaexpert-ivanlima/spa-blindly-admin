import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/component';
import { SpinnerShowService } from 'src/app/component/spinner';


@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {
  permissions: string = null;
  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private spinnerService:SpinnerShowService,
    private activatedRoute: ActivatedRoute
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.permissions = params['permission'];
  });
  }

  ngOnInit(): void {
    this.spinnerService.hideSpinner();
    if (!this.tokenStorage.getToken()) {
      this.router.navigateByUrl('/login/authenticate');
    }  
    this.spinnerService.showMenu();
  }

}
