import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/component/';
import { QuestionsService } from '../../../service';

@Component({
  selector: 'app-quiz-preview',
  templateUrl: './quiz-preview.component.html',
  styleUrls: ['./quiz-preview.component.css']
})
export class QuizPreviewComponent implements OnInit {

  title : string = 'quiz preview';
  modalId = "dialogConfirm";
  errorMessage = '';
  rows: any[] = [];

  //modal fields
  fgColorTitle:string;
  lablelButton:string;
  hideBtn:string;
  bgColorTitle:string; 
  titleModal:string;
  textParagraph1:string;
  textParagraph2:string;
  content:string;
  operationType: string = null;
  showForm: boolean = false;

  currentIndex:number = 0;
  locale: any;

  constructor(
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private questionService: QuestionsService
    ) { 
  }

  back(){
    this.router.navigateByUrl('/questions/quiz');
  }    

  nextQuestion(){
    this.currentIndex++;
    if (this.currentIndex> this.rows.length-1){
        this.currentIndex = this.rows.length-1;
    }
  }

  previousQuestion(){
    this.currentIndex--;
    if (this.currentIndex < 0){
        this.currentIndex = 0;
    }
  }

  getPercentual(){
    return (this.currentIndex+1)*100/this.rows.length;
  }

  ngOnInit(): void {
    //verificacao de sessao expirada
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
      this.locale = this.tokenStorage.getLocale();
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    //preenche lista
    this.carregaQuiz();
    this.spinnerService.hideSpinner();    
  }

  confirmOperation(){

  }

  carregaQuiz(){
    this.spinnerService.showSpinner();
    this.questionService.getQuizOrder().subscribe(
      data => {
        this.spinnerService.hideSpinner();
        this.rows =   data.data;
      },
      err => {
        this.errorMessage =  this.spinnerService.handleError(err);
        if (this.errorMessage) this.showError(this.errorMessage);

      }
    );

  }

  hideModal(){
    $("#"+this.modalId).modal('hide');
  }

  showModal(operation){
    this.operationType = operation;
    $("#"+this.modalId).modal('show');

  }

  showError(descerro){
    $("#"+this.modalId).modal('show');
    this.lablelButton="OK";
    this.hideBtn = "YES";
    this.bgColorTitle = "red!important"; 
    this.showForm = false;
    this.titleModal = "Validation error";
    this.textParagraph1 = "";
    this.textParagraph2 = descerro;
    this.content = "<strong>"+this.textParagraph1+""+this.textParagraph2+"</strong>";
    this.operationType ="Z";

  }

  goWelcome(){
    this.router.navigateByUrl('/');
  }
}
