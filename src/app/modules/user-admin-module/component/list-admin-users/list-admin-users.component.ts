import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faThinkPeaks } from '@fortawesome/free-brands-svg-icons';
import { Observable } from 'rxjs';
import { SpinnerShowService } from 'src/app/component/spinner';
import { PermissionGuard } from 'src/app/helpers/permission.guard';
import { TokenStorageService } from 'src/app/component/';
import { UserAdminService } from '../../service';
import { TitleCasePipe } from '@angular/common';
import { CapitalizeFirstPipe } from 'src/app/helpers/CapitalizeFirstPipe';

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
  labels : string[] = ['id','login','name','super user','active','blocked','last update','modified by'];

  //modal fields
  fgColorTitle:string;
  lablelButton:string;
  hideBtn:string;
  bgColorTitle:string; 
  titleModal:string;
  textParagraph1="Are you totally sure about this operation?"
  textParagraph2="If not please close this confirmation, else if you are sure click on confirm button.";
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
  
  permissions: any = null;
  titleCheckAll = "Click for check all";
  constructor(
    private titlecasePipe:CapitalizeFirstPipe,
    private formBuilder: FormBuilder,
    private router: Router,
    private guardian: PermissionGuard,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private userService: UserAdminService
    ) { 
      this.adminUserFilterForm = this.formBuilder.group({
        filterType: [ 'all', [Validators.required]],
        name: [null,[Validators.minLength(4)]],
        login: [null, [Validators.minLength(4)]]
      });
      this.adminUserForm = this.formBuilder.group({
        name: [null, [Validators.required, Validators.minLength(3)]],
        login: [null, [Validators.required, Validators.email]],
        superUser: ['No', [Validators.required]],
        permissions: new FormArray([])
      });
    }

  private addCheckboxes() {
      this.permissions.forEach((o) => {
      const control = new FormControl(o.name); // if first item set to true, else false
      (this.adminUserForm.controls.permissions as FormArray).push(control);
      });
  }

  selectAll(event){
    if (event.target.checked){
      this.titleCheckAll = "Click for uncheck all";
      this.checkAll();
    } else {
      this.titleCheckAll = "Click for check all";
      this.uncheckAll();
    }
  }

  checkAll(){
       
          this.removeAllFormControl();
          this.addCheckboxes();
          $("input[name=permissions]").each( function () {
            $(this).prop('checked',true);
          });
  }
  uncheckAll(){
       
      this.removeAllFormControl();
      $("input[name=permissions]").each( function () {
        $(this).prop('checked',false);
      });
}

  removeAllFormControl(){
    const formArray: FormArray = this.adminUserForm.get('permissions') as FormArray;
    formArray.clear();
  }

  onCheckChange(event) {
    if (event){
      const formArray: FormArray = this.adminUserForm.get('permissions') as FormArray;
      /* Selected */
      if(event.target.checked){
        // Add a new control in the arrayForm
        formArray.push(new FormControl(event.target.value));
      }
      /* unselected */
      else{
        // find the unselected element
        let i: number = 0;
    
        formArray.controls.forEach((ctrl: FormControl) => {
          if(ctrl.value == event.target.value) {
            // Remove the unselected element from the arrayForm
            formArray.removeAt(i);
            return;
          }
    
          i++;
        });
      }
  
    }
  }  

  ngOnInit(): void {
    this.hideBtn = "NO";
    this.titleCheckAll = "Click for check all";
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
    this.carregaPermissions();
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
          this.errorMessage =  this.spinnerService.handleError(err);
        }
      );
    
  }

  carregaPermissions(){
    this.spinnerService.showSpinner();
      this.userService.getAllPermissions().subscribe(
        data => {
          this.spinnerService.hideSpinner();
          this.permissions =   data.data;
          //this.addCheckboxes();
          },
        err => {
          this.errorMessage =  this.spinnerService.handleError(err);
        }
      );
    
  }

  addNew(){
    (this.guardian.hasAccess('create_adminUser') as Observable<boolean>).subscribe(resp=>{
          if (resp){
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
                  this.removeAllFormControl();
                  $("#"+this.modalId).on('shown.bs.modal', function (e) {
                    $("input[name=permissions]").each( function () {
                      $(this).prop('checked',false);
                    });
                  })
                  this.showModal(null,"C");

          }
    });    
  }

  activated(obj){
    (this.guardian.hasAccess('activate_adminUser') as Observable<boolean>).subscribe(resp=>{
          if (resp){
            this.lablelButton="Activate";
            this.bgColorTitle = "#007bff!important"; 
            this.showForm = false;
            this.titleModal = "Confirmation for activation";
            this.textParagraph1="Are you totally sure about this operation?"
            this.textParagraph2 = "The AdminUser ["+obj['name']+"] will be activated.";
            this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
            this.showModal(obj,"A");       
          }
    });      
  }

  unblocked(obj){
    (this.guardian.hasAccess('unblocked_adminUser') as Observable<boolean>).subscribe(resp=>{
      if (resp){
        this.lablelButton="Unblock";
        this.bgColorTitle = "#007bff!important"; 
        this.showForm = false;
        this.textParagraph1="Are you totally sure about this operation?"
        this.titleModal = "Confirmation for unblocking";
        this.textParagraph2 = "The AdminUser ["+obj['name']+"] will be unblocked.";
        this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
        this.showModal(obj,"B");    
      }
    });      
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
        this.errorMessage =  this.spinnerService.handleError(err);
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
            this.errorMessage =  this.spinnerService.handleError(err);
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
            this.errorMessage =  this.spinnerService.handleError(err);
            this.confirmButton = false;
            //this.hideModal();
            this.showConfirmation(this.errorMessage);
          }
    );

  }
  exclude(obj){
    (this.guardian.hasAccess('inactivate_adminUser') as Observable<boolean>).subscribe(resp=>{
      if (resp){
        this.lablelButton="Delete";
        this.bgColorTitle = "#007bff!important"; 
        this.showForm = false;
        this.titleModal = "Confirmation for exclusion";
        this.textParagraph1="Are you totally sure about this operation?"
        this.textParagraph2 = "The AdminUser ["+obj['name']+"] will be excluded.";
        this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
        this.showModal(obj,"E");    
      }
    });      
  }

  audit(obj){
    this.spinnerService.setAdminUserObject({"row":obj,"filter":{"page":this.currentPage,"searchFor":this.searchFor,"searchName":this.searchName,"searchLogin":this.searchLogin,"userAdminSelected":this.adminUserSelected}});
    this.router.navigateByUrl('/admin_users/audit');
  }

  edit(obj){
    (this.guardian.hasAccess('update_adminUser') as Observable<boolean>).subscribe(resp=>{
          if (resp){
            this.submittedRegister = false;
            this.submitted = false;
            this.errorMessage = null;
            this.lablelButton="Update";
            this.bgColorTitle = "#007bff!important"; 
            this.titleModal = "Edit Admin User";
            let isSuperUser: string = obj['superUser']=='Y'?'Yes':'No';
            this.adminUserForm.controls.superUser.setValue(isSuperUser);
            this.adminUserForm.controls.name.setValue(this.titlecasePipe.transform(obj['name'],null));
            this.adminUserForm.controls.login.setValue(obj['login']);
            let permissions:any = JSON.parse(obj['permissions']);
            let ctrlPermissions: FormArray = this.adminUserForm.controls.permissions;
            this.showForm = true;
            this.showModal(obj,"U");
            let oper = this.operationType;
            this.removeAllFormControl();
            $("#"+this.modalId).on('shown.bs.modal', function (e) {
              if (oper == 'U'){
                      if (permissions){
                          if (permissions.permission){
                            permissions.permission.forEach((o) => {
                              const control = new FormControl(o.name); // if first item set to true, else false
                              (ctrlPermissions as FormArray).push(control);
                              let key: string = '#'+o.name;
                              $(key).prop('checked',true);
                              $(this).off('shown.bs.modal');
                            });
                          }
                      }  
              }
            })
        
          }
    });      
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
    let json = this.getPermissionAsJson();
    this.userService.updateAdminUser(id,form,json).subscribe(
      data => {
        this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchName);
        this.spinnerService.hideSpinner();
        this.showConfirmation("AdminUser ["+form.name.value+"] was updated with sucess.");
      },
      err => {
        this.submittedRegister = true;
        this.errorMessage =  this.spinnerService.handleError(err);
        //this.showConfirmation(this.errorMessage);
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

  getPermissionAsJson() :any{
    const formArray: FormArray = this.adminUserForm.get('permissions') as FormArray;
    let json : any = [];
    formArray.controls.forEach((ctrl: FormControl) => {
      json.push({"name":ctrl.value});
    });
    return json;
  }

  createAdminUser(){
    this.spinnerService.showSpinner();
    let login = this.adminUserForm.controls.login.value;
    let nameUser = this.adminUserForm.controls.name.value;
    let isSuper = this.adminUserForm.controls.superUser.value;
    let json = this.getPermissionAsJson();
    this.userService.createAdminUser(nameUser,login,isSuper,json).subscribe(
        data => {
          this.currentPage =0;
          this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchName);
          this.showConfirmation("AdminUser ["+nameUser+"] was added with sucess.");
          this.spinnerService.hideSpinner();
      },
        err => {
          this.submittedRegister = true;
          this.errorMessage =  this.spinnerService.handleError(err);
          //this.showConfirmation(this.errorMessage);
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
}
