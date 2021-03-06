import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faThinkPeaks } from '@fortawesome/free-brands-svg-icons';
import { Observable } from 'rxjs';
import { SpinnerShowService } from 'src/app/component/spinner';
import { PermissionGuard } from 'src/app/helpers/permission.guard';
import { TokenStorageService } from 'src/app/component/';
import { UserAdminService } from '../../service';

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
  searchFor: string = "active";
  searchName: string = null;
  searchLogin: number = null;
  adminUserSelected: string = '';
  
  permissions: any = null;
  titleCheckAll = "Click for check all";

  locale: any;
  hideAction: string = "NO";
  sortObject: any = {"sortName":"name","sortDirection":"ASC","sortColumn":1,"itensPerPage":6};

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private guardian: PermissionGuard,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private userService: UserAdminService
    ) { 
      this.adminUserFilterForm = this.formBuilder.group({
        filterType: [ 'active', [Validators.required]],
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
      this.titleCheckAll = this.locale.adminuser_uncheckforall;
      this.checkAll();
    } else {
      this.titleCheckAll = this.locale.adminuser_checkforall;
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
    //verificacao de sessao expirada
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
      this.locale = this.tokenStorage.getLocale();
      this.labels = this.locale.adminuser_label;
      this.titleCheckAll = this.locale.adminuser_checkforall;
      
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    this.setupFilters();
    //preenche lista
    this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchLogin,this.sortObject);
    this.carregaPermissions();
  }

  setupFilters(){
    //se veio da tela de audit, popula os filtros que ja estavam como paginacao e campos da busca
   if (this.spinnerService.getAdminUserObject()){
     this.currentPage = this.spinnerService.getAdminUserObject().filter.page;
     this.searchFor = this.spinnerService.getAdminUserObject().filter.searchFor;
     this.searchName = this.spinnerService.getAdminUserObject().filter.searchName;
     this.searchLogin = this.spinnerService.getAdminUserObject().filter.searchLogin;
     this.adminUserFilterForm.controls.filterType.setValue(this.searchFor?this.searchFor:"active");
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
    this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchLogin,this.sortObject);
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
      this.searchFor = "active";
    }
    if (this.adminUserFilterForm.controls.login.value){
      this.searchLogin = this.adminUserFilterForm.controls.login.value;
    }else{
      this.searchLogin = null;
    }

  }
  carregaAdminUser(page,search,name,login,sort){
    this.spinnerService.showSpinner();
      this.userService.getAllAdminUsers(page,search,name,login,sort).subscribe(
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
          this.permissions =   data.data.permissions;
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
                  this.hideAction = "NO";
                  this.hideBtn = "NO";          
                  this.submittedRegister = false;
                  this.submitted = false;
                  this.errorMessage = null;
                  this.showForm = true;
                  this.bgColorTitle = "#007bff!important";
                  this.fgColorTitle = "white";
                  this.titleModal = this.locale.adminuser_createadminuser;
                  this.lablelButton= this.locale.adminuser_saveuser;
                  //this.weightAnswerSelected = "";
                  this.adminUserForm.controls.name.setValue("");
                  this.adminUserForm.controls.login.setValue("");
                  this.removeAllFormControl();
                  this.titleCheckAll = this.locale.adminuser_checkforall;
                  $('#checkall').prop('checked',false);
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
            this.hideAction = "NO";
            this.hideBtn = "NO";
            this.lablelButton=this.locale.commons_activate;
            this.bgColorTitle = "#007bff!important"; 
            this.fgColorTitle = "white";
            this.showForm = false;
            this.textParagraph1=this.locale.commons_areyousure;
            this.titleModal = this.locale.commons_confirmactivation;
            this.textParagraph2 = this.locale.adminuser_theadminuser + " ["+obj['name']+"] "+ this.locale.commons_willbeactivated +".";
            this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
            this.showModal(obj,"A");       
          }
    });      
  }

  unblocked(obj){
    (this.guardian.hasAccess('unblocked_adminUser') as Observable<boolean>).subscribe(resp=>{
      if (resp){
        this.hideAction = "NO";
        this.hideBtn = "NO";
        this.lablelButton=this.locale.commons_unblock;
        this.fgColorTitle = "white";
        this.showForm = false;
        this.textParagraph1=this.locale.commons_areyousure;
        this.titleModal = this.locale.commons_confirmactivation;
        this.textParagraph2 = this.locale.adminuser_theadminuser + " ["+obj['name']+"] "+ this.locale.commons_willbeunblocked +".";
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
        this.spinnerService.hideSpinner();
        this.showConfirmation(this.locale.adminuser_theadminuser + " ["+this.selectedID['name']+"] "+ this.locale.commons_activatedsuccess +".");
        this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchLogin,this.sortObject);
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
            this.spinnerService.hideSpinner();
            this.showConfirmation(this.locale.adminuser_theadminuser + " ["+this.selectedID['name']+"] "+ this.locale.commons_deletedsuccess +".");
            this.confirmButton = false;
            this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchLogin,this.sortObject);
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
            this.spinnerService.hideSpinner();
            this.showConfirmation(this.locale.adminuser_theadminuser + " ["+this.selectedID['name']+"] "+ this.locale.commons_unblockedsuccess +".");
            this.confirmButton = false;
            this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchLogin,this.sortObject);
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
        this.hideAction = "NO";
        this.hideBtn = "NO";
        this.lablelButton=this.locale.commons_delete;
        this.bgColorTitle = "#dc3545"; 
        this.fgColorTitle = "white";
        this.showForm = false;
        this.textParagraph1=this.locale.commons_areyousure;
        this.titleModal = this.locale.commons_confirmexclusion;
        this.textParagraph2 = this.locale.adminuser_theadminuser + " ["+obj['name']+"] "+ this.locale.answer_willbeexcluded +".";
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
            this.hideAction = "NO";
            this.hideBtn = "NO";
            this.submittedRegister = false;
            this.submitted = false;
            this.errorMessage = null;
            this.lablelButton= this.locale.commons_update;
            this.bgColorTitle = "#007bff!important"; 
            this.titleModal = this.locale.adminuser_edituser;
            let isSuperUser: string = obj['superUser']=='Y'?'Yes':'No';
            this.adminUserForm.controls.superUser.setValue(isSuperUser);
            this.adminUserForm.controls.name.setValue(obj['name']);
            this.adminUserForm.controls.login.setValue(obj['login']);
            let permissions:any = JSON.parse(obj['permissions']);
            let ctrlPermissions: FormArray = this.adminUserForm.controls.permissions;
            this.showForm = true;
            this.showModal(obj,"U");
            let oper = this.operationType;
            this.removeAllFormControl();
            this.removeAllFormControl();
            this.titleCheckAll = this.locale.adminuser_checkforall;
            $('#checkall').prop('checked',false);
            $("#"+this.modalId).on('shown.bs.modal', function (e) {
              if (oper == 'U'){
                $("input[name=permissions]").each( function () {
                  $(this).prop('checked',false);
                });
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
    this.carregaAdminUser(page,this.searchFor,this.searchName,this.searchName,this.sortObject);
  }

  updateAdminUser(id,form){
    
    this.spinnerService.showSpinner();
    let json = this.getPermissionAsJson();
    this.userService.updateAdminUser(id,form,json).subscribe(
      data => {
        this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchLogin,this.sortObject);
        this.spinnerService.hideSpinner();
        this.showConfirmation(this.locale.adminuser_theadminuser + " ["+form.name.value+"] "+ this.locale.commons_updatedsuccess + ".");
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
          this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchLogin,this.sortObject);
          this.showConfirmation(this.locale.adminuser_theadminuser + " ["+nameUser+"] "+ this.locale.commons_createdsuccess + ".");
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
    this.hideBtn = "NOK";
    this.hideAction = "YES";
    this.lablelButton=this.locale.commons_ok;
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
  goWelcome(){
    this.router.navigateByUrl('/');
  }

  getLocaleFromPermission(permission: string): string{
          if (permission === 'category'){
              return this.locale.menu_qa_categories;
          } else if (permission === 'question'){
              return this.locale.menu_qa_questions;
          } else if (permission === 'quiz'){
              return this.locale.menu_qa_quiz;
          } else if (permission === 'admin_user'){
              return this.locale.menu_users_admin;
          } else if (permission === 'app_user'){
              return this.locale.menu_users_app;
          } else if (permission === 'list_category'){
              return this.locale.permission_list_category;
          } else if (permission === 'create_category'){
              return this.locale.permission_create_category;
          } else if (permission === 'activate_category'){
              return this.locale.permission_activate_category;
          } else if (permission === 'inactivate_category'){
              return this.locale.permission_inactivate_category;
          } else if (permission === 'update_category'){
              return this.locale.permission_update_category;
          } else if (permission === 'list_question'){
              return this.locale.permission_list_question;
          } else if (permission === 'create_question'){
              return this.locale.permission_create_question;
          } else if (permission === 'activate_question'){
              return this.locale.permission_activate_question;
          } else if (permission === 'inactivate_question'){
              return this.locale.permission_inactivate_question;
          } else if (permission === 'update_question'){
              return this.locale.permission_update_question;
          } else if (permission === 'order_quiz'){
              return this.locale.permission_order_quiz;
          } else if (permission === 'preview_quiz'){
              return this.locale.permission_preview_quiz;
          } else if (permission === 'list_adminUser'){
              return this.locale.permission_list_adminUser;
          } else if (permission === 'create_adminUser'){
              return this.locale.permission_create_adminUser;
          } else if (permission === 'update_adminUser'){
              return this.locale.permission_update_adminUser;
          } else if (permission === 'inactivate_adminUser'){
              return this.locale.permission_inactivate_adminUser;
          } else if (permission === 'activate_adminUser'){
              return this.locale.permission_activate_adminUser;
          } else if (permission === 'unblocked_adminUser'){
              return this.locale.permission_unblocked_adminUser;
          } else if (permission === 'list_appUser'){
              return this.locale.permission_list_appUser;
          } else if (permission === 'detail_appUser'){
              return this.locale.permission_detail_appUser;
          } else if (permission === 'inactivate_appUser'){
              return this.locale.permission_inactivate_appUser;
          } else if (permission === 'activate_appUser'){
              return this.locale.permission_activate_appUser;
          } else if (permission === 'unblocked_appUser'){
              return this.locale.permission_unblocked_appUser;
          } else if (permission === 'dashboard'){
              return this.locale.permission_dashboard;
          }
  }

  changeItensPerPage(itens){
    this.sortObject.itensPerPage = itens;
    this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchLogin,this.sortObject);
  }

  changeSort(obj){
    this.sortObject = obj;
    this.carregaAdminUser(this.currentPage,this.searchFor,this.searchName,this.searchLogin,this.sortObject);
  }
}
