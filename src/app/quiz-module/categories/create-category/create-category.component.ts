import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/login-module';
import { SpinnerShowService } from 'src/app/spinner';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  submitted = false;
  errorMessage = '';
  
  isLoggedIn = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService
    ) {
    this.categoryForm = this.formBuilder.group({
      name: [null, [
        Validators.required, 
        Validators.minLength(4)// ,
        //Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ]
    ]
    });
   }

   ngOnInit(): void {
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.categoryForm.invalid) {
            return;
    }
  }  

  get f() { return this.categoryForm.controls; }
}
