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
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  imports: [
    DragDropModule,
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
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    { provide:HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    SpinnerShowService,PermissionGuard,TokenStorageService,TitleCasePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
