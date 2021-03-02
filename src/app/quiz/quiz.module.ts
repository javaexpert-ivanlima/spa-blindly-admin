import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizComponent } from './quiz/quiz.component';
import { ListCategoryComponent } from './categories/';
import { RichtableComponent } from './shared';
import { CreateCategoryComponent } from './categories/create-category/create-category.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenStorageService } from '../login';





@NgModule({
  declarations: [ 
    QuizComponent, 
    ListCategoryComponent,
    RichtableComponent,
    CreateCategoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    TokenStorageService
  ]
})
export class QuizModule { }
