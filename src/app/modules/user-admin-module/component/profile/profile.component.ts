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

  constructor(
    private spinner:SpinnerShowService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private userService: UserAdminService

  ) {
    this.adminUserForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      login: [null, [Validators.required, Validators.email]],
      password: [null, []],
      permissions: new FormArray([])
    });
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
    this.userService.updateAdminUserWithPassword(id,form,this.rows.permissions,this.rows.superUser).subscribe(
      data => {
        this.spinner.hideSpinner();
        //mostra modal
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
          console.log(this.rows);
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

  uploadPhoto(){
    alert('in construction');
  }

}
