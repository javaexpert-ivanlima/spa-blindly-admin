import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/component/';
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
  columns : string[] = ['quizOrder','category','question','weight','isMultipleChoice','numberOfAnswers'];
  labels : string[] = ['order','category','name of question','weigth','multiple','answers'];
  rows: any[] = [];

  confirmButton: boolean = false;  

  operationType: string = null;
  modalId = "dialogConfirm";
  content = "<p>"+this.textParagraph1+"</p><p>"+this.textParagraph2+"</p>";

  showForm: boolean = false;
  quizOrderForm: any;

  itemList : any[];
  answersData: any[];
  answersCols: string[] = ['id','answer','weight','lastUpdateDate']; 
  answersLabels: string[] = ['id','answer','weight','lastUpdateDate']; 


  hideBtn: string = "NO";
  hideAction: string = "NO";
  locale: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private questionService: QuestionsService
    ) { 
      this.quizOrderForm = this.formBuilder.group({
        basicInfoForm: new FormGroup({
          items:new FormArray([])
        })
      });  
    }

  preview(){
      this.router.navigateByUrl('/quiz/preview');
  }   
  
  get f() { return this.quizOrderForm.controls; }
  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;
    //stop here if form is invalid
    if (this.quizOrderForm.invalid) {
            this.validation();
            return;
    }
    this.spinnerService.showSpinner();
    let questions: any = this.quizOrderForm.controls.basicInfoForm.controls.items.controls;
    let obj: any[] = [];
    questions.forEach(element => {
      obj.push({"questionId":element.controls.questionID.value,"order":element.controls.questionOrder.value});
    });

    this.questionService.setQuizOrder(obj).subscribe(
      data => {
        let result =   data.data;
        this.showConfirmation(this.locale.commons_updated + " "+ result + " " + this.locale.commons_recordswithsuccess);
        this.showModal("Z");
        this.carregaQuiz();
        this.spinnerService.hideSpinner();
      },
      err => {
        this.spinnerService.hideSpinner();
        this.hideModal();
        this.errorMessage =  this.spinnerService.handleError(err);
        if (this.errorMessage) this.showError(this.errorMessage);

      }
    );
  }
  ngOnInit(): void {
    this.hideBtn = "NO";
    //verificacao de sessao expirada
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
      this.locale = this.tokenStorage.getLocale();
      this.labels = this.locale.quiz_labels;
      this.title = this.locale.quiz_title;
      this.answersLabels = this.locale.answers_labels;
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
        if ( this.quizOrderForm.controls.basicInfoForm.get('items').length> 0){
          this.quizOrderForm.controls.basicInfoForm.controls.items = new FormArray([]);
        }
        if(this.rows.length > 0){
          this.rows.forEach(element => {
            this.quizOrderForm.controls.basicInfoForm.get('items').push(new FormGroup({
              questionID:new FormControl(element.id,[Validators.required]),
              questionOrder:new FormControl(element.quizOrder,[Validators.required])
            }))
          }); 
        }
      },
      err => {
        this.errorMessage =  this.spinnerService.handleError(err);
        if (this.errorMessage) this.showError(this.errorMessage);

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
    this.hideAction = "YES";
    this.hideBtn = "NOK";
    this.lablelButton=this.locale.commons_ok;
    this.bgColorTitle = "#6c757d!important"; 
    this.showForm = false;
    this.titleModal = this.locale.commons_sucess;
    this.textParagraph1 = "";
    this.textParagraph2 = text;
    this.content = "<strong>"+this.textParagraph1+""+this.textParagraph2+"</strong>";
    this.operationType ="Z";
  }


  hideModal(){
    $("#"+this.modalId).modal('hide');
  }

  showModal(operation){
    this.operationType = operation;
    $("#"+this.modalId).modal('show');

  }

  answers(obj){
    let answs: any[] = this.rows.filter((item) =>  item.id == obj.id)[0].answers;
    $("#"+this.modalId).modal('show');
    this.lablelButton=this.locale.commons_ok;
    this.hideAction="NO";
    this.hideBtn = "YES";
    this.bgColorTitle = "#a6c!important"; 
    this.showForm = true;
    this.titleModal = this.locale.question_answers;
    this.textParagraph1 = "";
    this.textParagraph2 = "";
    this.content = "";
    this.operationType ="Z";
    this.answersData = answs;

  }

  validation(){
    $("#"+this.modalId).modal('show');
    this.lablelButton="OK";
    this.hideBtn = "NOK";
    this.hideAction = "YES";
    this.bgColorTitle = "#dc3545!important"; 
    this.showForm = false;
    this.titleModal = this.locale.commons_validationerror;
    this.textParagraph1 = "";
    this.textParagraph2 = this.locale.commons_filloutallfields;
    this.content = "<strong>"+this.textParagraph1+""+this.textParagraph2+"</strong>";
    this.operationType ="Z";

  }

  showError(descerro){
    $("#"+this.modalId).modal('show');
    this.lablelButton="OK";
    this.hideBtn = "NOK";
    this.hideAction = "YES";
    this.bgColorTitle = "#dc3545!important"; 
    this.showForm = false;
    this.titleModal = this.locale.commons_validationerror;
    this.textParagraph1 = "";
    this.textParagraph2 = descerro;
    this.content = "<strong>"+this.textParagraph1+""+this.textParagraph2+"</strong>";
    this.operationType ="Z";

  }

}
