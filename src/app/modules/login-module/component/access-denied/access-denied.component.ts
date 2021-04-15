import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from '../../service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private spinnerService:SpinnerShowService
  ) { }

  ngOnInit(): void {
    this.spinnerService.hideSpinner();
    this.spinnerService.showAccessDenied();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.spinnerService.hideActivation();
      this.router.navigateByUrl('/login/authenticate');
    }  
  }

}
