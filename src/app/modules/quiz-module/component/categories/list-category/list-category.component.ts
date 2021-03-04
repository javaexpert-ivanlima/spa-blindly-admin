import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/modules/login-module';
import { SpinnerShowService } from 'src/app/component/spinner';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/modules/quiz-module/service';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {
  submitted = false;
  errorMessage = '';
  
  isLoggedIn = false;

  columns : string[] = ['id','nameCategory'];
  rows: any[] = [];
  pageable: any;

  constructor(
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private categoryService: CategoryService
    ) { }

  ngOnInit(): void {
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    this.carregaCategories();
  
  }

  carregaCategories() {
    this.spinnerService.showSpinner();
    this.categoryService.getAllCategories().subscribe(
      data => {
        this.spinnerService.hideSpinner();
        this.rows =   data.data.content;
        this.pageable = data.data.pageable;
        console.log("r -> " + data.data.content);
      },
      err => {
        if (err.error.errors){
          this.errorMessage = err.error.errors.message  + " => ";
          let array = err.error.errors.errors;
          for (let i = 0; i < array.length; i++) {
            this.errorMessage =  this.errorMessage + array[i] + "  "; 
          }
        }else{
          if ( err.message.includes("Http failure response for")){
            this.errorMessage = "Http service unavailable";
          }else{
            this.errorMessage = err.message;
          }
          
        }
        this.spinnerService.hideSpinner();
      }
    );
  }

}
