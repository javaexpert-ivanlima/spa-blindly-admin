import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAppUsersComponent } from './component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared.module';
import { LoginModule } from '../login-module';
import { HttpClientModule } from '@angular/common/http';
import { AppUserAuditComponent } from './component';
import { DetailUserComponent } from './component/detail-user/detail-user.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { GoogleChartsModule } from 'angular-google-charts';



@NgModule({
  declarations: [
    ListAppUsersComponent, 
    AppUserAuditComponent, DetailUserComponent, DashboardComponent
  ],
  imports: [
    GoogleChartsModule,
    CommonModule,
    FormsModule,
    SharedModule,
    LoginModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class UserAppModule { }
