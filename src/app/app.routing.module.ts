import { NgModule } from "@angular/core";
import { ExtraOptions,Routes, RouterModule} from '@angular/router';
import { LoginRoutes} from './login';

export const routes: Routes = [
   

    ...LoginRoutes
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

} 