import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/component/';
import { UserAppService } from '../../service';
import { PermissionGuard } from 'src/app/helpers/permission.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-app-users',
  templateUrl: './list-app-users.component.html',
  styleUrls: ['./list-app-users.component.css']
})
export class ListAppUsersComponent implements OnInit {
  title : string = 'app users';
  modalId = "dialogConfirm";
  errorMessage = '';
  rows: any[] = [];

  //modal fields
  fgColorTitle:string;
  lablelButton:string;
  hideBtn:string;
  bgColorTitle:string; 
  titleModal:string;
  textParagraph1:string;
  textParagraph2:string;
  content:string;
  operationType: string = null;
  showForm: boolean = false;

  appUserFilterForm: any;
  currentPage: number = 0;
  selectedID: any = null;
  stateCollapse: boolean = true;
  pageable: any;
  submitted = false;
  submittedRegister = false;
  confirmButton: boolean = false;  
  
  //filter files
  searchFor: string = "active";
  searchName: string = null;
  searchLogin: number = null;
  appUserSelected: string = '';
  locale: any;
  hideAction: string = 'NO';
  tableLabelsDirections: string[]  = ['ASC','NONE','NONE','NONE','NONE'];
  sortName: string = "name";
  sort: any;
  itensPerPage: number = 6;
  sortDirection: string = "ASC";
  sortPosition: number = 0;
  sortExclusion: number;
  sortObject: any = {"sortName":"name","sortDirection":"ASC","sortColumn":0,"itensPerPage":6};



  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private guardian: PermissionGuard,
    private userService: UserAppService
    ) { 
      this.appUserFilterForm = this.formBuilder.group({
        filterType: [ 'active', [Validators.required]],
        login: [null, [Validators.email]],
        name: [null, [Validators.minLength(4)]]
      });
    }

  ngOnInit(): void {
    this.hideBtn = "NO";
    //verificacao de sessao expirada
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
      this.locale = this.tokenStorage.getLocale();
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    this.setupFilters();
    //preenche lista
    this.carregaAppUser(this.currentPage,this.searchFor,this.searchName,this.searchName,this.sortObject);
  }
  goResendMail(obj:any){
        this.hideAction = "NO";
        this.hideBtn = "NO";
        this.lablelButton=this.locale.commons_send;
        this.fgColorTitle = "white";
        this.bgColorTitle = "#8898aa!important"; 
        this.showForm = false;
        this.textParagraph1=this.locale.commons_areyousure;
        this.titleModal = this.locale.commons_confirmasendemail;
        this.textParagraph2 = this.locale.appuser_theappuser + " ["+obj['name']+"] "+ this.locale.commons_willreceiveactivationmail +".";        
        this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
        this.showModal(obj,"S");

  }

  resendeactivaionmail(login){
    this.spinnerService.showSpinner();
    this.userService.resendActivationMail(login).subscribe(
      data => {
        this.spinnerService.hideSpinner();
        this.spinnerService.hideSpinner();
        this.showConfirmation(this.locale.appuser_activationmailsend + " "+this.locale.appuser_theappuser+" ["+this.selectedID['name']+"] " + this.locale.commons_withsuccess + ".");

        },
      err => {
        this.submitted = true;
        this.errorMessage =  this.spinnerService.handleError(err);
        this.showConfirmation(this.errorMessage);

      }
    );

  }

  getStatusLocale(status:string){
    if (status === 'Blocked'){
      return this.locale.status_blocked;
    } else if (status === 'Pending'){
      return this.locale.status_pending;
    } else if (status === 'Completed'){
      return this.locale.status_completed;
    } else if (status === 'Inactive'){
          return this.locale.status_inactive;
    }else{
      return this.locale.status_unknown;
    }
  }

  getStatus(obj:any): string {
    if (obj.blocked == 'Y'){
          return "Blocked";
    }
    if (obj.active == 'Y' && obj.registerPhase < 6){
      return "Pending";
    }
    if (obj.active == 'Y' && obj.registerPhase >= 6){
      return "Completed";
    }
    if (obj.active == 'N'){
          return "Inactive";
    }
    return "Unknow";
  }

  getPercentual(obj:any):number{
        let phase: number = obj.registerPhase;
        if (phase == 0) phase = 1;
        return Math.round((phase*100)/6);
  }



  goDetails(obj){
    this.appUserSelected = obj;
    this.spinnerService.setAppUserObject({"row":obj,"filter":{"page":this.currentPage,"searchFor":this.searchFor,"searchName":this.searchName,"searchLogin":this.searchLogin,"userAppSelected":this.appUserSelected}});
    this.router.navigateByUrl('app_users/detail');
  }

  goAudit(obj){
    this.appUserSelected = obj;
    this.spinnerService.setAppUserObject({"row":obj,"filter":{"page":this.currentPage,"searchFor":this.searchFor,"searchName":this.searchName,"searchLogin":this.searchLogin,"userAppSelected":this.appUserSelected}});
    this.router.navigateByUrl('app_users/audit');
  }

  setupFilters(){
    //se veio da tela de audit, popula os filtros que ja estavam como paginacao e campos da busca
   if (this.spinnerService.getAppUserObject()){
     this.currentPage = this.spinnerService.getAppUserObject().filter.page;
     this.searchFor = this.spinnerService.getAppUserObject().filter.searchFor;
     this.searchName = this.spinnerService.getAppUserObject().filter.searchName;
     this.searchLogin = this.spinnerService.getAppUserObject().filter.searchLogin;
     this.appUserFilterForm.controls.filterType.setValue(this.searchFor?this.searchFor:"active");
     this.appUserFilterForm.controls.name.setValue(this.searchName);
     this.appUserFilterForm.controls.login.setValue(this.searchLogin);
     this.appUserSelected = this.spinnerService.getAppUserObject().filter.appUserSelected;
   }
}
  onSubmit(){
    this.submitted = true;
    this.errorMessage = null;
    this.currentPage = 0;
    //stop here if form is invalid
    if (this.appUserFilterForm.invalid) {
            return;
    }
    this.spinnerService.setAdminUserObject(null);
    this.loadFilterFields();
    this.carregaAppUser(this.currentPage,this.searchFor,this.searchName,this.searchLogin,this.sortObject);
  }

  loadFilterFields(){
    if (this.appUserFilterForm.controls.filterType.value){
      this.searchFor = this.appUserFilterForm.controls.filterType.value;
    }else{
      this.searchFor = "active";
    }
    if (this.appUserFilterForm.controls.login.value){
      this.searchLogin = this.appUserFilterForm.controls.login.value;
    }else{
      this.searchLogin = null;
    }
    if (this.appUserFilterForm.controls.name.value){
      this.searchName = this.appUserFilterForm.controls.name.value;
    }else{
      this.searchName = null;
    }

  }
  carregaAppUser(page,search,name,login,sort){
    this.spinnerService.showSpinner();
      this.userService.getAllAppUsers(page,search,name,login,sort).subscribe(
        data => {
          this.spinnerService.hideSpinner();
          this.rows =   data.data.content;
          this.pageable = {"page": data.data.pageable,"last":data.data.last,"first":data.data.first,"totalPages":data.data.totalPages,"pageNumber":data.data.number};
          },
        err => {
          this.submitted = true;
          this.errorMessage =  this.spinnerService.handleError(err);
        }
      );
    
  }

  fakeArray(): Array<any> {
    return new Array(this.pageable.totalPages);
  }



  goActivate(obj){
    (this.guardian.hasAccess('activate_appUser') as Observable<boolean>).subscribe(resp=>{
      if (resp){
        this.hideAction = "NO";
        this.hideBtn = "NO";
        this.lablelButton=this.locale.commons_activate;
        this.fgColorTitle = "white";
        this.bgColorTitle = "#007bff!important"; 
        this.showForm = false;
        this.textParagraph1=this.locale.commons_areyousure;
        this.titleModal = this.locale.commons_confirmactivation;
        this.textParagraph2 = this.locale.appuser_theappuser + " ["+obj['name']+"] "+ this.locale.commons_willbeactivated +".";
        this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
        this.showModal(obj,"A");    
      }
    });
  }

  goUnblocked(obj){
    (this.guardian.hasAccess('unblocked_appUser') as Observable<boolean>).subscribe(resp=>{
      if (resp){
        this.hideAction = "NO";
        this.hideBtn = "NO";
        this.lablelButton=this.locale.commons_unblock;
        this.fgColorTitle = "white";
        this.bgColorTitle = "#8898aa!important"; 
        this.showForm = false;
        this.textParagraph1=this.locale.commons_areyousure;
        this.titleModal = this.locale.commons_confirmactivation;
        this.textParagraph2 = this.locale.appuser_theappuser + " ["+obj['name']+"] "+ this.locale.commons_willbeunblocked +".";
        this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
        this.showModal(obj,"B");
    
      }
    });    
  }
  activatedAppUser(id){
    this.spinnerService.showSpinner();
    this.userService.activatedAppUser(id).subscribe(
      data => {
        //this.currentPage =0;
        this.carregaAppUser(this.currentPage,this.searchFor,this.searchName,this.searchName,this.sortObject);
        this.spinnerService.hideSpinner();
        this.showConfirmation(this.locale.appuser_theappuser + " ["+this.selectedID['name']+"] "+ this.locale.commons_activatedsuccess +".");
      },
      err => {
        this.submittedRegister = true;
        this.errorMessage =  this.spinnerService.handleError(err);
        //this.hideModal();
        this.showConfirmation(this.errorMessage);
      }
    );
    
  }

  inactivatedAppUser(id){
    this.spinnerService.showSpinner();
    this.userService.inactivatedAppUser(id).subscribe(
          data => {
            //this.currentPage =0;
            this.carregaAppUser(this.currentPage,this.searchFor,this.searchName,this.searchName,this.sortObject);
            this.spinnerService.hideSpinner();
            this.showConfirmation(this.locale.appuser_theappuser + " ["+this.selectedID['name']+"] "+ this.locale.commons_deletedsuccess +".");
            this.confirmButton = false;
          },
          err => {
            this.submittedRegister = true;
            this.errorMessage =  this.spinnerService.handleError(err);
            this.confirmButton = false;
            //this.hideModal();
            this.showConfirmation(this.errorMessage);
          }
    );

  }

  unblockedAppUser(id){
    this.spinnerService.showSpinner();
    this.userService.unblockedAppUser(id).subscribe(
          data => {
            //this.currentPage =0;
            this.carregaAppUser(this.currentPage,this.searchFor,this.searchName,this.searchName,this.sortObject);
            this.spinnerService.hideSpinner();
            this.showConfirmation(this.locale.appuser_theappuser + " ["+this.selectedID['name']+"] "+ this.locale.commons_unblockedsuccess +".");
            this.confirmButton = false;
          },
          err => {
            this.submittedRegister = true;
            this.errorMessage =  this.spinnerService.handleError(err);
            this.confirmButton = false;
            //this.hideModal();
            this.showConfirmation(this.errorMessage);
          }
    );

  }
  goInactivate(obj){
    (this.guardian.hasAccess('inactivate_appUser') as Observable<boolean>).subscribe(resp=>{
      if (resp){
        this.hideAction = "NO";
        this.hideBtn = "NO";
        this.lablelButton=this.locale.commons_delete;
        this.bgColorTitle = "#dc3545"; 
        this.fgColorTitle = "white";
        this.showForm = false;
        this.textParagraph1=this.locale.commons_areyousure;
        this.titleModal = this.locale.commons_confirmexclusion;
        this.textParagraph2 = this.locale.appuser_theappuser + " ["+obj['name']+"] "+ this.locale.answer_willbeexcluded +".";
        this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
        this.showModal(obj,"E");    
      }
    });


  }

  changeCollapseLabel(){
    
    if (this.stateCollapse){
        this.stateCollapse = false;
        $("#collapseAppUser").collapse('show');
    }else{
      this.stateCollapse = true;
      $("#collapseAppUser").collapse('hide');
    }
  }

  displayPage(page) {
    this.currentPage = page;
    this.carregaAppUser(page,this.searchFor,this.searchName,this.searchName,this.sortObject);
  }


  confirmOperation(){
    if (this.operationType == "E"){
        this.inactivatedAppUser(this.selectedID['id']);
    }else if (this.operationType == "B"){
        this.unblockedAppUser(this.selectedID['id']);
    }else if (this.operationType == "A"){
        this.activatedAppUser(this.selectedID['id']);
    }else if (this.operationType == "S"){
      this.resendeactivaionmail(this.selectedID['login']);
    }else if (this.operationType == "Z"){
      this.hideModal();
      this.hideBtn = "NO";
    }
    
  }


  showConfirmation(text){
    this.hideBtn = "NOK";
    this.hideAction = "YES";
    this.lablelButton=this.locale.commons_ok;
    this.bgColorTitle = "#6c757d!important"; 
    this.showForm = false;
    this.titleModal = this.locale.commons_sucess;
    this.textParagraph1 = "";
    this.textParagraph2 = text;
    this.content = "<strong>"+this.textParagraph1+""+this.textParagraph2+"</strong>";
    this.operationType ="Z";
  }
  
  hideModal(){
    $("#"+this.modalId).modal('hide');
  }

  showModal(obj,operation){
    this.operationType = operation;
    this.selectedID = obj;
    $("#"+this.modalId).modal('show');

  }

  goWelcome(){
    this.router.navigateByUrl('/');
  }

  onChange(deviceValue) {
    this.itensPerPage = deviceValue;
    this.sortObject.itensPerPage = deviceValue;
    this.sortObject = {"sortName":this.sortName,"sortDirection":this.sortDirection,"itensPerPage":this.itensPerPage};
    //recaregalista
  }

  onClickColumn(value){
        if (this.tableLabelsDirections[value] == "ASC"){
          this.sortDirection = "DESC";
        }else{
          this.sortDirection = "ASC";
        }
        this.tableLabelsDirections[value]=this.sortDirection;
        this.sortName = value;
        for(let cont = 0; cont < this.tableLabelsDirections.length;cont++){
          if (value == cont){
            this.tableLabelsDirections[cont] = this.sortDirection
          }else{
            this.tableLabelsDirections[cont] = "NONE";
          }
        }
        this.sortObject = {"sortName":this.sortName,"sortDirection":this.sortDirection,"itensPerPage":this.itensPerPage};
        this.carregaAppUser(this.currentPage,this.searchFor,this.searchName,this.searchName,this.sortObject);
  }
}
