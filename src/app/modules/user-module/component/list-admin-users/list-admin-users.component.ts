import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/modules/login-module';
import { UserService } from '../../service';

@Component({
  selector: 'app-list-admin-users',
  templateUrl: './list-admin-users.component.html',
  styleUrls: ['./list-admin-users.component.css']
})
export class ListAdminUsersComponent implements OnInit {
  title : string = 'admin users';
  modalId = "dialogConfirm";
  errorMessage = '';
  rows: any[] = [];
  columns : string[] = ['id','login','name','superUser','active','blocked','lastUpdateDate','modifiedBy'];
  labels : string[] = ['id','login','name','super_user','active','blocked','last_update','modified_by'];

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

  adminUserFilterForm: any;
  adminUserForm: any;
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
  adminUserSelected: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private userService: UserService
    ) { 
      this.adminUserFilterForm = this.formBuilder.group({
        filterType: [ 'all', [Validators.required]],
        name: [null,[Validators.minLength(4)]],
        login: [null, [Validators.minLength(4)]]
      });
      this.adminUserForm = this.formBuilder.group({
        name: [null, [Validators.required, Validators.minLength(3)]],
        login: [null, [Validators.required, Validators.email]],
        superUser: ['No', [Validators.required]]
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
    this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchName);
  }

  setupFilters(){
    //se veio da tela de audit, popula os filtros que ja estavam como paginacao e campos da busca
   if (this.spinnerService.getAdminUserObject()){
     this.currentPage = this.spinnerService.getAdminUserObject().filter.page;
     this.searchFor = this.spinnerService.getAdminUserObject().filter.searchFor;
     this.searchName = this.spinnerService.getAdminUserObject().filter.searchName;
     this.searchLogin = this.spinnerService.getAdminUserObject().filter.searchLogin;
     this.adminUserFilterForm.controls.filterType.setValue(this.searchFor?this.searchFor:"all");
     this.adminUserFilterForm.controls.name.setValue(this.searchName);
     this.adminUserFilterForm.controls.login.setValue(this.searchLogin);
     this.adminUserSelected = this.spinnerService.getAdminUserObject().filter.adminUserSelected;
   }
}
  onSubmit(){
    this.submitted = true;
    this.submittedRegister = false;
    this.errorMessage = null;
    this.currentPage = 0;
    //stop here if form is invalid
    if (this.adminUserFilterForm.invalid) {
            return;
    }
    this.spinnerService.setAdminUserObject(null);
    this.loadFilterFields();
    this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchLogin);
  }

  loadFilterFields(){
    if (this.adminUserFilterForm.controls.name.value){
      this.searchName = this.adminUserFilterForm.controls.name.value;
    }else{
      this.searchName = null;  
    }
    if (this.adminUserFilterForm.controls.filterType.value){
      this.searchFor = this.adminUserFilterForm.controls.filterType.value;
    }else{
      this.searchFor = null;
    }
    if (this.adminUserFilterForm.controls.login.value){
      this.searchLogin = this.adminUserFilterForm.controls.login.value;
    }else{
      this.searchLogin = null;
    }

  }
  carregaAdminUser(page,search,name,login){
    this.spinnerService.showSpinner();
      this.userService.getAllAdminUsers(page,search,name,login).subscribe(
        data => {
          this.spinnerService.hideSpinner();
          this.rows =   data.data.content;
          this.pageable = {"page": data.data.pageable,"last":data.data.last,"first":data.data.first,"totalPages":data.data.totalPages,"pageNumber":data.data.number};
          },
        err => {
          this.submitted = true;
          this.handleError(err);
        }
      );
    
  }

  addNew(){
    //this.router.navigateByUrl('admin_users/create');
    this.submittedRegister = false;
    this.submitted = false;
    this.errorMessage = null;
    this.showForm = true;
    this.bgColorTitle = "#007bff!important";
    this.fgColorTitle = "white";
    this.titleModal = "Create AdminUser";
    this.lablelButton="Save User";
    //this.weightAnswerSelected = "";
    this.adminUserForm.controls.name.setValue("");
    this.adminUserForm.controls.login.setValue("");
    this.showModal(null,"C");
  }

  activated(obj){
    this.lablelButton="Activate";
    this.bgColorTitle = "#007bff!important"; 
    this.showForm = false;
    this.titleModal = "Confirmation for activation";
    this.textParagraph2 = "The AdminUser ["+obj['name']+"] will be activated.";
    this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
    this.showModal(obj,"A");
  }

  unblocked(obj){
    this.lablelButton="Unblock";
    this.bgColorTitle = "#007bff!important"; 
    this.showForm = false;
    this.titleModal = "Confirmation for unblocking";
    this.textParagraph2 = "The AdminUser ["+obj['name']+"] will be unblocked.";
    this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
    this.showModal(obj,"B");
  }
  activatedAdminUser(id){
    this.spinnerService.showSpinner();
    this.userService.activatedAdminUser(id).subscribe(
      data => {
        this.currentPage =0;
        this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchName);
        this.spinnerService.hideSpinner();
        this.showConfirmation("AdminUser ["+this.selectedID['name']+"] was activated with sucess.");
      },
      err => {
        this.submittedRegister = true;
        this.handleError(err);
        //this.hideModal();
        this.showConfirmation(this.errorMessage);
      }
    );
    
  }

  inactivatedAdminUser(id){
    this.spinnerService.showSpinner();
    this.userService.inactivatedAdminUser(id).subscribe(
          data => {
            this.currentPage =0;
            this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchName);
            this.spinnerService.hideSpinner();
            this.showConfirmation("AdminUser ["+this.selectedID['name']+"] was deleted with sucess.");
            this.confirmButton = false;
          },
          err => {
            this.submittedRegister = true;
            this.handleError(err);
            this.confirmButton = false;
            //this.hideModal();
            this.showConfirmation(this.errorMessage);
          }
    );

  }

  unblockedAdminUser(id){
    this.spinnerService.showSpinner();
    this.userService.unblockedAdminUser(id).subscribe(
          data => {
            this.currentPage =0;
            this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchName);
            this.spinnerService.hideSpinner();
            this.showConfirmation("AdminUser ["+this.selectedID['name']+"] was unblocked with sucess.");
            this.confirmButton = false;
          },
          err => {
            this.submittedRegister = true;
            this.handleError(err);
            this.confirmButton = false;
            //this.hideModal();
            this.showConfirmation(this.errorMessage);
          }
    );

  }
  exclude(obj){
    this.lablelButton="Delete";
    this.bgColorTitle = "#007bff!important"; 
    this.showForm = false;
    this.titleModal = "Confirmation for exclusion";
    this.textParagraph2 = "The AdminUser ["+obj['name']+"] will be excluded.";
    this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
    this.showModal(obj,"E");
  }

  audit(obj){
    this.spinnerService.setAdminUserObject({"row":obj,"filter":{"page":this.currentPage,"searchFor":this.searchFor,"searchName":this.searchName,"searchLogin":this.searchLogin,"userAdminSelected":this.adminUserSelected}});
    this.router.navigateByUrl('/admin_users/audit');
  }

  edit(obj){
    this.submittedRegister = false;
    this.submitted = false;
    this.errorMessage = null;
    this.lablelButton="Update";
    this.bgColorTitle = "#007bff!important"; 
    this.titleModal = "Edit Admin User";
    let isSuperUser: string = obj['superUser']=='Y'?'Yes':'No';
    this.adminUserForm.controls.superUser.setValue(isSuperUser);
    this.adminUserForm.controls.name.setValue(obj['name']);
    this.adminUserForm.controls.login.setValue(obj['login']);
    this.showForm = true;
    this.showModal(obj,"U");
  }


  changeCollapseLabel(){
    
    if (this.stateCollapse){
        this.stateCollapse = false;
        $("#collapseQuestion").collapse('show');
    }else{
      this.stateCollapse = true;
      $("#collapseQuestion").collapse('hide');
    }
  }

  displayPage(page) {
    this.currentPage = page;
    this.carregaAdminUser(page,this.searchFor,this.searchName,this.searchName);
  }

  updateAdminUser(id,form){
    
    this.spinnerService.showSpinner();
    this.userService.updateAdminUser(id,form).subscribe(
      data => {
        this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchName);
        this.spinnerService.hideSpinner();
        this.showConfirmation("AdminUser ["+form.name.value+"] was updated with sucess.");
      },
      err => {
        this.submittedRegister = true;
        this.handleError(err);
        this.showConfirmation(this.errorMessage);
      }
    );
    
  }

  confirmOperation(){
    if (this.operationType == "E"){
        this.inactivatedAdminUser(this.selectedID['id']);
    }else if (this.operationType == "B"){
        this.unblockedAdminUser(this.selectedID['id']);
    }else if (this.operationType == "A"){
        this.activatedAdminUser(this.selectedID['id']);
    } else if ( this.operationType == "U"){
        this.submittedRegister = true;
        this.submitted = false;
        this.errorMessage = null;
        if (this.adminUserForm.invalid) {
          return;
        }
        this.updateAdminUser(this.selectedID['id'],this.adminUserForm.controls);       
        
    }else if (this.operationType == "C"){
      this.submittedRegister = true;
      this.submitted = false;
      this.errorMessage = null;
      if (this.adminUserForm.invalid) {
        return;
      }
      this.createAdminUser();  
    }else if (this.operationType == "Z"){
      this.hideModal();
      this.hideBtn = "NO";
    }
    
  }

  createAdminUser(){
    this.spinnerService.showSpinner();
    let login = this.adminUserForm.controls.login.value;
    let nameUser = this.adminUserForm.controls.name.value;
    let isSuper = this.adminUserForm.controls.superUser.value;
      this.userService.createAdminUser(nameUser,login,isSuper).subscribe(
        data => {
          this.currentPage =0;
          this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchName);
          this.showConfirmation("AdminUser ["+nameUser+"] was added with sucess.");
          this.spinnerService.hideSpinner();
                },
        err => {
          this.submittedRegister = true;
          this.handleError(err);
          this.showConfirmation(this.errorMessage);
        }
      );
    
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
  handleError(err){
    
    if (err.error && err.error.errors){
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
  }
}
