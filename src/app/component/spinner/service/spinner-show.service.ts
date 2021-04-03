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
    $("#welcome-title").hide();
      this.dataObsevable.next(true);
      $("#overlayLoading").show();
  }

  hideMainModal(){
    $("#dialogConfirm").modal('hide');
    $("#modal-backdrop").modal('hide');
  }  
  showLoginElements(show: boolean): void{
    if (show){
      //$("#mainContent").css({backgroundImage : 'url(assets/imgs/background/pen-purple.png)'});
      $("#mainContent").css({backgroundImage : 'none'});
      $("#body").addClass('welcome-cover');
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