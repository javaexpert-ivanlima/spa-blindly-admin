import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAdminUsersComponent } from './component';
import { ListAppUsersComponent } from './component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared.module';
import { LoginModule, TokenStorageService } from '../login-module';
import { HttpClientModule } from '@angular/common/http';
import { AdminUserAuditComponent } from './component/';



@NgModule({
  declarations: [
    ListAdminUsersComponent, 
    ListAppUsersComponent, 
    AdminUserAuditComponent
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
export class UserModule { }
