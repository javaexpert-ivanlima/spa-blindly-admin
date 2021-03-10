import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  @Input() txtParagraph1: string;
  @Input() txtParagraph2: string;
  @Output() clickOK = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  buttonOK(){
    this.clickOK.emit();
  }
}
