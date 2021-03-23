import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/modules/login-module';
import { SpinnerShowService } from 'src/app/component/spinner';
import {  Router } from '@angular/router';
import { CategoryService } from 'src/app/modules/quiz-module/service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionsService } from '../../../service/questions.service';
declare var $: any 

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.css']
})
export class ListQuestionsComponent implements OnInit {

  bgColorTitle="#ffc107!important"; 
  fgColorTitle="white";
  titleModal="Confirmation";
  textParagraph1="Are you totally sure about this operation?"
  textParagraph2="If not please close this confirmation, else if you are sure click on confirm button.";
  lablelButton="Confirm";

  submitted = false;
  submittedRegister = false;
  errorMessage = '';
  
  isLoggedIn = false;
  title : string = 'questions';
  columns : string[] = ['id','question','active','weight','isMultipleChoice','numberOfAnswers','category','modifiedBy','lastUpdateDate'];
  labels : string[] = ['id','name of question','act','wt','multiple','ans','category','owner','update date'];
  rows: any[] = [];
  pageable: any;

  currentPage: number = 0;
  questionFilterForm: FormGroup;

  searchFor: string = null;
  searchName: string = null;
  searchCategory: number = null;
  categorySelected: string = '';
  countActiveCategories: number = 0;

  confirmButton: boolean = false;  

  selectedID: any = null;
  operationType: string = null;
  modalId = "dialogConfirm";
  content = "<p>"+this.textParagraph1+"</p><p>"+this.textParagraph2+"</p>";

  isRegisterOk: boolean = false;

  showForm: boolean = false;

  itemList : any[];

  stateCollapse: boolean = true;
  answersData: any[];
  answersCols: string[] = ['id','answer','weight','active','lastUpdateDate']; 

