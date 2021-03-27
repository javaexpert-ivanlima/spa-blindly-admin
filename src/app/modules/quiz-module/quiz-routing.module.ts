import { Routes } from '@angular/router';
import {
            AuditCategoryComponent,
            AuditQuestionsComponent,
            CreateQuestionComponent,
            EditQuestionComponent,
            ListCategoryComponent,
            ListQuestionsComponent,
            QuizOrderComponent,
            QuizPreviewComponent 
       } from './component';


export const QuizRoutes: Routes = [

    {
        path: 'categories',
        redirectTo: 'categories/list'
    },
    {
        path: 'categories/list',
        component: ListCategoryComponent
    },
    {
        //path: 'categories/audit/:id/:name',
        path: 'categories/audit',
        component: AuditCategoryComponent
    },
    {
        path: 'questions',
        redirectTo: 'questions/list'
    },
    {
        path: 'questions/list',
        component: ListQuestionsComponent
    },
    {
        path: 'questions/audit',
        component: AuditQuestionsComponent
    },
    {
        path: 'questions/create',
        component: CreateQuestionComponent
    },
    {
        path: 'questions/edit',
        component: EditQuestionComponent
    }
    ,
    {
        path: 'questions/quiz',
        component: QuizOrderComponent
    },
    {
        path: 'quiz/preview',
        component: QuizPreviewComponent
    }
]