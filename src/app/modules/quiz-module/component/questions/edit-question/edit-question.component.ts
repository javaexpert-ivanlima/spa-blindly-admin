import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/component/';
import { CategoryService, QuestionsService } from '../../../service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {

  questionForm: FormGroup;
  answerForm: FormGroup;
  itemList : any[];
  weightList: any[] = [{"id":1,"nameCategory":"1"},{"id":2,"nameCategory":"2"},{"id":3,"nameCategory":"3"},{"id":4,"nameCategory":"4"},{"id":5,"nameCategory":"5"},
  {"id":6,"nameCategory":"6"},{"id":7,"nameCategory":"7"},{"id":8,"nameCategory":"8"},{"id":9,"nameCategory":"9"},{"id":10,"nameCategory":"10"}];
  submitted = false;
  submittedRegister = false;
  errorMessage = '';  
  isLoggedIn = false;
  title : string = 'Edit Question';
  categorySelected: string = '';
  weightSelected: string = '';
  weightAnswerSelected: string = '';
  answersQty: number = 0;
  answersData: any[];
  rows: any[] = [];
  answersCols: string[] = ['answer','weight']; 
  answersLabels: string[] = ['answer','weight'];
  answerToBeDeleted: any;

  bgColorTitle="#ffc107!important"; 
  fgColorTitle="white";
  titleModal="Confirmation";
  textParagraph1="Are you totally sure about this operation?"
  textParagraph2="If not please close this confirmation, else if you are sure click on confirm button.";
  lablelButton="Confirm";
  operationType: string = null;
  modalId = "dialogQuestion";
  content = "<p>"+this.textParagraph1+"</p><p>"+this.textParagraph2+"</p>";
  isRegisterOk: boolean = false;
  showForm: boolean = false;
  hideBtn: string = "NO";
  selectedID: any = null;
  hideAction: string = "NO";
  locale: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private categoryService: CategoryService,
    private questionService: QuestionsService
  ) { 
    this.answerForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3),Validators.maxLength(200)]],
      weight: [null, [Validators.required]]
    });
    this.questionForm = this.formBuilder.group({
      multipleChoice: [ 'No', [Validators.required]],
      category: [null, [Validators.required]],
      questionID: [null, [Validators.required]],
      question: [null,[Validators.required,Validators.minLength(4)]],
      weight: [null, [Validators.required]],
      answers: [null,[Validators.required,Validators.min(2)]]
    });
    this.questionForm.controls.multipleChoice.setValue("No");
  }

  ngOnInit(): void {
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
      this.locale = this.tokenStorage.getLocale();
      this.title = this.locale.question_edit;      
      this.answersLabels = this.locale.editcreate_question_answersLabels;
    }else{
      this.spinnerService.hideSpinner();
      this.router.navigateByUrl('/login/authenticate');
    }   
    if (!this.spinnerService.getQuestionObject()?.row){
      this.spinnerService.hideSpinner();
      this.router.navigateByUrl('/questions/list');
    } 
    this.carregaCombobox();
    this.setupFields();
    this.spinnerService.hideSpinner();
  }

  backButton(){
    this.router.navigateByUrl('/questions/list');
  }

  async carregaCombobox() {
    this.spinnerService.showSpinner();
    this.categoryService.getAllActiveCategoriesNoPagination().subscribe(
      data => {
        this.spinnerService.hideSpinner();
        this.itemList = data.data;
      },
      err => {
        this.errorMessage =  this.spinnerService.handleError(err);
      }
    );
  }

  setupFields(){
    if (this.spinnerService.getQuestionObject()){
      let questionObj: any = this.spinnerService.getQuestionObject().row;
      this.questionForm.controls.questionID.setValue(questionObj.id);
      this.questionForm.controls.question.setValue(questionObj.question);
      this.questionForm.controls.category.setValue(questionObj.categoryId);
      this.categorySelected = questionObj.category;
      this.questionForm.controls.weight.setValue(questionObj.weight);
      this.weightSelected = questionObj.weight;      
      if (questionObj.isMultipleChoice == 'N'){
        this.questionForm.controls.multipleChoice.setValue('No');
      } else {
        this.questionForm.controls.multipleChoice.setValue('Yes');
      }
      this.rows = questionObj.answers;
      this.answersQty = questionObj.answers.length;
      this.questionForm.controls.answers.setValue(questionObj.answers.length);
    }else{
      this.router.navigateByUrl('/questions/list');
    }  
  }

  setupWeight(weight: any){
    if (weight){
      this.questionForm.controls.weight.setValue(weight.id);
      this.weightSelected = weight.nameCategory;
    }else{
      this.weightSelected = "";
      this.questionForm.controls.weight.setValue("");
    }
  }

  setupWeightAnswer(weight: any){
    if (weight){
      this.answerForm.controls.weight.setValue(weight.id);
      this.weightAnswerSelected = weight.nameCategory;
    }else{
      this.weightAnswerSelected = "";
      this.answerForm.controls.weight.setValue("");
    }
  }

  setupCategory(category: any){
    if (category){
      this.questionForm.controls.category.setValue(category.id);
      this.categorySelected = category.nameCategory;
    }else{
      this.categorySelected = "";
      this.questionForm.controls.category.setValue("");
    }
  }

  onSubmit() {
    this.submitted = true;
    this.submittedRegister = false;
    this.errorMessage = null;
    //stop here if form is invalid
    if (this.questionForm.invalid) {
            return;
    }
    this.spinnerService.setQuestionObject(null);
    this.spinnerService.showSpinner();
    let catId = this.questionForm.controls.category.value;
    let name = this.questionForm.controls.question.value;
    let weight = this.questionForm.controls.weight.value;
    let multiple = this.questionForm.controls.multipleChoice.value;
    let id = this.questionForm.controls.questionID.value;

    this.questionService.updateQuestion(id,catId,name,weight,multiple,this.rows).subscribe(
      data => {
        this.showConfirmationWithAction(this.locale.question_name + " ["+name+"] "+ this.locale.commons_updatedsuccess+".");
        this.showModal(null,"W");
      },
      err => {
        this.errorMessage =  this.spinnerService.handleError(err);
        this.hideModal();
      }
    );    
  }

 

  createAnswer(){
    
    this.spinnerService.showSpinner();
    let name = this.answerForm.controls.name.value;
    let weight = this.answerForm.controls.weight.value;
    this.rows.push({"answer":name,"weight":weight});
    this.answersQty = this.answersQty + 1;
    this.questionForm.controls.answers.setValue(this.answersQty);
    this.showConfirmation(this.locale.answer_name + " ["+name+"] " + this.locale.commons_addedsuccess + ".");
    this.spinnerService.hideSpinner();
    
  }

  deleteAnswer(){
    this.spinnerService.showSpinner();
    let name = this.answerToBeDeleted['answer'];
    this.rows.forEach((value,index)=>{
        if(value['answer']==name) this.rows.splice(index,1);
    });
    this.answersQty = this.answersQty - 1;
    if (this.answersQty < 0){
      this.answersQty = 0;
    }
    this.questionForm.controls.answers.setValue(this.answersQty);
    this.showConfirmation(this.locale.answer_name + " ["+name+"] "+ this.locale.commons_deletedsuccess+".");
    this.spinnerService.hideSpinner();
  }

  confirmOperation(){
    if (this.operationType == "E"){
        this.deleteAnswer();
    } else if (this.operationType == "C"){
        this.submittedRegister = true;
        this.submitted = false;
        this.errorMessage = null;
        if (this.answerForm.invalid) {
          return;
        }
        this.createAnswer();       
    } else if (this.operationType == "Z"){
      this.hideModal();
      this.hideBtn = "NO";
    } else if (this.operationType == "W"){
      this.hideModal();
      this.hideBtn = "NO";
      this.spinnerService.hideSpinner();
      this.router.navigateByUrl('/questions/list');
    }
    
  }

  showConfirmation(text){
    this.hideAction = "YES";
    this.hideBtn = "NO";
    this.lablelButton="OK";
    this.bgColorTitle = "#6c757d!important"; 
    this.showForm = false;
    this.titleModal = this.locale.commons_sucess;
    this.textParagraph1 = "";
    this.textParagraph2 = text;
    this.content = "<strong>"+this.textParagraph1+""+this.textParagraph2+"</strong>";
    this.operationType ="Z";
  }

  showConfirmationWithAction(text){
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
  exclude(obj){
    this.hideAction = "NO";
    this.lablelButton=this.locale.commons_delete;
    this.bgColorTitle = "#dc3545"; 
    this.showForm = false;
    this.textParagraph1=this.locale.commons_areyousure;
    this.titleModal = this.locale.commons_confirmexclusion;
    this.textParagraph2 = this.locale.answer_name + " ["+obj['answer']+"] " + this.locale.answer_willbeexcluded + ".";
    this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
    this.answerToBeDeleted = obj;
    this.showModal(obj,"E");
  }

  hideModal(){
    $("#"+this.modalId).modal('hide');
  }

  showModal(obj,operation){
    this.operationType = operation;
    this.selectedID = obj;
    $("#"+this.modalId).modal('show');

  }  

  addNew() {
    this.hideAction = "NO";
    this.submittedRegister = false;
    this.submitted = false;
    this.errorMessage = null;
    this.showForm = true;
    this.bgColorTitle = "#8c54a1!important"
    this.titleModal = this.locale.question_addanswer;
    this.lablelButton=this.locale.commons_create;
    this.weightAnswerSelected = "";
    this.answerForm.controls.name.setValue("");
    this.answerForm.controls.weight.setValue("");
    this.showModal(null,"C");
  }

  get f() { return this.questionForm.controls; }

  goWelcome(){
    this.router.navigateByUrl('/');
  }
}
