import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichtableComponent } from './component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalComponent } from './component';
import { ComboboxComponent } from './component';
import { DigitOnlyDirective } from 'src/app/helpers';
import { TimerComponent } from './component/';



@NgModule({
  declarations: [RichtableComponent, ModalComponent, ComboboxComponent,DigitOnlyDirective, TimerComponent],
  exports:[RichtableComponent,ModalComponent,ComboboxComponent,DigitOnlyDirective,TimerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class SharedModule { }
