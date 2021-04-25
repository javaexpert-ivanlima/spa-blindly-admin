import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/component/';
import { UserAppService } from '../../service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  data: any;

  myData = [
  ];

  chartColumns = ['Status', 'Quantity'];
  myTitle="Users chart by state";
  myChart="PieChart";

  myOptions = {'title':'','legend':'none','width':'300','height':'300'};
  locale: any;


  constructor(
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.spinnerService.showSpinner();
    this.data = this.route.snapshot.data.dashInfo.data[0];
    this.myData.push(['Inactive',this.data.inactive]);
    this.myData.push(['Blocked',this.data.blocked]);
    this.myData.push(['Pending',this.data.pending]);
    this.myData.push(['Completed',this.data.completed]);
    this.myData.push(['TodayRegister',this.data.today_Registers]);
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
      this.locale = this.tokenStorage.getLocale();
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
  }

  goDetail(filter:string){

      this.spinnerService.setAppUserObject({"row":null,"filter":{"page":0,"searchFor":filter,"searchName":null,"searchLogin":null,"userAppSelected":null}});
      this.router.navigateByUrl('app_users/list');
  }

}
