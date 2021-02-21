import { Routes } from '@angular/router';
import { AuthenticateComponent } from './authenticate';

export const LoginRoutes: Routes = [

    {
        path: 'login',
        redirectTo: 'login/authenticate'
    },
    {
        path: 'login/authenticate',
        component: AuthenticateComponent
    }
]