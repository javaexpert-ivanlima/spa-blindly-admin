import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/modules/login-module';
import { SpinnerShowService } from 'src/app/component/spinner';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/modules/quiz-module/service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  submitted = false;
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

  selectedID: number = 0;
  operationType: string = null;
  modalId = "dialogConfirm";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService,
    private categoryService: CategoryService
    ) { 
      this.filterForm = this.formBuilder.group({
        filterType: new FormControl(),
        name: new FormControl()
      });
      this.filterForm.controls.filterType.setValue("all");
    }

  ngOnInit(): void {
    
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    this.carregaCategories(this.currentPage);
  
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
        this.inactivatedCategory(this.selectedID);
    }else if (this.operationType == "A"){
        this.activatedCategory(this.selectedID);
    }
    this.hideModal();
  }
  exclude(obj){
    this.titleModal = "Confirmation for exclusion";
    this.textParagraph2 = "The category ["+obj['nameCategory']+"] has "+ obj['numberOfQuestions']+" questions and all of them will be excluded.";
    this.showModal(obj['id'],"E");
  }

  activated(obj){
    this.titleModal = "Confirmation for activation";
    this.textParagraph2 = "The category ["+obj['nameCategory']+"] has "+ obj['numberOfQuestions']+" questions and all of them will be activated.";
    this.showModal(obj['id'],"A");
  }

  hideModal(){
    $("#"+this.modalId).modal('hide');
  }

  showModal(id,operation){
    this.operationType = operation;
    this.selectedID = id;
    $("#"+this.modalId).modal('show');

  }
  activatedCategory(id){
    this.spinnerService.showSpinner();
    this.categoryService.activatedCategory(id).subscribe(
      data => {
        this.carregaCategories(this.currentPage);
        this.spinnerService.hideSpinner();
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
            this.carregaCategories(this.currentPage);
            this.spinnerService.hideSpinner();
            this.confirmButton = false;
          },
          err => {
            this.handleError(err);
            this.confirmButton = false;
          }
    );

  }


  btnClick= function () {
    this.router.navigateByUrl('/categories/create');
  };
  
  onSubmit() {
    this.submitted = true;
    //stop here if form is invalid
    if (this.filterForm.invalid) {
            return;
    }
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

  handleError(err){
    
    if (err.error.errors){
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
