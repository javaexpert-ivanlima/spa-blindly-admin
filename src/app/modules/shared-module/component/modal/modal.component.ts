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
  @Input() style: string;
  @Output() clickOK = new EventEmitter();
  @ViewChild('contentWrapper') content;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  buttonOK(){
    this.clickOK.emit();
  }
}
