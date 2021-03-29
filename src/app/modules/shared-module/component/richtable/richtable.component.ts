import { Component, forwardRef, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/modules/login-module';
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


  @Output() emitterPage = new EventEmitter();
  @Output() deleteID = new EventEmitter();
  @Output() auditID = new EventEmitter();  
  @Output() editID = new EventEmitter();
  @Output() activateID = new EventEmitter();
  @Output() childID = new EventEmitter();

  
  submitted = false;
  errorMessage = '';
  currentPage : number = 0;

  colorTable: string = 'table-dark';
  colorTableHeader: string = 'thead-light'
  
  isLoggedIn = false;
  @Input() basicInfoForm: any;

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
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
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
}
