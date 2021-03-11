import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/modules/login-module';
import { CategoryService } from '../../../service';
import {Location} from '@angular/common';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-audit-category',
  templateUrl: './audit-category.component.html',
  styleUrls: ['./audit-category.component.css']
})
export class AuditCategoryComponent implements OnInit {
  private state$: Observable<object>;
  isLoggedIn = false;
  title : string = 'audit categories';
  labels : string[] = ['PK','update date','changed by','column','old value','new value'];
  columns : string[] = ['tablePK','changedDate','changedBy','columnName','oldValue','newValue'];
  rows: any[] = [];
  pageable: any = null;
  currentPage: number = 0;
  errorMessage = '';
  selectedID: number =0;
  hide: string = "true";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private categoryService: CategoryService,
    private _location: Location
  ) { }

  ngOnInit(): void {

    this.selectedID = this.route.snapshot.params.id;

    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    this.carregaCategoriesAudit(this.currentPage,this.selectedID);

  }

  backButton(){
    this._location.back();
  }
  carregaCategoriesAudit(page: number,id:number) {
    this.pageable = null;
    this.rows = null;
    this.hide = "true";
    this.spinnerService.showSpinner();
    this.categoryService.getAuditCategory(page,id).subscribe(
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
    this.carregaCategoriesAudit(page,this.selectedID);
  }

  handleError(err){

    if (err.error.errors){
      this.errorMessage = err.error.errors.message ;
      if (err.error.errors.errors){
        this.errorMessage = this.errorMessage  + " => ";
        let array = err.error.errors.errors;
        for (let i = 0; i < array.length; i++) {
          this.errorMessage =  this.errorMessage + array[i] + "  "; 
        }
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
