import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/modules/login-module';
import { SpinnerShowService } from 'src/app/component/spinner';
import {  Router } from '@angular/router';
import { CategoryService } from 'src/app/modules/quiz-module/service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
declare var $: any 

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {

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
  title : string = 'categories';
  columns : string[] = ['id','nameCategory','active','numberOfQuestions','modifiedBy','lastUpdateDate'];
  labels : string[] = ['id','category','active','questions','owner','update date'];
  rows: any[] = [];
  pageable: any;

  currentPage: number = 0;
  filterForm: FormGroup;

  searchFor: string = null;
  searchName: string = null;

  confirmButton: boolean = false;  

  selectedID: any = null;
  operationType: string = null;
  modalId = "dialogConfirm";
  content = "<p>"+this.textParagraph1+"</p><p>"+this.textParagraph2+"</p>";
  categoryForm: FormGroup;

  isRegisterOk: boolean = false;

  showForm: boolean = false;
  
  stateCollapse: boolean = true;
  hideBtn: string = "NO";


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private categoryService: CategoryService
    ) { 
      this.categoryForm = this.formBuilder.group({
        name: [null, [
          Validators.required, 
          Validators.minLength(4)// ,
          //Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
        ]
      ]
      });
      this.filterForm = this.formBuilder.group({
        filterType: new FormControl(),
        name: new FormControl()
      });
      this.filterForm.controls.filterType.setValue("all");
    }
    changeCollapseLabel(){
    
      if (this.stateCollapse){
          this.stateCollapse = false;
          $("#collapseCategory").collapse('show');
      }else{
        this.stateCollapse = true;
        $("#collapseCategory").collapse('hide');
      }
    }
  
  ngOnInit(): void {
    this.hideBtn = "NO";
    //se veio da tela de audit, popula os filtros que ja estavam como paginacao e campos da busca
    if (this.spinnerService.getCategoryObject()){
      this.currentPage = this.spinnerService.getCategoryObject().filter.page;
      this.searchFor = this.spinnerService.getCategoryObject().filter.searchFor;
      this.searchName = this.spinnerService.getCategoryObject().filter.searchName;
      this.filterForm.controls.filterType.setValue(this.spinnerService.getCategoryObject().filter.searchFor?this.spinnerService.getCategoryObject().filter.searchFor:"all");
      this.filterForm.controls.name.setValue(this.spinnerService.getCategoryObject().filter.searchName);
    }
    //verificacao de sessao expirada
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    
    //preenche lista
    this.carregaCategories(this.currentPage);
    this.spinnerService.hideSpinner();
  }

  carregaCategories(page: number) {
    this.spinnerService.showSpinner();
    this.categoryService.getAllCategories(page,this.searchFor,this.searchName).subscribe(
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
  displayPage(page) {
    this.currentPage = page;
    this.carregaCategories(page);
  }

  confirmOperation(){
    if (this.operationType == "E"){
        this.inactivatedCategory(this.selectedID['id']);
    }else if (this.operationType == "A"){
        this.activatedCategory(this.selectedID['id']);
    } else if (this.operationType == "C"){
        this.submittedRegister = true;
        this.submitted = false;
        this.errorMessage = null;
        if (this.categoryForm.invalid) {
          return;
        }
        this.createCategory(this.categoryForm.controls.name.value);       
    } else if ( this.operationType == "U"){
      this.submittedRegister = true;
      this.submitted = false;
      this.errorMessage = null;
      if (this.categoryForm.invalid) {
        return;
      }
      this.updateCategory(this.selectedID['id'],this.categoryForm.controls.name.value);       
    } else if (this.operationType == "Z"){
      this.hideModal();
      this.hideBtn = "NO";
    }
    
  }
  exclude(obj){
    this.lablelButton="Delete";
    this.bgColorTitle = "#007bff!important"; 
    this.showForm = false;
    this.titleModal = "Confirmation for exclusion";
    this.textParagraph2 = "The category ["+obj['nameCategory']+"] has "+ obj['numberOfQuestions']+" questions and all of them will be excluded.";
    this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
    this.showModal(obj,"E");
  }

  edit(obj){
    this.submittedRegister = false;
    this.submitted = false;
    this.errorMessage = null;
    this.lablelButton="Update";
    this.bgColorTitle = "#007bff!important"; 
    this.titleModal = "Edit category";
    this.categoryForm.controls.name.setValue(obj['nameCategory']);
    this.showForm = true;
    this.showModal(obj,"U");
  }

  audit(obj){
    this.spinnerService.setCategoryObject({"row":obj,"filter":{"page":this.currentPage,"searchFor":this.searchFor,"searchName":this.searchName}});
    //this.router.navigate(['/categories/audit/',obj['id'],obj['nameCategory']]);
    this.router.navigateByUrl('/categories/audit');
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
    this.bgColorTitle = "#007bff!important"; 
    this.showForm = false;
    this.titleModal = "Confirmation for activation";
    this.textParagraph2 = "The category ["+obj['nameCategory']+"] has "+ obj['numberOfQuestions']+" questions and all of them will be activated.";
    this.content = "<p>"+this.textParagraph1+"</p><strong>"+this.textParagraph2+"</strong>";
    this.showModal(obj,"A");
  }

  hideModal(){
    $("#"+this.modalId).modal('hide');
  }

  showModal(obj,operation){
    this.operationType = operation;
    this.selectedID = obj;
    $("#"+this.modalId).modal('show');

  }
  activatedCategory(id){
    this.spinnerService.showSpinner();
    this.categoryService.activatedCategory(id).subscribe(
      data => {
        this.currentPage =0;
        this.carregaCategories(this.currentPage);
        this.spinnerService.hideSpinner();
        this.showConfirmation("Category ["+this.selectedID['nameCategory']+"] was activated with sucess.");
      },
      err => {
        this.handleError(err);
        this.hideModal();
      }
    );
    
  }

  createCategory(category){
    
    this.spinnerService.showSpinner();
    this.categoryService.createCategory(category).subscribe(
      data => {
        this.carregaCategories(this.currentPage);
        this.spinnerService.hideSpinner();
        this.showConfirmation("Category ["+category+"] was created with sucess.");
      },
      err => {
        this.handleError(err);
      }
    );
    
  }

  updateCategory(id,category){
    
    this.spinnerService.showSpinner();
    this.categoryService.updateCategory(id,category).subscribe(
      data => {
        this.carregaCategories(this.currentPage);
        this.spinnerService.hideSpinner();
        this.showConfirmation("Category ["+category+"] was updated with sucess.");
      },
      err => {
        this.handleError(err);
      }
    );
    
  }

  inactivatedCategory(id){
    this.spinnerService.showSpinner();
    this.categoryService.inactivatedCategory(id).subscribe(
          data => {
            this.currentPage =0;
            this.carregaCategories(this.currentPage);
            this.spinnerService.hideSpinner();
            this.showConfirmation("Category ["+this.selectedID['nameCategory']+"] was deleted with sucess.");
            this.confirmButton = false;
          },
          err => {
            this.handleError(err);
            this.confirmButton = false;
            this.hideModal();
          }
    );

  }



  addNew() {
    this.submittedRegister = false;
    this.submitted = false;
    this.errorMessage = null;
    this.showForm = true;
    this.bgColorTitle = "#8c54a1!important"
    this.titleModal = "Create a new category";
    this.lablelButton="Create";
    this.categoryForm.controls.name.setValue(null);
    this.showModal(null,"C");
  };
  


  onSubmit() {
    this.submitted = true;
    this.submittedRegister = false;
    this.errorMessage = null;
    this.currentPage = 0;
    //stop here if form is invalid
    if (this.filterForm.invalid) {
            return;
    }
    this.spinnerService.setCategoryObject(null);
    if (this.filterForm.controls.name.value){
      this.searchName = this.filterForm.controls.name.value;
    }else{
      this.searchName = null;  
    }
    if (this.filterForm.controls.filterType.value){
      this.searchFor = this.filterForm.controls.filterType.value;
    }else{
      this.searchFor = null;
    }
    this.carregaCategories(this.currentPage);
  }

  get f() { return this.filterForm.controls; }

  get f2() { return this.categoryForm.controls; }

  questions(obj){
    this.spinnerService.setQuestionObject({"row":null,"filter":{"page":0,"searchFor":"all","searchName":"","searchCategory":obj.id,"categorySelected":obj.nameCategory}});
    this.router.navigateByUrl('/questions/list');
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
