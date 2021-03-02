import { Routes } from '@angular/router';
import { CreateCategoryComponent, ListCategoryComponent } from './categories';


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
        path: 'categories/create',
        component: CreateCategoryComponent
    }
]