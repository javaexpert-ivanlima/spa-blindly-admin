import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
//import * as $ from 'jquery';

@Injectable()
export class SpinnerShowService {

  private dataObsevable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private categoryObject: any = null;
  private questionObject: any = null;
  private adminUserObject: any = null;
  private appUserObject: any = null;

  constructor() {
  }
  
  getCategoryObject(): any{
    return this.categoryObject;
  }
  setCategoryObject(obj:any){
    this.categoryObject = obj;
  }
  getQuestionObject(): any{
    return this.questionObject;
  }
  setQuestionObject(obj:any){
    this.questionObject = obj;
  }

  getAdminUserObject(): any{
    return this.adminUserObject;
  }
  getAppUserObject(): any{
    return this.appUserObject;
  }

  setAdminUserObject(obj:any){
    this.adminUserObject = obj;
  }
  setAppUserObject(obj:any){
    this.appUserObject = obj;
  }

  hideMenu(){
    $("#mainContent").css({backgroundImage : 'url(assets/imgs/background/designers-purple.png)'});
    $("#menuContent").hide();
    $("#timeExpired").hide();
  }

  showMenu(){
    $("#mainContent").css({backgroundImage : 'none'});
    $("#menuContent").show();
    $("#timeExpired").show();
  }

  showSpinner():void{
    this.dataObsevable.next(true);
    $("#overlayLoading").show();
  }

  hideSpinner():void{
    this.dataObsevable.next(false);
    $("#overlayLoading").hide();
  }


  hideMainModal(){
    $("#dialogConfirm").modal('hide');
    $("#modal-backdrop").modal('hide');
  }  

  showAddressData(){
      $("#user_address").show();
      $("#user_personalData").hide();
      $("#user_photo").hide();
      $("#user_preferences").hide();
  }

  showPersonalData(){
    $("#user_personalData").show();
    $("#user_address").hide();
    $("#user_photo").hide();
    $("#user_preferences").hide();
  }
  
  showPhotoData(){
    $("#user_photo").show();
    $("#user_address").hide();
    $("#user_personalData").hide();
    $("#user_preferences").hide();
  }

  showPreferencesData(){
    $("#user_preferences").show();
    $("#user_address").hide();
    $("#user_personalData").hide();
    $("#user_photo").hide();
  }
  atualizaGrafico(){
    let percentage:any = $(".progress").attr('data-value');
    let left = $(".progress").find('.progress-left .progress-bar');
    let right = $(".progress").find('.progress-right .progress-bar');
    let angulo:number = this.percentageToDegrees(percentage);
    if (percentage > 0) {
      if (percentage <= 50) {
        left.css('transform', 'rotate(0deg)')
        right.css('transform', 'rotate(' + angulo + 'deg)');
      } else {
        right.css('transform', 'rotate(180deg)');
        left.css('transform', 'rotate(' + (angulo-180) + 'deg)');
      }
    }
   }

  percentageToDegrees(percentage) {
    let degrees = percentage / 100 * 360;
    return degrees;  
  }

  handleError(err):string{
    let errorDesc = '';
    if (err.error && err.error.errors){
      errorDesc = err.error.errors.message ;
      if (err.error.errors.errors){
        errorDesc = errorDesc  + " => ";
        let array = err.error.errors.errors;
        for (let i = 0; i < array.length; i++) {
          errorDesc =  errorDesc + array[i] + "  "; 
        }
      }
    }else{
      if ( err.message.includes("Http failure response for")){
        errorDesc = "Http service unavailable";
      }else{
        errorDesc = err.message;
      }
      this.hideSpinner();
    }
    return errorDesc;
  }

}