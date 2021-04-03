import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/modules/login-module';
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
    if (!this.spinnerService.getAdminUserObject()){
        this.router.navigateByUrl('admin_users/list');
    }
    this.selectedID = this.spinnerService.getAdminUserObject()?.row?.id;
    this.selectedName = this.spinnerService.getAdminUserObject().row.name;

    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    this.carregaAdminUserAudit(this.currentPage,this.selectedID);

  }

  backButton(){
    this.router.navigateByUrl('admin_users/list');
  }
  carregaAdminUserAudit(page: number,id:number) {
    this.pageable = null;
    this.rows = null;
    this.title = "audit admin user - " + this.selectedName;
    this.spinnerService.showSpinner();
    this.userService.getAuditAdminUser(page,id).subscribe(
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
    this.carregaAdminUserAudit(page,this.selectedID);
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
