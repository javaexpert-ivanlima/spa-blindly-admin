import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/component/';
import { SpinnerShowService } from 'src/app/component/spinner';
import {  Router } from '@angular/router';
import { CategoryService } from 'src/app/modules/quiz-module/service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionsService } from '../../../service/questions.service';
import { PermissionGuard } from 'src/app/helpers/permission.guard';
import { Observable } from 'rxjs';
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
  columns : string[] = ['id','category','question','active','weight','isMultipleChoice','numberOfAnswers','modifiedBy','lastUpdateDate'];
  labels : string[] = ['id','category','name of question','act','wt','multiple','ans','owner','update date'];
  rows: any[] = [];
  pageable: any;

  currentPage: number = 0;
  questionFilterForm: FormGroup;

  searchFor: string = "active";
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
  answersCols: string[] = ['id','answer','weight','lastUpdateDate']; 
  answersLabels: string[] = ['id','answer','weight','lastUpdateDate']; 

  hideBtn: string = "NO";
  hideAction: string = "NO";
  locale: any;
  sortObject: any = {"sortName":"name","sortDirection":"ASC","sortColumn":1,"itensPerPage":6};
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private guardian: PermissionGuard,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private categoryService: CategoryService,
    private questionService: QuestionsService
    ) { 
        this.questionFilterForm = this.formBuilder.group({
        filterType: [ 'active', [Validators.required]],
        filterCategory: [null, []],
        name: [null,[Validators.minLength(4)]]
      });
      this.questionFilterForm.controls.filterType.setValue("active");
    }

  ngOnInit(): void {
    this.hideBtn = "NO";
    //verificacao de sessao expirada
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
      this.locale = this.tokenStorage.getLocale();
      this.title = this.locale.menu_qa_questions;
      this.labels = this.locale.question_labels;
      this.answersLabels = this.locale.answers_labels;
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    //preenche lista
    this.setupFilters();
    this.carregaCombobox();
    this.carregaQuestions(this.currentPage,this.sortObject);
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
        this.errorMessage =  this.spinnerService.handleError(err);
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
        this.errorMessage =  this.spinnerService.handleError(err);
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
        this.questionFilterForm.controls.filterType.setValue(this.searchFor?this.searchFor:"active");
        this.questionFilterForm.controls.name.setValue(this.searchName);
        this.questionFilterForm.controls.filterCategory.setValue(this.searchCategory);
        this.categorySelected = this.spinnerService.getQuestionObject().filter.categorySelected;
      }
  }
 
  carregaQuestions(page:number,sort:any){
    this.spinnerService.showSpinner();
    this.questionService.getAllQuestionByCategory(page,this.searchFor,this.searchCategory,this.searchName,this.sortObject).subscribe(
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
      this.searchFor = "active";
    }
    if (this.questionFilterForm.controls.filterCategory.value){
      this.searchCategory = this.questionFilterForm.controls.filterCategory.value;
    }else{
      this.searchCategory = null;
    }
    this.carregaQuestions(this.currentPage,this.sortObject);
  }


  displayPage(page) {
    this.currentPage = page;
    this.carregaQuestions(page,this.sortObject);
  }

  confirmOperation(){
    if (this.operationType == "E"){
        this.inactivatedQuestion(this.selectedID['id']);
    }else if (this.operationType == "A"){
        this.activatedQuestion(this.selectedID['id']);
    } else if (this.operationType == "Z"){
      this.hideModal();
      this.hideBtn = "NO";
      this.hideAction = "NO";
    }
    
  }

  showConfirmation(text){
    this.hideBtn = "NO";
    this.hideAction = "YES";
    this.lablelButton="OK";
    this.bgColorTitle = "#6c757d!important"; 
    this.showForm = false;
    this.titleModal = this.locale.commons_sucess;
    this.textParagraph1 = "";
    this.textParagraph2 = text;
    this.content = "<strong>"+this.textParagraph1+""+this.textParagraph2+"</strong>";
    this.operationType ="Z";
  }
  activated(obj){
    (this.guardian.hasAccess('activate_question') as Observable<boolean>).subscribe(resp=>{
      if (resp){
        this.hideAction = "NO";
        this.lablelButton=this.locale.commons_activate;
        this.bgColorTitle = "#8c54a1!important";
        this.showForm = false;
        this.textParagraph1=this.locale.commons_areyousure;
        this.titleModal = this.locale.commons_confirmactivation;
        this.textParagraph2 = this.locale.question_msgdel1+" ["+obj['question']+"] "+this.locale.question_msgdel2+" "+obj['numberOfAnswers']+" "+ this.locale.question_msgact3;
      this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
        this.showModal(obj,"A");
      }
  });
  }

  exclude(obj){
    (this.guardian.hasAccess('inactivate_question') as Observable<boolean>).subscribe(resp=>{
        if (resp){
          this.hideAction = "NO";
          this.lablelButton=this.locale.commons_delete;
          this.bgColorTitle = "#dc3545"; 
          this.showForm = false;
          this.textParagraph1=this.locale.commons_areyousure;
          this.titleModal = this.locale.commons_confirmexclusion;
          this.textParagraph2 = this.locale.question_msgdel1+" ["+obj['question']+"] "+this.locale.question_msgdel2+" "+obj['numberOfAnswers']+" "+ this.locale.question_msgdel3;
          this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
          this.showModal(obj,"E");     
        }
    });
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
        this.carregaQuestions(this.currentPage,this.sortObject);
        this.spinnerService.hideSpinner();
        this.showConfirmation(this.locale.question_msgdel1+" ["+this.selectedID['question']+"] "+ this.locale.commons_activatedsuccess + ".");
      },
      err => {
        this.errorMessage =  this.spinnerService.handleError(err);
        this.hideModal();
      }
    );
    
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
            this.carregaQuestions(this.currentPage,this.sortObject);
            this.spinnerService.hideSpinner();
            this.showConfirmation(this.locale.question_msgdel1+" ["+this.selectedID['question']+"] "+ this.locale.commons_deletedsuccess + ".");
            this.confirmButton = false;
          },
          err => {
            this.errorMessage =  this.spinnerService.handleError(err);
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

  goWelcome(){
    this.router.navigateByUrl('/');
  }

  changeItensPerPage(itens){
    this.sortObject.itensPerPage = itens;
    this.carregaQuestions(this.currentPage,this.sortObject);
  }

  changeSort(obj){
    this.sortObject = obj;
    this.carregaQuestions(this.currentPage,this.sortObject);
  }

}
