import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {  FormsModule , ReactiveFormsModule } from '@angular/forms' 

import { AppComponent } from './app.component';
import { AppRoutingModule} from './app.routing.module';
import { LoginModule, SpinnerShowService } from './login';
import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerComponent } from '../app/login/shared/component/spinner/';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    LoginModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    SpinnerShowService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
