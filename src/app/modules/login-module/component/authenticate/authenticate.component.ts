import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder , Validators, ReactiveFormsModule, FormsModule} from  '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TokenStorageService } from 'src/app/component';
import { SpinnerShowService } from 'src/app/component/spinner';

import { Login } from '../../model';
import { AuthenticateService } from '../../service';


@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  auth: Login;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  userName: string = null;

  public dataObsevable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthenticateService,
    private tokenStorage: TokenStorageService,
    private spinnerService:SpinnerShowService
    ) {
    this.loginForm = this.formBuilder.group({
      password: [null, [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern("(?=(.*[0-9]))(?=.*[\\!@#$%^&*()\\[\\]{}\\-_+=~`|:;\"\'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}")
      ]
    ],
      email: [null, [Validators.required, Validators.email]]
    });
    
  }
  
  ngOnInit(): void {
    this.spinnerService.hideSpinner();
    this.spinnerService.hideMainModal();
    if (this.tokenStorage.getToken()) {
      this.userName = this.tokenStorage.getSub();
      this.isLoggedIn = true;
      this.spinnerService.showLoginElements(true);

    }else{
      this.auth = new Login();
      this.isLoggedIn = false;
      this.spinnerService.showLoginElements(false);
    }    
    this.spinnerService.hideSpinner();
    this.spinnerService.hideMainModal();

  }

  goForgot(){
    this.router.navigateByUrl('/login/forgotpassword');
  }
  get f() { return this.loginForm.controls; }



  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
            return;
    }
    this.spinnerService.showSpinner();
    Object.assign(this.auth,this.loginForm.value);
    this.authService.login(this.auth).subscribe(
      data => {
        this.userName = this.auth.email;
        this.tokenStorage.saveToken(data.data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.spinnerService.hideSpinner();
        this.getAdminUser();
        this.spinnerService.showLoginElements(true);
      },
      err => {        
        this.errorMessage =  this.spinnerService.handleError(err);
        this.isLoggedIn = false;
        this.isLoginFailed = true;
        this.spinnerService.hideSpinner();
      }
    );
  }

  getAdminUser(){
    this.spinnerService.showSpinner();
      this.authService.getAdminUser(this.tokenStorage.getSub()).subscribe(
        data => {
          this.spinnerService.hideSpinner();
          this.tokenStorage.saveUser(data.data.content[0]);
          },
        err => {
          this.errorMessage =  this.spinnerService.handleError(err);
        }
      );
  }


}



