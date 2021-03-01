import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {  FormsModule , ReactiveFormsModule } from '@angular/forms' 
import { AppComponent } from './app.component';
import { AppRoutingModule} from './app.routing.module';
import { SpinnerShowService } from './shared/service';
import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerComponent } from '../app/shared/component/spinner/';
import { DatatableComponent } from './shared/component/datatable';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    DatatableComponent
  ],
  imports: [
    BrowserModule,
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
