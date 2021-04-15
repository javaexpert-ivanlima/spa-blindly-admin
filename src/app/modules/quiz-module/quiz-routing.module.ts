import { Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/helpers/permission.guard';
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
        component: ListCategoryComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'list_category'}        

    },
    {
        //path: 'categories/audit/:id/:name',
        path: 'categories/audit',
        component: AuditCategoryComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'list_category'}
    },
    {
        path: 'questions',
        redirectTo: 'questions/list'
    },
    {
        path: 'questions/list',
        component: ListQuestionsComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'list_question'}
    },
    {
        path: 'questions/audit',
        component: AuditQuestionsComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'list_question'}
    },
    {
        path: 'questions/create',
        component: CreateQuestionComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'create_question'}
    },
    {
        path: 'questions/edit',
        component: EditQuestionComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'update_question'}

    }
    ,
    {
        path: 'questions/quiz',
        component: QuizOrderComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'order_quiz'}
    },
    {
        path: 'quiz/preview',
        component: QuizPreviewComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'preview_quiz'}
    }
]