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
  
  hideSpinner():void{
    this.dataObsevable.next(false);
    $("#overlayLoading").hide();
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
  showSpinner():void{
    $("#body").removeClass('mask');
    $("#body").removeClass('bg-gradient-default');
    $("#body").removeClass('opacity-8');
      this.dataObsevable.next(true);
      $("#overlayLoading").show();
  }

  hideMainModal(){
    $("#dialogConfirm").modal('hide');
    $("#modal-backdrop").modal('hide');
  }  

  showLoginElements(show: boolean): void{
    if (show){
      //$("#mainContent").css({backgroundImage : 'none'});
      $("#mainContent").css({backgroundImage : 'url(assets/imgs/background/pen-purple.png)'});
      $("#body").addClass('mask');
      $("#body").addClass('bg-gradient-default');
      $("#body").addClass('opacity-8');
      $("#menuContent").show();    
      $("#welcome-title").show();
      $("#timeExpired").show();
      $("#login-modal").hide();
    }else{
      $("#welcome-title").hide();
      $("#menuContent").hide();
      $("#timeExpired").hide();
      $("#login-modal").show();
    }
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
    let value:any = $(".progress").attr('data-value');
    let left = $(".progress").find('.progress-left .progress-bar');
    let right = $(".progress").find('.progress-right .progress-bar');
  
    if (value > 0) {
      if (value > 50) {
        right.css('transform', 'rotate(' + this.percentageToDegrees(value) + 'deg)')
      } else {
        right.css('transform', 'rotate(180deg)')
        left.css('transform', 'rotate(' + this.percentageToDegrees(value - 50) + 'deg)')
      }
    }
   }
   percentageToDegrees(percentage) {
  
    return percentage / 100 * 360
  
  }
}