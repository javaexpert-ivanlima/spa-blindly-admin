import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
//import * as $ from 'jquery';
import { AuthenticateService } from './modules/login-module';
import { SpinnerShowService } from './component/spinner';
import { TokenStorageService } from './component';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
//declare var $ : any;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  
  private subscription: Subscription;

  title = 'spa-blindly-admin';
  photo: any = null;
  userName: string = null;
  login: string = null;
  currentLanguage = "pt";
  locale: any;

  constructor(
    private router: Router,
    private authService: AuthenticateService,
    private tokenStorageService:TokenStorageService,
    private spinnerService:SpinnerShowService
    ) {
    // ...
  }

  setLanguage(lang: string){
      this.tokenStorageService.saveLanguage(lang);
      window.location.reload();
  }

  loadPhotoAndNameUser(){
    this.userName = (JSON.parse(this.tokenStorageService.getUser())?.name);
    this.photo = (JSON.parse(this.tokenStorageService.getUser())?.photo);
    this.login = (JSON.parse(this.tokenStorageService.getUser())?.login);
    this.currentLanguage = this.tokenStorageService.getLanguage();
    this.locale = this.tokenStorageService.getLocale();
  }

  ngOnInit(){
    this.spinnerService.showSpinner();
    this.subscription = interval(1000)
         .subscribe(x => { this.loadPhotoAndNameUser(); });
  }

  logout(): void {
    this.spinnerService.showSpinner();
    this.tokenStorageService.signOut();
    window.location.reload();
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
 }

 toogleMenu(){
  $('#menumobilecontent').modal('toggle');
 }

}
