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
  currentData: string = "Personal Data";
  currentButton: string = "Address";
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
    var timeDiff = Math.abs(Date.now() - new Date(this.appUser?.personalData?.birthDate).getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    
  }

  getSigno(){
      return "Gemeos";
  }

  showData(kind:string){
    if (kind == 'Personal'){
      this.currentButton = "Address";
      this.currentData = "Personal";
      this.spinnerService.showPersonalData();
    } else if (kind == 'Address'){
        this.currentButton = "Personal";
        this.currentData = "Address";
        this.spinnerService.showAddressData();
    }
  }

}
