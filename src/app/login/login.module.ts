import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticateComponent } from './authenticate';
import { AuthenticateService} from './shared/service';


@NgModule({
  declarations: [AuthenticateComponent],
  imports: [
    CommonModule
  ],
  providers: [
    AuthenticateService
  ]
})
export class LoginModule { }
