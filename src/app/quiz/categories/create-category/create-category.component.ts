import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from 'src/app/login';
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
    private formBuilder: FormBuilder,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService
    ) {
      console.log("createComponent");
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
    console.log("createComponent oninit");
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.spinnerService.showLoginElements(true);

    }else{
      this.isLoggedIn = false;
      this.spinnerService.showLoginElements(false);
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
