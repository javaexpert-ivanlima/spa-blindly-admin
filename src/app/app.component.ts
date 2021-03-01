import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import * as $ from 'jquery';
import { SpinnerShowService } from './shared/service';
import { AuthenticateService, TokenStorageService } from './login';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'spa-blindly-admin';
  constructor(
    private router: Router,
    private authService: AuthenticateService,
    private tokenStorageService:TokenStorageService,
    private spinnerService:SpinnerShowService
    ) {
    // ...
  }

  ngOnInit(){
    this.spinnerService.showSpinner();
  }

  logout(): void {
    this.spinnerService.showSpinner();
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
