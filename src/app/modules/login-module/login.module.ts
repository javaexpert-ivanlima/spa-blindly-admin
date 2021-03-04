import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticateComponent } from './component/authenticate';
import { AuthenticateService} from './service';
import { TokenStorageService } from './service';
import { FormsModule , ReactiveFormsModule } from '@angular/forms' 
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
