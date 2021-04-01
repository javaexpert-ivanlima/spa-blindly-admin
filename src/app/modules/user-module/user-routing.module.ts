import { Routes } from '@angular/router';
import {
            AdminUserAuditComponent,
            ListAdminUsersComponent
       } from './component';


export const UserRoutes: Routes = [

    {
        path: 'admin_users',
        redirectTo: 'admin_users/list'
    }
    ,
    {
        path: 'admin_users/list',
        component: ListAdminUsersComponent
    }
    ,
    {
        path: 'admin_users/audit',
        component: AdminUserAuditComponent
    }
]