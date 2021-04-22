import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {  FormsModule , ReactiveFormsModule } from '@angular/forms' 
import { AppComponent } from './app.component';
import { AppRoutingModule} from './app.routing.module';
import { RouterModule} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerComponent, SpinnerShowService } from './component/spinner';
import { SharedModule } from './modules/shared-module/shared.module';
import { QuizModule } from './modules/quiz-module/quiz.module';
import { LoginModule } from './modules/login-module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { UserAdminModule } from './modules/user-admin-module/user-admin.module';
import { UserAppModule } from './modules/user-app-module/user-app.module';
import { PermissionGuard } from './helpers/permission.guard';
import { TokenStorageService } from './component/';
import { TitleCasePipe } from '@angular/common';


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
    UserAdminModule,
    UserAppModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    { provide:HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    SpinnerShowService,PermissionGuard,TokenStorageService,TitleCasePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
