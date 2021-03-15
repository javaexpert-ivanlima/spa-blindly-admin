import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCategoryComponent } from './component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginModule, TokenStorageService } from '../login-module';
import { SharedModule } from '../shared-module/shared.module';
import { AuditCategoryComponent } from './component';
import { ListQuestionsComponent } from './component/questions/list-questions/list-questions.component';





@NgModule({
  declarations: [ 
    ListCategoryComponent, AuditCategoryComponent, ListQuestionsComponent
  ],
  exports:[
    ListCategoryComponent, AuditCategoryComponent
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
