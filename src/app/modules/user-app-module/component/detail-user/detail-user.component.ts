import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/modules/login-module';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.css']
})
export class DetailUserComponent implements OnInit {
  appUser: any;
  buttonSelected: string = "Personal Data";
  firstButton: string = "Address";
  secondButton: string = "Photos";
  thridButton: string = "Preferences";

  constructor(
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService
    ) {}

  ngOnInit(): void {
    if (!this.spinnerService.getAppUserObject()){
      this.router.navigateByUrl('/app_users/list');
    }
    this.appUser = this.spinnerService.getAppUserObject()?.row;
    //verificacao de sessao expirada
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
  }

  getAge(){
    if (!this.appUser?.personalData?.birthDate){
          return 0;
    }
    var timeDiff = Math.abs(Date.now() - new Date(this.appUser?.personalData?.birthDate).getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    
  }

  getSigno(){
      return "Gemeos";
  }

  showData(kind:string,position:number){
    let oldButtonSelected = this.buttonSelected;
    let oldButtonLabel: string;
    let currentButtonLabel: string;
    if (position == 1){
      oldButtonLabel = this.firstButton;
      this.firstButton = oldButtonSelected;
    } else if (position == 2){
      oldButtonLabel = this.secondButton;
      this.secondButton = oldButtonSelected;
    } else if (position == 3){
      oldButtonLabel = this.thridButton;  
      this.thridButton = oldButtonSelected;
    }
    this.buttonSelected = oldButtonLabel;
    
    if (kind == 'Personal Data'){
      this.spinnerService.showPersonalData();
    } else if (kind == 'Address'){
        this.spinnerService.showAddressData();
    } else if (kind == 'Photos'){
      this.spinnerService.showPhotoData();
    }
  }

}
