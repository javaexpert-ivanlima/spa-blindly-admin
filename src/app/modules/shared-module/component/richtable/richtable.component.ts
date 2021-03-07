import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/modules/login-module';
import { SpinnerShowService } from 'src/app/component/spinner';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-richtable',
  templateUrl: './richtable.component.html',
  styleUrls: ['./richtable.component.css']
})
export class RichtableComponent implements OnInit {
  
  @Input() title: string;
  @Input() tableCols: string[]  = [];
  @Input() tableLabels: string[]  = [];
  @Input() tableData: {}[] = [];
  @Input() pageable: any;

  @Output() emitterPage = new EventEmitter();
  @Output() deleteID = new EventEmitter();
  @Output() editID = new EventEmitter();
  @Output() activateID = new EventEmitter();
  @Output() childID = new EventEmitter();

  
  submitted = false;
  errorMessage = '';
  currentPage : number = 0;
  
  isLoggedIn = false;

  constructor(
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService
    ) { 
      
    }

    fakeArray(): Array<any> {
        return new Array(this.pageable.totalPages);
    }

  ngOnInit(): void {
    if (!this.tableLabels){
        this.tableLabels = this.tableCols;
    }
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
  }



  pageClick(page: number){
    this.currentPage = page;
    this.emitterPage.emit(this.currentPage);
  }

  
  deleteClick(id: number){
    this.deleteID.emit(id);
  }
  editClick(id: number){
    this.editID.emit(id);
  }
  activatedClick(id: number){
    this.activateID.emit(id);
  }
  accessChild(id: number){
    this.childID.emit(id);
  }
}
