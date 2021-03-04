import { NgModule } from "@angular/core";
import { ExtraOptions,Routes, RouterModule} from '@angular/router';
import { LoginRoutes } from "./modules/login-module";
import { QuizRoutes } from "./modules/quiz-module";


export const routes: Routes = [
   {
    path: '',
    redirectTo: 'login/authenticate',
    pathMatch: 'full'
   },

    ...LoginRoutes,...QuizRoutes
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

} 