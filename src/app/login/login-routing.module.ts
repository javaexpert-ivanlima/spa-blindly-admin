import { Routes } from '@angular/router';
import { AuthenticateComponent } from './component/authenticate';

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