import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/modules/login-module';
import { CategoryService, QuestionsService } from '../../../service';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent implements OnInit {
  questionForm: FormGroup;
  answerForm: FormGroup;
  itemList : any[];
  weightList: any[] = [{"id":1,"nameCategory":"1"},{"id":2,"nameCategory":"2"},{"id":3,"nameCategory":"3"},{"id":4,"nameCategory":"4"},{"id":5,"nameCategory":"5"},
  {"id":6,"nameCategory":"6"},{"id":7,"nameCategory":"7"},{"id":8,"nameCategory":"8"},{"id":9,"nameCategory":"9"},{"id":10,"nameCategory":"10"}];
  submitted = false;
  submittedRegister = false;
  errorMessage = '';  
  isLoggedIn = false;
  title : string = 'Create Question';
  categorySelected: string = '';
  weightSelected: string = '';
  weightAnswerSelected: string = '';
  searchCategory: number = null;
  answersQty: number = 0;
  answersData: any[];
  rows: any[] = [];
  answersCols: string[] = ['answer','weight']; 
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private categoryService: CategoryService,
    private questionService: QuestionsService
  ) { 
    this.answerForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      weight: [null, [Validators.required]]
    });
    this.questionForm = this.formBuilder.group({
      multipleChoice: [ 'No', [Validators.required]],
      category: [null, [Validators.required]],
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
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    this.carregaCombobox();

  }

  async carregaCombobox() {
    this.spinnerService.showSpinner();
    this.categoryService.getAllActiveCategoriesNoPagination().subscribe(
      data => {
        this.spinnerService.hideSpinner();
        this.itemList = data.data;
      },
      err => {
        this.handleError(err);
      }
    );
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

    this.questionService.createQuestion(catId,name,weight,multiple,this.rows).subscribe(
      data => {
        this.showConfirmation("Question ["+name+"] was created with sucess.");
        this.showModal(null,"W");
      },
      err => {
        this.handleError(err);
        this.hideModal();
      }
    );    
  }

 

  createAnswer(){
    
    this.spinnerService.showSpinner();
    let name = this.answerForm.controls.name.value;
    let weight = this.answerForm.controls.weight.value;
    this.rows.push({"answer":name.toUpperCase(),"weight":weight});
    this.answersQty = this.answersQty + 1;
    this.questionForm.controls.answers.setValue(this.answersQty);
    this.showConfirmation("Answer ["+name+"] was added with sucess.");
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
    this.showConfirmation("Answer ["+name+"] was deleted with sucess.");
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

  exclude(obj){
    this.lablelButton="Delete";
    this.bgColorTitle = "#a6c!important"; 
    this.showForm = false;
    this.titleModal = "Confirmation for exclusion";
    this.textParagraph2 = "The answer ["+obj['answer']+"] will be excluded.";
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
    this.submittedRegister = false;
    this.submitted = false;
    this.errorMessage = null;
    this.showForm = true;
    this.bgColorTitle = "#8c54a1!important"
    this.titleModal = "Add a answer";
    this.lablelButton="Create";
    this.answerForm.controls.name.setValue("");
    this.answerForm.controls.weight.setValue("");
    this.showModal(null,"C");
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


  get f() { return this.questionForm.controls; }

}
