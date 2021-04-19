import { Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/helpers/permission.guard';

import {
            AdminUserAuditComponent,
            ListAdminUsersComponent
       } from './component';
import { ProfileComponent } from './component/profile/profile.component';


export const UserAdminRoutes: Routes = [

    {
        path: 'admin_users',
        redirectTo: 'admin_users/list'
    }
    ,
    {
        path: 'admin_users/list',
        component: ListAdminUsersComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'list_adminUser'}
    }
    ,
    {
        path: 'admin_users/audit',
        component: AdminUserAuditComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'list_adminUser'}
    }
    ,
    {
        path: 'admin_users/profile',
        component: ProfileComponent
    }
]