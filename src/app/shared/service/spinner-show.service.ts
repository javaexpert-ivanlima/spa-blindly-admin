import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as $ from 'jquery';

@Injectable()
export class SpinnerShowService {

  private dataObsevable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
  }
  
  hideSpinner():void{
    this.dataObsevable.next(false);
    $("#overlayLoading").hide();
  }

  showSpinner():void{
      this.dataObsevable.next(true);
      $("#overlayLoading").show();
  }
}