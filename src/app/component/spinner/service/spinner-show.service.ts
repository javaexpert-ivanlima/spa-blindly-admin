import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
//import * as $ from 'jquery';

@Injectable()
export class SpinnerShowService {

  private dataObsevable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private categoryObject: any = null;
  private questionObject: any = null;
  private adminUserObject: any = null;

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
  setAdminUserObject(obj:any){
    this.adminUserObject = obj;
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

  showWelcomeCover(){
    $("#main-content").css({backgroundImage : 'url(assets/imgs/background/welcome-cover.jpg)'});
    $("#main-content").addClass('mask');
    $("#main-content").addClass('bg-gradient-default');
    $("#main-content").addClass('opacity-8');
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
      $("#login-modal").hide();
    }else{
      $("#welcome-title").hide();
      $("#menuContent").hide();
      $("#login-modal").show();
    }
  }
}