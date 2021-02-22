import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder , Validators, ReactiveFormsModule, FormsModule} from  '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { Login } from '../shared/model';
import { AuthenticateService } from '../shared/service';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {
  loginForm: FormGroup;

  auth: Login;
  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(8)]],
      login: [null, [Validators.required, Validators.email]]
    });
    
  }
  
  ngOnInit(): void {
    this.auth = new Login();
    $("#navBarHorizontal").hide();
    $("#sidebar-wrapper").hide();
  }

  onSubmit() {
    console.log('Your form data : ', this.loginForm.value );
    Object.assign(this.auth,this.loginForm.value);
    console.log('Your model : ', this.auth );
}


}
