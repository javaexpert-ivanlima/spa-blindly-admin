import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/component/';
import { UserAppService } from '../../service';

@Component({
  selector: 'app-app-user-audit',
  templateUrl: './app-user-audit.component.html',
  styleUrls: ['./app-user-audit.component.css']
})
export class AppUserAuditComponent implements OnInit {

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
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private userService: UserAppService
  ) { }

  ngOnInit(): void {
    if (!this.spinnerService.getAppUserObject()){
        this.router.navigateByUrl('app_users/list');
    }
    this.selectedID = this.spinnerService.getAppUserObject()?.row?.id;
    this.selectedName = this.spinnerService.getAppUserObject().row.name;

    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    this.carregaAdminUserAudit(this.currentPage,this.selectedID);

  }

  backButton(){
    this.router.navigateByUrl('app_users/list');
  }
  carregaAdminUserAudit(page: number,id:number) {
    this.pageable = null;
    this.rows = null;
    this.title = "audit app user - " + this.selectedName;
    this.spinnerService.showSpinner();
    this.userService.getAuditAppUser(page,id).subscribe(
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
    this.carregaAdminUserAudit(page,this.selectedID);
  }


}
