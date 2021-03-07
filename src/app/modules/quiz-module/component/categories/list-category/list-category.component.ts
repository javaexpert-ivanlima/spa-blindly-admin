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
  title : string = 'categories';
  columns : string[] = ['id','nameCategory','active','modifiedBy','lastUpdateDate'];
  labels : string[] = ['id','category','active','owner','update date'];
  rows: any[] = [];
  pageable: any;

  currentPage: number = 0;

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
    this.carregaCategories(this.currentPage);
  
  }

  carregaCategories(page: number) {
    this.spinnerService.showSpinner();
    this.categoryService.getAllCategories(page).subscribe(
      data => {
        this.spinnerService.hideSpinner();
        this.rows =   data.data.content;
        this.pageable = {"page": data.data.pageable,"last":data.data.last,"first":data.data.first,"totalPages":data.data.totalPages,"pageNumber":data.data.number};
      },
      err => {
        this.handleError(err);
      }
    );
  }
  displayPage(page) {
    this.currentPage = page;
    this.carregaCategories(page);
  }
  exclude(id){
    this.spinnerService.showSpinner();
    this.categoryService.inactivatedCategory(id).subscribe(
      data => {
        this.carregaCategories(this.currentPage);
        this.spinnerService.hideSpinner();
      },
      err => {
        this.handleError(err);
      }
    );
  }
  activated(id){
    this.spinnerService.showSpinner();
    this.categoryService.activatedCategory(id).subscribe(
      data => {
        this.carregaCategories(this.currentPage);
        this.spinnerService.hideSpinner();
      },
      err => {
        this.handleError(err);
      }
    );
    
  }

  handleError(err){
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
}
