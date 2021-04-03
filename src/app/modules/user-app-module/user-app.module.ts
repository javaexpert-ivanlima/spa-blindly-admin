import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAppUsersComponent } from './component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared.module';
import { LoginModule, TokenStorageService } from '../login-module';
import { HttpClientModule } from '@angular/common/http';
import { AppUserAuditComponent } from './component';
import { DetailUserComponent } from './component/detail-user/detail-user.component';



@NgModule({
  declarations: [
    ListAppUsersComponent, 
    AppUserAuditComponent, DetailUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    LoginModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    TokenStorageService
  ]
})
export class UserAppModule { }
