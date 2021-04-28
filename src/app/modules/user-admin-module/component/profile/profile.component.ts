import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerShowService, TokenStorageService } from 'src/app/component';
import { UserAdminService } from '../../service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  title = "profile";
  adminUserForm: any;
  submittedRegister = false;
  errorMessage = '';
  rows:any;
  permissions: any = null;
  permissionsByUser: any = null;
  selectedID:any;
    //modal
    modalId = "dialogConfirm";
    fgColorTitle:string = "white";
    labelButton:string = '';
    hideBtn:string;
    bgColorTitle:string = "#8898aa!important"; 
    titleModal:string = "";
    textParagraph1:string;
    textParagraph2:string;
    content:string = null;
    operationType: string = null;
    showForm: boolean = false;

   fileContent: any = null; 
   locale: any;
   hideAction: string = "NO";

  constructor(
    private spinner:SpinnerShowService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private userService: UserAdminService

  ) {
    this.adminUserForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      file: [null, []],
      login: [null, [Validators.required, Validators.email]],
      password: [null, [        Validators.minLength(8) ,
        Validators.pattern("(?=(.*[0-9]))(?=.*[\\!@#$%^&*()\\[\\]{}\\-_+=~`|:;\"\'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}")
]],
      permissions: new FormArray([])
    });
  }

  onFileChange(event) {
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
   
        this.fileContent = reader.result as string;
 
      };
   
    }
  }

  get f(){
    return this.adminUserForm.controls;
  }

  confirmOperation(){
    
    this.hideModal();
    this.hideBtn = "NO";

  }

  showDialog(name){
    this.hideAction = "YES";
    this.labelButton="OK";
    this.fgColorTitle = "white";
    this.bgColorTitle = "#8898aa!important"; 
    this.showForm = false;
    this.textParagraph1=""
    this.titleModal = this.locale.profile_update;
    this.textParagraph2 = "["+name+"] "+this.locale.profile_updatedsucess+".";
    this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
    this.showModal(name,"Z");
  }

  hideModal(){
    $("#"+this.modalId).modal('hide');
  }

  showModal(obj,operation){
    this.operationType = operation;
    this.selectedID = obj;
    $("#"+this.modalId).modal('show');

  }

  close(){
    this.router.navigateByUrl('/');
  }
  
  ngOnInit(): void {
      //verificacao de sessao expirada
      this.spinner.showSpinner();
      if (this.tokenStorage.getToken()) {
        //todo guardar url atual
        this.locale = this.tokenStorage.getLocale();
        this.getAdminUser();
        this.carregaPermissions();
      }else{
        this.router.navigateByUrl('/login/authenticate');
      }    
      this.spinner.hideSpinner();
  }

  onSubmit(){
    this.submittedRegister = true;
    //stop here if form is invalid
    if (this.adminUserForm.invalid) {
            return;
    }
    this.errorMessage = null;
    this.submittedRegister = false;
    this.spinner.setAdminUserObject(null);
    this.updateAdminUser(this.rows.id,this.adminUserForm.controls); 
  }
  
  updateAdminUser(id:number,form:any){
    this.spinner.showSpinner();
    this.userService.updateAdminUserWithPassword(id,form,this.rows.permissions,this.rows.superUser,this.fileContent).subscribe(
      data => {
        this.spinner.hideSpinner();
        this.rows = (data as any).data;
        this.showDialog(form.name.value);
        this.tokenStorage.saveUser(this.rows);
        },
      err => {
        this.  submittedRegister = true;
        this.errorMessage =  this.spinner.handleError(err);
      }
    );
    
  }

  getAdminUser(){
    this.spinner.showSpinner();
      this.userService.getAllAdminUsers(0,"active",null,this.tokenStorage.getSub()).subscribe(
        data => {
          this.spinner.hideSpinner();
          this.rows =   data.data.content[0];
          this.adminUserForm.controls.name.setValue(this.rows.name);
          this.adminUserForm.controls.login.setValue(this.rows.login);
          console.log(this.rows);
          this.permissionsByUser = JSON.parse(this.rows.permissions);
          },
        err => {
          this.  submittedRegister = true;
          this.errorMessage =  this.spinner.handleError(err);
        }
      );
  }

  carregaPermissions(){
    this.spinner.showSpinner();
      this.userService.getAllPermissions().subscribe(
        data => {
          this.spinner.hideSpinner();
          this.permissions =   data.data.permissions;
          },
        err => {
          this.errorMessage =  this.spinner.handleError(err);
        }
      ); 
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

}