  hideBtn: string = "NO";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private categoryService: CategoryService,
    private questionService: QuestionsService
    ) { 
        this.questionFilterForm = this.formBuilder.group({
        filterType: [ 'all', [Validators.required]],
        filterCategory: [null, []],
        name: [null,[Validators.minLength(4)]]
      });
      this.questionFilterForm.controls.filterType.setValue("all");
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
    this.setupFilters();
    this.carregaCombobox();
    this.carregaQuestions(this.currentPage);
    this.countActCategories();
  }


  async countActCategories() {
    this.categoryService.getAllActiveCategoriesNoPagination().subscribe(
      data => {
        if (data.data){
            this.countActiveCategories = data.data.length;
        }else{
          this.countActiveCategories =0;
        }
      },
      err => {
        this.countActiveCategories = 0;
        this.handleError(err);
      }
    );
  }
  changeCollapseLabel(){
    
    if (this.stateCollapse){
        this.stateCollapse = false;
        $("#collapseQuestion").collapse('show');
    }else{
      this.stateCollapse = true;
      $("#collapseQuestion").collapse('hide');
    }
  }

  async carregaCombobox() {
    this.spinnerService.showSpinner();
    this.categoryService.getAllCategoriesNoPagination().subscribe(
      data => {
        this.spinnerService.hideSpinner();
        this.itemList = data.data;
      },
      err => {
        this.handleError(err);
      }
    );
  }
  
  setupCategory(category: any){
    if (category){
      this.questionFilterForm.controls.filterCategory.setValue(category.id);
      this.categorySelected = category.nameCategory;
    }else{
      this.categorySelected = "";
      this.questionFilterForm.controls.filterCategory.setValue("");
    }
  }

  setupFilters(){
       //se veio da tela de audit, popula os filtros que ja estavam como paginacao e campos da busca
      if (this.spinnerService.getQuestionObject()){
        this.currentPage = this.spinnerService.getQuestionObject().filter.page;
        this.searchFor = this.spinnerService.getQuestionObject().filter.searchFor;
        this.searchName = this.spinnerService.getQuestionObject().filter.searchName;
        this.searchCategory = this.spinnerService.getQuestionObject().filter.searchCategory;
        this.questionFilterForm.controls.filterType.setValue(this.searchFor?this.searchFor:"all");
        this.questionFilterForm.controls.name.setValue(this.searchName);
        this.questionFilterForm.controls.filterCategory.setValue(this.searchCategory);
        this.categorySelected = this.spinnerService.getQuestionObject().filter.categorySelected;
      }
  }
 
  carregaQuestions(page:number){
    this.spinnerService.showSpinner();
    this.questionService.getAllQuestionByCategory(page,this.searchFor,this.searchCategory,this.searchName).subscribe(
      data => {
        this.spinnerService.hideSpinner();
        this.rows =   data.data.content;
        this.pageable = {"page": data.data.pageable,"last":data.data.last,"first":data.data.first,"totalPages":data.data.totalPages,"pageNumber":data.data.number};
      },
      err => {
        this.handleError(err);
      }
    );

  }

  onSubmit() {
    this.submitted = true;
    this.submittedRegister = false;
    this.errorMessage = null;
    this.currentPage = 0;
    //stop here if form is invalid
    if (this.questionFilterForm.invalid) {
            return;
    }
    this.spinnerService.setQuestionObject(null);
    if (this.questionFilterForm.controls.name.value){
      this.searchName = this.questionFilterForm.controls.name.value;
    }else{
      this.searchName = null;  
    }
    if (this.questionFilterForm.controls.filterType.value){
      this.searchFor = this.questionFilterForm.controls.filterType.value;
    }else{
      this.searchFor = null;
    }
    if (this.questionFilterForm.controls.filterCategory.value){
      this.searchCategory = this.questionFilterForm.controls.filterCategory.value;
    }else{
      this.searchCategory = null;
    }
    this.carregaQuestions(this.currentPage);
  }


  displayPage(page) {
    this.currentPage = page;
    this.carregaQuestions(page);
  }

  confirmOperation(){
    if (this.operationType == "E"){
        this.inactivatedQuestion(this.selectedID['id']);
    }else if (this.operationType == "A"){
        this.activatedQuestion(this.selectedID['id']);
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
  activated(obj){
    this.lablelButton="Activate";
    this.bgColorTitle = "#a6c!important"; 
    this.showForm = false;
    this.titleModal = "Confirmation for activation";
    this.textParagraph2 = "The question ["+obj['question']+"] has "+ obj['numberOfAnswers']+" answers and all of them will be activated.";
    this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
    this.showModal(obj,"A");
  }

  exclude(obj){
    this.lablelButton="Delete";
    this.bgColorTitle = "#a6c!important"; 
    this.showForm = false;
    this.titleModal = "Confirmation for exclusion";
    this.textParagraph2 = "The question ["+obj['question']+"] has "+ obj['numberOfAnswers']+" answers and all of them will be excluded.";
    this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
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
  activatedQuestion(id){
    this.spinnerService.showSpinner();
    this.questionService.activatedQuestion(id).subscribe(
      data => {
        this.currentPage =0;
        this.carregaQuestions(this.currentPage);
        this.spinnerService.hideSpinner();
        this.showConfirmation("Question ["+this.selectedID['question']+"] was activated with sucess.");
      },
      err => {
        this.handleError(err);
        this.hideModal();
      }
    );
    
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


  audit(obj){
    this.spinnerService.setQuestionObject({"row":obj,"filter":{"page":this.currentPage,"searchFor":this.searchFor,"searchName":this.searchName,"searchCategory":this.searchCategory,"categorySelected":this.categorySelected}});
    //this.router.navigate(['/categories/audit/',obj['id'],obj['nameCategory']]);
    this.router.navigateByUrl('/questions/audit');
  }



  

  inactivatedQuestion(id){
    this.spinnerService.showSpinner();
    this.questionService.inactivatedQuestion(id).subscribe(
          data => {
            this.currentPage =0;
            this.carregaQuestions(this.currentPage);
            this.spinnerService.hideSpinner();
            this.showConfirmation("Question ["+this.selectedID['question']+"] was deleted with sucess.");
            this.confirmButton = false;
          },
          err => {
            this.handleError(err);
            this.confirmButton = false;
            this.hideModal();
          }
    );

  }

  edit(obj){
    this.spinnerService.setQuestionObject({"row":obj,"filter":{"page":this.currentPage,"searchFor":this.searchFor,"searchName":this.searchName,"searchCategory":this.searchCategory,"categorySelected":this.categorySelected}});
    this.router.navigateByUrl('/questions/edit');
  }

  addNew(){
    this.router.navigateByUrl('/questions/create');
  
  }

  get f() { return this.questionFilterForm.controls; }

  
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
