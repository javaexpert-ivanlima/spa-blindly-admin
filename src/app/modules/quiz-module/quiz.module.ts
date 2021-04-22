import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCategoryComponent } from './component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginModule } from '../login-module';
import { TokenStorageService } from 'src/app/component/';
import { SharedModule } from '../shared-module/shared.module';
import { AuditCategoryComponent } from './component';
import { ListQuestionsComponent } from './component';
import { AuditQuestionsComponent } from './component';
import { CreateQuestionComponent } from './component';
import { EditQuestionComponent } from './component';
import { QuizOrderComponent } from './component';
import { QuizPreviewComponent } from './component/questions/quiz-preview/quiz-preview.component';



@NgModule({
  declarations: [ 
    ListCategoryComponent,
    AuditCategoryComponent,
    ListQuestionsComponent,
    AuditQuestionsComponent,
    CreateQuestionComponent,
    EditQuestionComponent,
    QuizOrderComponent,
    QuizPreviewComponent
  ],
  exports:[
    ListCategoryComponent,
    AuditCategoryComponent,
    ListQuestionsComponent,
    AuditQuestionsComponent,
    CreateQuestionComponent,
    EditQuestionComponent,
    QuizOrderComponent,
    QuizPreviewComponent
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
