import { NgModule } from "@angular/core";
import { ExtraOptions,Routes, RouterModule} from '@angular/router';
import { LoginRoutes } from "./modules/login-module";
import { QuizRoutes } from "./modules/quiz-module";
import { UserRoutes } from "./modules/user-module/user-routing.module";


export const routes: Routes = [
   {
    path: '',
    redirectTo: 'login/authenticate',
    pathMatch: 'full'
   },

    ...LoginRoutes,...QuizRoutes,...UserRoutes
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

} 