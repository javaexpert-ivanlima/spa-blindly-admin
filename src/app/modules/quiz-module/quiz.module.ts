import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCategoryComponent } from './component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginModule, TokenStorageService } from '../login-module';
import { SharedModule } from '../shared-module/shared.module';
import { AuditCategoryComponent } from './component';
import { ListQuestionsComponent } from './component';
import { AuditQuestionsComponent } from './component';
import { CreateQuestionComponent } from './component';





@NgModule({
  declarations: [ 
    ListCategoryComponent, AuditCategoryComponent, ListQuestionsComponent, AuditQuestionsComponent, CreateQuestionComponent
  ],
  exports:[
    ListCategoryComponent, AuditCategoryComponent, ListQuestionsComponent, AuditQuestionsComponent, CreateQuestionComponent
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
