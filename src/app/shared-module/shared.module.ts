import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichtableComponent } from './component';



@NgModule({
  declarations: [RichtableComponent],
  exports:[RichtableComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
