import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCategoryComponent } from './component/list-category/list-category.component';
import { SpinnerComponent } from '../shared/component/spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TokenStorageService } from '../login';
import { CategoryService } from './service';




@NgModule({
  declarations: [
    ListCategoryComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    CategoryModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class CategoryModule { }
