import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories/categories.component';
import { QuestionsComponent } from './questions/questions.component';
import { AnswersComponent } from './answers/answers.component';
import { QuizComponent } from './quiz/quiz.component';



@NgModule({
  declarations: [CategoriesComponent, QuestionsComponent, AnswersComponent, QuizComponent],
  imports: [
    CommonModule
  ]
})
export class QuizModule { }
