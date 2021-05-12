import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SpinnerShowService } from 'src/app/component/';
import { TokenStorageService } from 'src/app/component/';
import { UserAdminService } from '../../service';

@Component({
  selector: 'app-admin-user-audit',
  templateUrl: './admin-user-audit.component.html',
  styleUrls: ['./admin-user-audit.component.css']
})
export class AdminUserAuditComponent implements OnInit {

  private state$: Observable<object>;
  isLoggedIn = false;
  title : string = 'audit questions';
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
    private userService: UserAdminService
  ) { }

  ngOnInit(): void {
    if (!this.spinnerService.getAdminUserObject()){
        this.router.navigateByUrl('admin_users/list');
    }
    this.selectedID = this.spinnerService.getAdminUserObject()?.row?.id;
    this.selectedName = this.spinnerService.getAdminUserObject().row.name;

    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
      this.locale = this.tokenStorage.getLocale();
      this.labels = this.locale.audit_labels;
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    this.carregaAdminUserAudit(this.currentPage,this.selectedID,this.sortObject);

  }

  backButton(){
    this.router.navigateByUrl('admin_users/list');
  }
  carregaAdminUserAudit(page: number,id:number,sort:any) {
    this.pageable = null;
    this.rows = null;
    this.title = this.locale.adminuser_audit + " - " + this.selectedName;
    this.spinnerService.showSpinner();
    this.userService.getAuditAdminUser(page,id,sort).subscribe(
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
    this.carregaAdminUserAudit(page,this.selectedID,this.sortObject);
  }
  goWelcome(){
    this.router.navigateByUrl('/');
  }

  changeItensPerPage(itens){
    this.sortObject.itensPerPage = itens;
    this.carregaAdminUserAudit(this.currentPage,this.selectedID,this.sortObject);
  }

  changeSort(obj){
    this.sortObject = obj;
    this.carregaAdminUserAudit(this.currentPage,this.selectedID,this.sortObject);
  }

}
