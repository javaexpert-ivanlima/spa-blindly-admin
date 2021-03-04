import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/modules/login-module';
import { SpinnerShowService } from 'src/app/component/spinner';

@Component({
  selector: 'app-richtable',
  templateUrl: './richtable.component.html',
  styleUrls: ['./richtable.component.css']
})
export class RichtableComponent implements OnInit {
  
  @Input() title: string;
  @Input() tableCols: string[]  = [];
  @Input() tableData: {}[] = [];
  @Input() pageable: any;

  submitted = false;
  errorMessage = '';
  
  isLoggedIn = false;

  constructor(
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService
    ) { }
    


    fakeArray(): Array<any> {
        return new Array(this.pageable.totalPages);
    }

  ngOnInit(): void {
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      //this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
  }

  btnClick= function () {
    this.router.navigateByUrl('/categories/create');
};

}
