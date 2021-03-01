import { NgModule } from "@angular/core";
import { ExtraOptions,Routes, RouterModule} from '@angular/router';
import { CategoryRoutes } from "./category";
import { LoginRoutes} from './login';

export const routes: Routes = [
   {
    path: '',
    redirectTo: 'login/authenticate',
    pathMatch: 'full'
   },

    ...LoginRoutes,
    ...CategoryRoutes
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

} 