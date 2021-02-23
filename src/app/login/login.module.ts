import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticateComponent } from './authenticate';
import { AuthenticateService} from './shared/service';
import { TokenStorageService } from './shared/service';
import { FormGroup, FormsModule , ReactiveFormsModule } from '@angular/forms' 
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [AuthenticateComponent],
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
