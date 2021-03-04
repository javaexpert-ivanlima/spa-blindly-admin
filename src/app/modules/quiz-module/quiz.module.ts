import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCategoryComponent } from './component';
import { CreateCategoryComponent } from './component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginModule, TokenStorageService } from '../login-module';
import { SharedModule } from '../shared-module/shared.module';





@NgModule({
  declarations: [ 
    ListCategoryComponent,
    CreateCategoryComponent
  ],
  exports:[
    ListCategoryComponent,
    CreateCategoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    LoginModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    TokenStorageService
  ]
})
export class QuizModule { }
