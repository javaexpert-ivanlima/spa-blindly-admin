import { AfterContentInit, Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() title: string;
  @Input() bgColorTitle: string;
  @Input() fgColorTitle: string;
  @Input() modalID: string;
  @Input() lblBtnOK: string;
  @Input() hideCloseBtn: string;
  @Input() style: string;
  @Input() adminModule: string;
  
  @Output() clickOK = new EventEmitter();
  @ViewChild('contentWrapper') content;

  buttonColor: string;

  constructor() { }

  ngOnInit(): void {
    if (!this.adminModule || this.adminModule != 'Y'){
          this.buttonColor = 'btn-purple';
    } else {
          this.buttonColor = 'btn-info';
    }
  }

  ngAfterViewInit() {
  }

  buttonOK(){
    this.clickOK.emit();
  }
}
