import { Routes } from '@angular/router';
import {  AuditCategoryComponent, ListCategoryComponent } from './component';


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
    }
]