import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/modules/login-module';
import { UserAppService } from '../../service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  myData = [
    ['RJ', 8136000],
    ['MG', 8538000],
    ['BA', 2244000],
    ['TO', 3470000],
    ['SP', 19500000]
  ];

  chartColumns = ['City', 'Inhabitants'];
  myTitle="Users chart by state";
  myChart="PieChart";

  myOptions = {'title':'','legend':'bottom','width':'300','height':'300'};



  constructor(
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private userService: UserAppService
  ) { }

  ngOnInit(): void {
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
  }

}
