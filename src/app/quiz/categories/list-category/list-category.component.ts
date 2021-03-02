import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/login';
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
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.spinnerService.showLoginElements(true);

    }else{
      this.isLoggedIn = false;
      this.spinnerService.showLoginElements(false);
    }    
    this.spinnerService.hideSpinner();
  }

  btnClick= function () {
    this.router.navigateByUrl('/categories/create');
};

}
