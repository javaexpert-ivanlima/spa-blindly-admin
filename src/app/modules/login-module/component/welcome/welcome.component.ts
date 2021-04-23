import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerShowService, TokenStorageService } from 'src/app/component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  userName= "";
  locale: any;
  constructor(
    private spinner:SpinnerShowService,
    private router: Router,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    if (!this.tokenStorage.getToken()) {
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.locale = this.tokenStorage.getLocale();
    this.userName = this.tokenStorage.getSub();
    this.spinner.showMenu();
    this.spinner.hideSpinner();
  }

}
