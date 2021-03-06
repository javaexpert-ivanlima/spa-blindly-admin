import { NgModule } from "@angular/core";
import { ExtraOptions,Routes, RouterModule} from '@angular/router';
import { LoginRoutes } from "./modules/login-module";
import { QuizRoutes } from "./modules/quiz-module";
import { UserAdminRoutes } from "./modules/user-admin-module/";
import { UserAppRoutes } from "./modules/user-app-module/";


export const routes: Routes = [
    
   {
    path: '',
    redirectTo: 'login/authenticate',
    pathMatch: 'full'
   },
    ...LoginRoutes,...QuizRoutes,...UserAdminRoutes,...UserAppRoutes
];

@NgModule({
    //imports: [RouterModule.forRoot(routes,{ enableTracing: true })],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

} 