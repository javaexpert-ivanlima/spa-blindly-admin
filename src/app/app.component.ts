import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
//import * as $ from 'jquery';
import { AuthenticateService } from './modules/login-module';
import { SpinnerShowService } from './component/spinner';
import { TokenStorageService } from './component';
//declare var $ : any;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'spa-blindly-admin';
  photo: any = null;
  userName: string = null;
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
    this.userName = (JSON.parse(this.tokenStorageService.getUser()).name);
    this.photo = (JSON.parse(this.tokenStorageService.getUser()).photo);
  }

  logout(): void {
    this.spinnerService.showSpinner();
    this.tokenStorageService.signOut();
    window.location.reload();
  }
  

}
