import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticateComponent } from './authenticate';
import { AuthenticateService} from './shared/service';
import { FormGroup, FormsModule , ReactiveFormsModule } from '@angular/forms' 


@NgModule({
  declarations: [AuthenticateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthenticateService
  ]
})
export class LoginModule { }
