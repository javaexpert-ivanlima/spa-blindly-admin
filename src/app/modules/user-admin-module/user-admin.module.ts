import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAdminUsersComponent } from './component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared.module';
import { LoginModule } from '../login-module';
import { TokenStorageService } from 'src/app/component/';
import { HttpClientModule } from '@angular/common/http';
import { AdminUserAuditComponent } from './component';
import { ProfileComponent } from './component/profile/profile.component';



@NgModule({
  declarations: [
    ListAdminUsersComponent, 
    AdminUserAuditComponent, ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    LoginModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class UserAdminModule { }
