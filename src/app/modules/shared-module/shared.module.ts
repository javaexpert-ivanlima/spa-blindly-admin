import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichtableComponent } from './component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalComponent } from './component';
import { ComboboxComponent } from './component';
import { DigitOnlyDirective } from 'src/app/helpers';
import { TimerComponent } from './component/';
import { CapitalizeFirstPipe } from 'src/app/helpers/CapitalizeFirstPipe';




@NgModule({
  declarations: [RichtableComponent, ModalComponent, ComboboxComponent,DigitOnlyDirective, TimerComponent,CapitalizeFirstPipe],
  exports:[RichtableComponent,ModalComponent,ComboboxComponent,DigitOnlyDirective,TimerComponent,CapitalizeFirstPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class SharedModule { }
