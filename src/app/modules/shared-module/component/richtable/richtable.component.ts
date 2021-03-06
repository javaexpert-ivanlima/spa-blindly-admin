import { Component, forwardRef, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/component/';
import { SpinnerShowService } from 'src/app/component/spinner';
import { EventEmitter } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';


@Component({
  selector: 'app-richtable',
  templateUrl: './richtable.component.html',
  styleUrls: ['./richtable.component.css'],
  providers: [
       {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichtableComponent),
      multi: true
    },
     {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RichtableComponent),
      multi: true
    }
  ]
})
export class RichtableComponent implements OnInit, ControlValueAccessor, Validator {
  
  @Input() hideActionColumn: string ;
  @Input() title: string;
  @Input() tableCols: string[]  = [];
  @Input() tableLabels: string[]  = [];
  @Input() tableData: any[] = [];
  @Input() pageable: any;
  @Input() onlyDeleteAction: string;
  @Input() adminModule: String;
  @Input() sortDirection: string;
  @Input() sortPosition: number;
  @Input() sortExclusion: number;
  @Input() basicInfoForm: any;

  @Output() emitterPage = new EventEmitter();
  @Output() deleteID = new EventEmitter();
  @Output() auditID = new EventEmitter();  
  @Output() editID = new EventEmitter();
  @Output() activateID = new EventEmitter();
  @Output() childID = new EventEmitter();
  @Output() unblockedID = new EventEmitter();
  @Output() emitterSort = new EventEmitter();
  @Output() emitterItensPerPage = new EventEmitter();

  tableLabelsDirections: string[]  = [];
  submitted = false;
  errorMessage = '';
  currentPage : number = 0;

  colorTable: string = 'table-dark';
  colorTableHeader: string = 'thead-light'
  
  isLoggedIn = false;
  sub: any;
  locale: any;
  sortName: string = "name";
  sort: any;
  itensPerPage: number = 6;

  constructor(
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService
    ) { 
  }

  fakeArray(): Array<any> {
        return new Array(this.pageable.totalPages);
  }

  ngOnInit(): void {
    if (!this.adminModule || this.adminModule != 'Y'){
        this.colorTable = 'table-dark';
        this.colorTableHeader = 'thead-light'
    } else {
      this.colorTable = 'table-info';
      this.colorTableHeader = 'thead-dark'
    }
    if (!this.tableLabels){
        this.tableLabels = this.tableCols;      
    }
    if (!this.sortDirection){
      this.sortDirection = "ASC";
    }
    if (!this.sortPosition){
      this.sortPosition = 0;
    }
    if (this.tableLabels){
      for(let cont = 0; cont < this.tableLabels.length;cont++){
            if (cont == this.sortPosition){
              this.tableLabelsDirections.push(this.sortDirection);
            }else{
              this.tableLabelsDirections.push("NONE");
            }
      }
    }

    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
       this.sub = this.tokenStorage.getSub(); 
       this.locale = this.tokenStorage.getLocale();
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
    

  }

  pageClick(page: number){
    this.currentPage = page;
    this.emitterPage.emit(this.currentPage);
  }
  
  deleteClick(id: any){
    this.deleteID.emit(id);
  }

  auditClick(id: any){
    this.auditID.emit(id);
  }

  editClick(id: number){
    this.editID.emit(id);
  }
  activatedClick(id: any){
    this.activateID.emit(id);
  }
  accessChild(obj: any){
    this.childID.emit(obj);
  }
  accessUnblocked(obj: any){
    this.unblockedID.emit(obj);
  }
  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    val && this.basicInfoForm.setValue(val, { emitEvent: false });
  }
  registerOnChange(fn: any): void {
    this.basicInfoForm.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.basicInfoForm.disable() : this.basicInfoForm.enable();
  }

  validate(c: AbstractControl): ValidationErrors | null{
    return this.basicInfoForm.valid ? null : { invalidForm: {valid: false, message: "basicInfoForm fields are invalid"}};
  }
  onChange(deviceValue) {
    this.itensPerPage = deviceValue;
    this.emitterItensPerPage.emit(deviceValue);
  }
  onClickColumn(column,value){
        if (this.tableLabelsDirections[value] == "ASC"){
          this.sortDirection = "DESC";
        }else{
          this.sortDirection = "ASC";
        }
        this.tableLabelsDirections[value]=this.sortDirection;
        this.sortName = value;
        for(let cont = 0; cont < this.tableLabels.length;cont++){
          if (value == cont){
            this.tableLabelsDirections[cont] = this.sortDirection
          }else{
            this.tableLabelsDirections[cont] = "NONE";
          }
    }
        this.emitterSort.emit({"sortName":this.sortName,"sortDirection":this.sortDirection,"sortColumn":column,"itensPerPage":this.itensPerPage});
  }
}
