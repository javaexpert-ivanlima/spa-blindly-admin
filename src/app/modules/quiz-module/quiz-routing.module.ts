import { Routes } from '@angular/router';
import {  AuditCategoryComponent, AuditQuestionsComponent, ListCategoryComponent, ListQuestionsComponent } from './component';


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
        //path: 'categories/audit/:id/:name',
        path: 'questions/audit',
        component: AuditQuestionsComponent
    },
]