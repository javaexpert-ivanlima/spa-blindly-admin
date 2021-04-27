import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/component';
import { SpinnerShowService } from 'src/app/component/spinner';
import { AuthenticateService } from '../../service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';
  isLoggedIn = false;
  isLoginFailed = false;
  selectedID: any;
  //modal
  modalId = "dialogConfirm";
  fgColorTitle:string = "white";
  labelButton:string = "Login page";
  hideBtn:string;
  bgColorTitle:string = "#8898aa!important"; 
  titleModal:string = "Forgot you password";
  textParagraph1:string;
  textParagraph2:string;
  content:string = null;
  operationType: string = null;
  showForm: boolean = false;
  locale: any;

  constructor(
    private spinnerService:SpinnerShowService,
    private service:AuthenticateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    let oldLang =  this.tokenStorage.getLanguage();
    window.sessionStorage.clear();
    this.tokenStorage.saveLanguage(oldLang);
    this.spinnerService.hideSpinner();
    //$("#menuContent").hide();
    $("#timeExpired").hide();
    this.locale = this.tokenStorage.getLocale();
  }

  goLogin(){
    this.router.navigateByUrl('/login/authenticate');
  }
  get f() { return this.loginForm.controls; }

  confirmOperation(){
    if (this.operationType == "L"){
      this.hideModal();
      this.goLogin();
    } 
    this.hideModal();
    this.hideBtn = "NO";

  }

  showDialog(email){
    this.labelButton= this.locale.forgotpassword_loginpage;
    this.fgColorTitle = "white";
    this.bgColorTitle = "#17a2b8!important"; 
    this.showForm = false;
    this.textParagraph1= this.locale.forgotpassword_instructionssend;
    this.titleModal = this.locale.login_forgotpassword;
    this.textParagraph2 = "["+email+"] "+ this.locale.forgotpassword_accountreset +".";
    this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
    this.showModal(email,"L");
  }

  hideModal(){
    $("#"+this.modalId).modal('hide');
  }

  showModal(obj,operation){
    this.operationType = operation;
    this.selectedID = obj;
    $("#"+this.modalId).modal('show');

  }
  onSubmit() {
    this.spinnerService.showSpinner();
    this.submitted = true;
    this.isLoginFailed = false;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
            this.spinnerService.hideSpinner ();
            return;
    }
    
    this.service.forgotPassword(this.loginForm.controls.email.value).subscribe(
      data => {
        this.spinnerService.hideSpinner();
        this.showDialog(this.loginForm.controls.email.value);
      },
      err => {
        this.isLoginFailed = true;
        this.errorMessage =  this.spinnerService.handleError(err);
        this.spinnerService.hideSpinner ();
      }
    );    
  }
}
