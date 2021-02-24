import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder , Validators, ReactiveFormsModule, FormsModule} from  '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { Login } from '../shared/model';
import { AuthenticateService, TokenStorageService } from '../shared/service';


@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {
  loginForm: FormGroup;

  auth: Login;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder,private authService: AuthenticateService,private tokenStorage: TokenStorageService) {
    this.loginForm = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(8)]],
      email: [null, [Validators.required, Validators.email]]
    });
    
  }
  
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      $("#navBarHorizontal").show();
      $("#sidebar-wrapper").show();
      $("#login-modal").hide();
      //this.roles = this.tokenStorage.getUser().roles;
    }else{
      $("#navBarHorizontal").hide();
      $("#sidebar-wrapper").hide();
      $("#login-modal").show();
      this.auth = new Login();
      this.isLoggedIn = false;
    }    
    

    
    console.log("isLoggedIn => " + this.isLoggedIn);
  }

  onSubmit() {
    console.log('Your form data : ', this.loginForm.value );
    Object.assign(this.auth,this.loginForm.value);
    console.log('Your model : ', this.auth );
    this.authService.login(this.auth).subscribe(
      data => {
        this.tokenStorage.saveToken(data.data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        $("#navBarHorizontal").show();
        $("#sidebar-wrapper").show();
        $("#login-modal").hide();
        //this.reloadPage();
      },
      err => {
        console.log( err.error);
        this.errorMessage = err.error.errors.message  + " => ";
        let array = err.error.errors.errors;
        for (let i = 0; i < array.length; i++) {
          this.errorMessage =  this.errorMessage + array[i] + "  "; 
        }
        this.isLoggedIn = false;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}



