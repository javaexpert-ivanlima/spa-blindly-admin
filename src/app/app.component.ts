import { Component } from '@angular/core';
import { Router} from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spa-blindly-admin';

  constructor(private router: Router) {
    // ...
  }
  remover($event: any){
    $event.preventDefault();
    $("#wrapper").toggleClass("toggled");
  }
}
