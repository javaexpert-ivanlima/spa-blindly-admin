import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichtableComponent } from './component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [RichtableComponent],
  exports:[RichtableComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class SharedModule { }
