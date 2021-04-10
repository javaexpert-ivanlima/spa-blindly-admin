import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import * as moment from 'moment';
import { TokenStorageService } from 'src/app/modules/login-module';
import { Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {

   private subscription: Subscription;

   public dDay : number;
   milliSecondsInASecond = 1000;
   hoursInADay = 24;
   minutesInAnHour = 60;
   SecondsInAMinute  = 60;
   percentualTimer=100;
   timeDifference;
   secondsToDday;
   minutesToDday;

   secondsShow;
   minutesShow;

   constructor(
      private tokenStorage: TokenStorageService,
      private spinnerService:SpinnerShowService,
      private router: Router,
    ){
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }




    private getTimeDifference () {
      if (!this.dDay){
        this.dDay = this.tokenStorage.getExpireDate();
      }
      if (this.dDay){
          let currentDate: number = Date.now()/1000;
          let expiredDate: number = this.dDay;
          this.timeDifference =  moment.unix(expiredDate).diff(moment.unix(currentDate));;
          this.allocateTimeUnits(this.timeDifference);
          this.percentualTimer = this.getPercentual();
          this.spinnerService.atualizaGrafico();
          if (this.minutesToDday <= 0 && this.secondsToDday <= 0){
              this.tokenStorage.signOut();
              window.location.reload();
          }
        }
    }
    
    getPercentual(){
      let minInSeconds:number = (this.minutesToDday*60)+this.secondsToDday;
      let percentual:number = (minInSeconds*100)/1200;
      return percentual;
    }

  private allocateTimeUnits (timeDifference) {
        this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
        if (this.secondsToDday<10){
            this.secondsShow = '0'+this.secondsToDday;
        } else{
          this.secondsShow = this.secondsToDday;
        }
        this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
        if (this.minutesToDday<10){
          this.minutesShow = '0'+this.minutesToDday;
      } else{
        this.minutesShow = this.minutesToDday;
      }
  }


  ngOnInit() {
    this.subscription = interval(this.milliSecondsInASecond)
         .subscribe(x => { this.getTimeDifference(); });
  }

 ngOnDestroy() {
    this.subscription.unsubscribe();
 }

 
}
