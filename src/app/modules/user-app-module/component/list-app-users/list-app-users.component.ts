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
  searchFor: string = null;
  searchName: string = null;
  searchLogin: number = null;
  appUserSelected: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private guardian: PermissionGuard,
    private userService: UserAppService
    ) { 
      this.appUserFilterForm = this.formBuilder.group({
        filterType: [ 'all', [Validators.required]],
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
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    this.setupFilters();
    //preenche lista
    this.carregaAppUser(this.currentPage,this.searchFor,this.searchName,this.searchName);
  }
  goResendMail(obj:any){
        this.lablelButton="Send";
        this.fgColorTitle = "white";
        this.bgColorTitle = "#8898aa!important"; 
        this.showForm = false;
        this.titleModal = "Confirmation for sending e-mail";
        this.textParagraph1="Are you totally sure about this operation?"
        this.textParagraph2 = "The AppUser ["+obj['name']+"] will receive an activation e-mail.";
        this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
        this.showModal(obj,"S");

  }

  resendeactivaionmail(login){
    this.spinnerService.showSpinner();
    this.userService.resendActivationMail(login).subscribe(
      data => {
        this.spinnerService.hideSpinner();
        this.spinnerService.hideSpinner();
        this.showConfirmation("Activation e-mail was sent to AppUser ["+this.selectedID['name']+"] with sucess.");

        },
      err => {
        this.submitted = true;
        this.errorMessage =  this.spinnerService.handleError(err);
        this.showConfirmation(this.errorMessage);

      }
    );

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
     this.appUserFilterForm.controls.filterType.setValue(this.searchFor?this.searchFor:"all");
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
    this.carregaAppUser(this.currentPage,this.searchFor,this.searchName,this.searchLogin);
  }

  loadFilterFields(){
    if (this.appUserFilterForm.controls.filterType.value){
      this.searchFor = this.appUserFilterForm.controls.filterType.value;
    }else{
      this.searchFor = null;
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
  carregaAppUser(page,search,name,login){
    this.spinnerService.showSpinner();
      this.userService.getAllAppUsers(page,search,name,login).subscribe(
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
        this.lablelButton="Activate";
        this.fgColorTitle = "white";
        this.bgColorTitle = "#8898aa!important"; 
        this.showForm = false;
        this.titleModal = "Confirmation for activation";
        this.textParagraph1="Are you totally sure about this operation?"
        this.textParagraph2 = "The AppUser ["+obj['name']+"] will be activated.";
        this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
        this.showModal(obj,"A");    
      }
    });
  }

  goUnblocked(obj){
    (this.guardian.hasAccess('unblocked_appUser') as Observable<boolean>).subscribe(resp=>{
      if (resp){
        this.lablelButton="Unblock";
        this.fgColorTitle = "white";
        this.bgColorTitle = "#8898aa!important"; 
        this.showForm = false;
        this.titleModal = "Confirmation for unblocking";
        this.textParagraph1="Are you totally sure about this operation?"
        this.textParagraph2 = "The AppUser ["+obj['name']+"] will be unblocked.";
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
        this.carregaAppUser(this.currentPage,this.searchFor,this.searchName,this.searchName);
        this.spinnerService.hideSpinner();
        this.showConfirmation("AppUser ["+this.selectedID['name']+"] was activated with sucess.");
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
            this.carregaAppUser(this.currentPage,this.searchFor,this.searchName,this.searchName);
            this.spinnerService.hideSpinner();
            this.showConfirmation("AppUser ["+this.selectedID['name']+"] was deleted with sucess.");
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
            this.carregaAppUser(this.currentPage,this.searchFor,this.searchName,this.searchName);
            this.spinnerService.hideSpinner();
            this.showConfirmation("AppUser ["+this.selectedID['name']+"] was unblocked with sucess.");
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
        this.lablelButton="Delete";
        this.fgColorTitle = "white";
        this.bgColorTitle = "#8898aa!important"; 
        this.showForm = false;
        this.textParagraph1="Are you totally sure about this operation?"
        this.titleModal = "Confirmation for exclusion";
        this.textParagraph2 = "The AppUser ["+obj['name']+"] will be excluded.";
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
    this.carregaAppUser(page,this.searchFor,this.searchName,this.searchName);
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
    this.hideBtn = "YES";
    this.lablelButton="OK";
    this.bgColorTitle = "#6c757d!important"; 
    this.showForm = false;
    this.titleModal = "Sucess";
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
}
