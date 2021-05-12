import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/component/';
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
  selectedName: string;
  locale: any;
  sortObject: any = {"sortName":"id","sortDirection":"DESC","sortColumn":1,"itensPerPage":6};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private categoryService: CategoryService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    //this.selectedID = this.route.snapshot.params.id;
    //this.selectedName = this.route.snapshot.params.name;
    if (!this.spinnerService.getCategoryObject()){
        this.router.navigateByUrl('/categories/list');
    }
    this.selectedID = this.spinnerService.getCategoryObject().row.id;
    this.selectedName = this.spinnerService.getCategoryObject().row.nameCategory;

    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
      this.locale = this.tokenStorage.getLocale();
      this.title = this.locale.commons_audit;
      this.labels = this.locale.audit_labels;
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    this.carregaCategoriesAudit(this.currentPage,this.selectedID, this.sortObject);

  }

  backButton(){
    //this._location.back();
    this.router.navigateByUrl('/categories/list');
  }
  carregaCategoriesAudit(page: number,id:number,sort:any) {
    this.pageable = null;
    this.rows = null;
    this.title = this.locale.category_name + " " + this.selectedName + " - " + this.locale.commons_audit;
    this.spinnerService.showSpinner(); +
    this.categoryService.getAuditCategory(page,id,sort).subscribe(
      data => {
        this.spinnerService.hideSpinner();
        this.rows =   data.data.content;
        this.pageable = {"page": data.data.pageable,"last":data.data.last,"first":data.data.first,"totalPages":data.data.totalPages,"pageNumber":data.data.number};
      },
      err => {
        this.errorMessage =  this.spinnerService.handleError(err);
      }
    );
  }
  displayPage(page) {
    this.currentPage = page;
    this.carregaCategoriesAudit(page,this.selectedID,this.sortObject);
  }

  goWelcome(){
    this.router.navigateByUrl('/');
  }

  changeItensPerPage(itens){
    this.sortObject.itensPerPage = itens;
    this.carregaCategoriesAudit(this.currentPage,this.selectedID,this.sortObject);
  }

  changeSort(obj){
    this.sortObject = obj;
    this.carregaCategoriesAudit(this.currentPage,this.selectedID,this.sortObject);
  }
}
