import { Routes } from '@angular/router';
import { ActivationComponent } from './component';
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
]