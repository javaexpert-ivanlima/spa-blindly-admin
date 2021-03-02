import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/login-module';
import { SpinnerShowService } from 'src/app/spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {
  submitted = false;
  errorMessage = '';
  
  isLoggedIn = false;

  constructor(
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService
    ) { }

  ngOnInit(): void {
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
  }



}
