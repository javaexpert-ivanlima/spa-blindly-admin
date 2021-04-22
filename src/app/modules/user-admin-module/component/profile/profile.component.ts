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
    labelButton:string = "Login page";
    hideBtn:string;
    bgColorTitle:string = "#8898aa!important"; 
    titleModal:string = "update profile";
    textParagraph1:string;
    textParagraph2:string;
    content:string = null;
    operationType: string = null;
    showForm: boolean = false;

   fileContent: any = null; 

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
    this.labelButton="OK";
    this.fgColorTitle = "white";
    this.bgColorTitle = "#8898aa!important"; 
    this.showForm = false;
    this.textParagraph1=""
    this.titleModal = "Update Profile";
    this.textParagraph2 = "["+name+"] your profile was updated with sucess.";
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

  ngOnInit(): void {
      //verificacao de sessao expirada
      this.spinner.showSpinner();
      if (this.tokenStorage.getToken()) {
        //todo guardar url atual
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
        this.tokenStorage.saveUser(this.rows);
        this.showDialog(form.name.value);
        },
      err => {
        this.  submittedRegister = true;
        this.errorMessage =  this.spinner.handleError(err);
      }
    );
    
  }

  close(){
    this.router.navigateByUrl('/');
  }

  getAdminUser(){
    this.spinner.showSpinner();
      this.userService.getAllAdminUsers(0,"active",null,this.tokenStorage.getSub()).subscribe(
        data => {
          this.spinner.hideSpinner();
          this.rows =   data.data.content[0];
          this.adminUserForm.controls.name.setValue(this.rows.name);
          this.adminUserForm.controls.login.setValue(this.rows.login);
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
          this.permissions =   data.data;
          },
        err => {
          this.errorMessage =  this.spinner.handleError(err);
        }
      ); 
  }

}
