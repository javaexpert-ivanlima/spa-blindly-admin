import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticateComponent } from './component';
import { AuthenticateService} from './service';
import { TokenStorageService } from './service';
import { FormsModule , ReactiveFormsModule } from '@angular/forms' 
import { HttpClientModule } from '@angular/common/http';
import { ActivationComponent } from './component';
import { AccessDeniedComponent } from './component/access-denied/access-denied.component';


@NgModule({
  declarations: [AuthenticateComponent, ActivationComponent, AccessDeniedComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthenticateService,
    TokenStorageService
  ]
})
export class LoginModule { }
