import { Component, Input, OnInit } from '@angular/core';
import { SpinnerShowService } from './service';


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  @Input() message = '';

  constructor(private spinnerService:SpinnerShowService) { }

  ngOnInit() {
  }

  
}
