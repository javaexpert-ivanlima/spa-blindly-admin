import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticateComponent } from './component';
import { AuthenticateService} from './service';
import { FormsModule , ReactiveFormsModule } from '@angular/forms' 
import { HttpClientModule } from '@angular/common/http';
import { ActivationComponent } from './component';
import { AccessDeniedComponent } from './component';
import { ForgotPasswordComponent } from './component';
import { SharedModule } from '../shared-module/shared.module';
import { WelcomeComponent } from './component/';


@NgModule({
  declarations: [AuthenticateComponent, ActivationComponent, AccessDeniedComponent, ForgotPasswordComponent, WelcomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    AuthenticateService
  ]
})
export class LoginModule { }
