import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/modules/login-module';
import { QuestionsService } from '../../../service';

@Component({
  selector: 'app-quiz-order',
  templateUrl: './quiz-order.component.html',
  styleUrls: ['./quiz-order.component.css']
})
export class QuizOrderComponent implements OnInit {

  bgColorTitle="#ffc107!important"; 
  fgColorTitle="white";
  titleModal="Confirmation";
  textParagraph1="Are you totally sure about this operation?"
  textParagraph2="If not please close this confirmation, else if you are sure click on confirm button.";
  lablelButton="Confirm";

  submitted = false;
  errorMessage = '';
  
  isLoggedIn = false;
  title : string = 'quiz order';
  columns : string[] = ['quizOrder','question','weight','isMultipleChoice','numberOfAnswers','category'];
  labels : string[] = ['order','name of question','weigth','multiple','answers','category'];
  rows: any[] = [];

  confirmButton: boolean = false;  

  operationType: string = null;
  modalId = "dialogConfirm";
  content = "<p>"+this.textParagraph1+"</p><p>"+this.textParagraph2+"</p>";

  showForm: boolean = false;

  itemList : any[];
  answersData: any[];
  answersCols: string[] = ['id','answer','weight','active','lastUpdateDate']; 

  hideBtn: string = "NO";

  constructor(
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private questionService: QuestionsService
    ) { 
    }

  ngOnInit(): void {
    this.hideBtn = "NO";
    //verificacao de sessao expirada
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    //preenche lista
    this.carregaQuiz();
  }


  carregaQuiz(){
    this.spinnerService.showSpinner();
    this.questionService.getQuizOrder().subscribe(
      data => {
        this.spinnerService.hideSpinner();
        this.rows =   data.data;
      },
      err => {
        this.handleError(err);
      }
    );

  }



  confirmOperation(){
    if (this.operationType == "E"){
        //this.inactivatedQuestion(this.selectedID['id']);
    }else if (this.operationType == "A"){
        //this.activatedQuestion(this.selectedID['id']);
    } else if (this.operationType == "Z"){
      this.hideModal();
      this.hideBtn = "NO";
    }
    
  }

  showConfirmation(text){
    this.hideBtn = "YES";
    this.lablelButton="OK";
    this.bgColorTitle = "#6c757d!important"; 
    this.showForm = false;
    this.titleModal = "Sucess";
    this.textParagraph1 = "";
    this.textParagraph2 = text;
    this.content = "<strong>"+this.textParagraph1+""+this.textParagraph2+"</strong>";
    this.operationType ="Z";
  }


  hideModal(){
    $("#"+this.modalId).modal('hide');
  }

  showModal(obj,operation){
    this.operationType = operation;
    //this.selectedID = obj;
    $("#"+this.modalId).modal('show');

  }

  answers(obj){
    let answs: any[] = this.rows.filter((item) =>  item.id == obj.id)[0].answers;
    $("#"+this.modalId).modal('show');
    this.lablelButton="OK";
    this.hideBtn = "YES";
    this.bgColorTitle = "#a6c!important"; 
    this.showForm = true;
    this.titleModal = "Answers";
    this.textParagraph1 = "";
    this.textParagraph2 = "";
    this.content = "";
    this.operationType ="Z";
    this.answersData = answs;

  }




  
  handleError(err){
    
    if (err.error && err.error.errors){
      this.errorMessage = err.error.errors.message ;
      if (err.error.errors.errors){
        this.errorMessage = this.errorMessage  + " => ";
        let array = err.error.errors.errors;
        for (let i = 0; i < array.length; i++) {
          this.errorMessage =  this.errorMessage + array[i] + "  "; 
        }
      }
    }else{
      if ( err.message.includes("Http failure response for")){
        this.errorMessage = "Http service unavailable";
      }else{
        this.errorMessage = err.message;
      }
      
    }
    this.spinnerService.hideSpinner();
  }

}
