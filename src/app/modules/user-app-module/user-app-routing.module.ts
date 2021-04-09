import { Routes } from '@angular/router';
import {
            AppUserAuditComponent,
    DashboardComponent,
    DetailUserComponent,
            ListAppUsersComponent
       } from './component';


export const UserAppRoutes: Routes = [

    {
        path: 'app_users',
        redirectTo: 'app_users/list'
    }
    ,
    {
        path: 'app_users/list',
        component: ListAppUsersComponent
    }
    ,
    {
        path: 'app_users/audit',
        component: AppUserAuditComponent
    },
    {
        path: 'app_users/detail',
        component: DetailUserComponent
    },
    {
        path: 'app_users/dashboard',
        component: DashboardComponent
    }
]