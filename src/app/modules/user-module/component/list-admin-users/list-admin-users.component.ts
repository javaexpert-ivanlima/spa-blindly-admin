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


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private userService: UserService
    ) { 
      this.adminUserFilterForm = this.formBuilder.group({
        filterType: [ 'all', [Validators.required]],
        name: [null,[Validators.minLength(4)]]
      });
      this.adminUserForm = this.formBuilder.group({
        name: [null, [Validators.required, Validators.minLength(3)]],
        login: [null, [Validators.required, Validators.email]],
        superUser: [null, [Validators.required]]
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
    //preenche lista
    this.carregaAdminUser(this.currentPage);
  }

  onSubmit(){
  }

  carregaAdminUser(page){
    this.spinnerService.showSpinner();
      this.userService.getAllAdminUsers().subscribe(
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
    this.bgColorTitle = "#a6c!important"; 
    this.showForm = false;
    this.titleModal = "Confirmation for activation";
    this.textParagraph2 = "The AdminUser ["+obj['name']+"] will be activated.";
    this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
    this.showModal(obj,"A");
  }


  activatedAdminUser(id){
    this.spinnerService.showSpinner();
    this.userService.activatedQuestion(id).subscribe(
      data => {
        this.currentPage =0;
        this.carregaAdminUser(this.currentPage);
        this.spinnerService.hideSpinner();
        this.showConfirmation("AdminUser ["+this.selectedID['name']+"] was activated with sucess.");
      },
      err => {
        this.handleError(err);
        this.hideModal();
      }
    );
    
  }

  inactivatedAdminUser(id){
    this.spinnerService.showSpinner();
    this.userService.inactivatedQuestion(id).subscribe(
          data => {
            this.currentPage =0;
            this.carregaAdminUser(this.currentPage);
            this.spinnerService.hideSpinner();
            this.showConfirmation("AdminUser ["+this.selectedID['name']+"] was deleted with sucess.");
            this.confirmButton = false;
          },
          err => {
            this.handleError(err);
            this.confirmButton = false;
            this.hideModal();
          }
    );

  }

  exclude(obj){
    this.lablelButton="Delete";
    this.bgColorTitle = "#a6c!important"; 
    this.showForm = false;
    this.titleModal = "Confirmation for exclusion";
    this.textParagraph2 = "The AdminUser ["+obj['name']+"] will be excluded.";
    this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
    this.showModal(obj,"E");
  }

  audit(obj){
    //this.spinnerService.setQuestionObject({"row":obj,"filter":{"page":this.currentPage,"searchFor":this.searchFor,"searchName":this.searchName,"searchCategory":this.searchCategory,"categorySelected":this.categorySelected}});
    this.router.navigateByUrl('/admin_users/audit');
  }

  edit(obj){
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
    this.carregaAdminUser(page);
  }

  confirmOperation(){
    if (this.operationType == "E"){
        this.inactivatedAdminUser(this.selectedID['id']);
    }else if (this.operationType == "A"){
        this.activatedAdminUser(this.selectedID['id']);
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
          this.carregaAdminUser(this.currentPage);
          this.showConfirmation("AdminUser ["+nameUser+"] was added with sucess.");
          this.spinnerService.hideSpinner();
                },
        err => {
          this.handleError(err);
          this.spinnerService.hideSpinner();
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
    this.spinnerService.hideSpinner();
  }
}
