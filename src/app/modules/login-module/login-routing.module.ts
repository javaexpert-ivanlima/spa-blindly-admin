import { Routes } from '@angular/router';
import { AccessDeniedComponent, ActivationComponent } from './component';
import { AuthenticateComponent } from './component';

export const LoginRoutes: Routes = [

    {
        path: 'login',
        redirectTo: 'login/authenticate'
    },
    {
        path: 'login/authenticate',
        component: AuthenticateComponent
    }
    ,
    {
        path: 'login/activation',
        component: ActivationComponent
    }
    ,
    {
        path: 'login/accessdenied',
        component: AccessDeniedComponent
    }
]