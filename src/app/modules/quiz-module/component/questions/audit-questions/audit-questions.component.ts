import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/component/';
import {Location} from '@angular/common';
import { Observable } from 'rxjs';
import { QuestionsService } from '../../../service/';

@Component({
  selector: 'app-audit-questions',
  templateUrl: './audit-questions.component.html',
  styleUrls: ['./audit-questions.component.css']
})
export class AuditQuestionsComponent implements OnInit {

  private state$: Observable<object>;
  isLoggedIn = false;
  title : string = 'audit questions';
  labels : string[] = ['PK','update date','changed by','column','old value','new value'];
  columns : string[] = ['tablePK','changedDate','changedBy','columnName','oldValue','newValue'];
  rows: any[] = [];
  pageable: any = null;
  currentPage: number = 0;
  errorMessage = '';
  selectedID: number =0;
  selectedName: string;
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private questionService: QuestionsService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    //this.selectedID = this.route.snapshot.params.id;
    //this.selectedName = this.route.snapshot.params.name;
    if (!this.spinnerService.getQuestionObject()){
        this.router.navigateByUrl('/question/list');
    }
    this.selectedID = this.spinnerService.getQuestionObject().row.id;
    this.selectedName = this.spinnerService.getQuestionObject().row.question;

    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    this.carregaQuestionAudit(this.currentPage,this.selectedID);

  }

  backButton(){
    //this._location.back();
    this.router.navigateByUrl('/questions/list');
  }
  carregaQuestionAudit(page: number,id:number) {
    this.pageable = null;
    this.rows = null;
    this.title = "audit question - " + this.selectedName;
    this.spinnerService.showSpinner();
    this.questionService.getAuditQuestion(page,id).subscribe(
      data => {
        this.spinnerService.hideSpinner();
        this.rows =   data.data.content;
        this.pageable = {"page": data.data.pageable,"last":data.data.last,"first":data.data.first,"totalPages":data.data.totalPages,"pageNumber":data.data.number};
      },
      err => {
        this.errorMessage =  this.spinnerService.handleError(err);
      }
    );
  }
  displayPage(page) {
    this.currentPage = page;
    this.carregaQuestionAudit(page,this.selectedID);
  }


}
