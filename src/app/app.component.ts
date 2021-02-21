import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import * as $ from 'jquery';
import { AuthenticateService } from './login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'spa-blindly-admin';
  public hasSystemAccess: boolean = false;
  constructor(private router: Router,private authService: AuthenticateService) {
    // ...
  }
  remover($event: any){
    $event.preventDefault();
    $("#wrapper").toggleClass("toggled");
  }

  ngOnInit(){
    
  }
}
