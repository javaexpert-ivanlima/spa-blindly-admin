import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {  FormsModule , ReactiveFormsModule } from '@angular/forms' 
import { AppComponent } from './app.component';
import { AppRoutingModule} from './app.routing.module';
import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerComponent, SpinnerShowService } from './spinner';
import { SharedModule } from './shared-module/shared.module';
import { RichtableComponent } from './shared-module';
import { QuizModule } from './quiz-module/quiz.module';
import { LoginModule } from './login-module';



@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    QuizModule,
    LoginModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    SpinnerShowService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
