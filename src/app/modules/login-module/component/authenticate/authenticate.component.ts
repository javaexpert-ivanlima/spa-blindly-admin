import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder , Validators, ReactiveFormsModule, FormsModule} from  '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SpinnerShowService } from 'src/app/component/spinner';

import { Login } from '../../model';
import { AuthenticateService, TokenStorageService } from '../../service';


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

  public dataObsevable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticateService,
    private tokenStorage: TokenStorageService,
    private spinnerService:SpinnerShowService
    ) {
    this.loginForm = this.formBuilder.group({
      password: [null, [
        Validators.required, 
        Validators.minLength(4)// ,
        //Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ]
    ],
      email: [null, [Validators.required, Validators.email]]
    });
    
  }
  
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
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
        this.tokenStorage.saveToken(data.data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.spinnerService.showLoginElements(true);
        this.spinnerService.hideSpinner();
      },
      err => {
        if (err.error && err.error.errors){
          this.errorMessage = err.error.errors.message  + " => ";
          let array = err.error.errors.errors;
          for (let i = 0; i < array.length; i++) {
            this.errorMessage =  this.errorMessage + array[i] + "  "; 
          }
        }else{
          if ( err.message.includes("Http failure response for")){
            this.errorMessage = "Http service unavailable";
          }else{
            this.errorMessage = err.message;
          }
          
        }
        
        this.isLoggedIn = false;
        this.isLoginFailed = true;
        this.spinnerService.hideSpinner();
      }
    );
  }

}



