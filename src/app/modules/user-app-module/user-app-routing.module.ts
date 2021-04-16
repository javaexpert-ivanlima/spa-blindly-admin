import { Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/helpers/permission.guard';
import {
            AppUserAuditComponent,
    DashboardComponent,
    DetailUserComponent,
            ListAppUsersComponent
       } from './component';
import { DashboardResolver } from './component/dashboard/dashboard.resolver';


export const UserAppRoutes: Routes = [

    {
        path: 'app_users',
        redirectTo: 'app_users/list'
    }
    ,
    {
        path: 'app_users/list',
        component: ListAppUsersComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'list_appUser'}
    }
    ,
    {
        path: 'app_users/audit',
        component: AppUserAuditComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'list_appUser'}
    },
    {
        path: 'app_users/detail',
        component: DetailUserComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'detail_appUser'}        
    },
    {
        path: 'app_users/dashboard',
        component: DashboardComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'dashboard'},
        resolve: {dashInfo: DashboardResolver}        
    }
]