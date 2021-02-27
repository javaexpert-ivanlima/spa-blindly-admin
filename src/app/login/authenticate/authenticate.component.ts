import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder , Validators, ReactiveFormsModule, FormsModule} from  '@angular/forms';
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
  submitted = false;

  auth: Login;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder,private authService: AuthenticateService,private tokenStorage: TokenStorageService) {
    this.loginForm = this.formBuilder.group({
      password: [null, [
        Validators.required, 
        Validators.minLength(4)//,
        //Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ]
    ],
      email: [null, [Validators.required, Validators.email]]
    });
    
  }
  
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.showLoginElements(true);

    }else{
      this.auth = new Login();
      this.isLoggedIn = false;
      this.showLoginElements(false);
    }    
    

    
    console.log("isLoggedIn => " + this.isLoggedIn);
  }

  get f() { return this.loginForm.controls; }

  showLoginElements(show: boolean): void{
    if (show){
      $("#mainContent").css({backgroundImage : 'url(assets/imgs/background/pen-purple.png)'});
      $("#menuContent").show();    
      $("#login-modal").hide();
    }else{
      $("#menuContent").hide();
      $("#login-modal").show();
    }
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
            return;
    }
    //console.log('Your form data : ', this.loginForm.value );
    Object.assign(this.auth,this.loginForm.value);
    //console.log('Your model : ', this.auth );
    this.authService.login(this.auth).subscribe(
      data => {
        this.tokenStorage.saveToken(data.data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.showLoginElements(true);
      },
      err => {
        console.log( err.error);
        if (err.error.errors){
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
      }
    );
  }

}



