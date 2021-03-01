import { Routes } from '@angular/router';
import { ListCategoryComponent } from './component/list-category';

export const CategoryRoutes: Routes = [

    {
        path: 'categories',
        redirectTo: 'categories/list'
    },
    {
        path: 'categories/list',
        component: ListCategoryComponent
    }
]