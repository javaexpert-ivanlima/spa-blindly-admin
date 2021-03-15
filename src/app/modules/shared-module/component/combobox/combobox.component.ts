import {  AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.css']
})
export class ComboboxComponent implements OnInit,AfterViewInit {

    @Input() list: any[];
    @Input() placeholder: string;
    @Output() category = new EventEmitter();
    itemSelected: any;
    // two way binding for input text
    inputItem = '';
    // enable or disable visiblility of dropdown
    listHidden = true;
    showError = false;
    selectedIndex = -1;
    // the list to be shown after filtering
    filteredList: any[] = [];
    constructor() { }
    ngAfterViewInit() {
        if (this.list){
            this.filteredList = this.list;
        } 
      }
    ngOnInit() {}
    // modifies the filtered list as per input
    getFilteredList() {
        this.listHidden = false;
        if (!this.listHidden && this.inputItem !== undefined) {
            this.filteredList = this.list.filter((item) =>  item.nameCategory.toUpperCase().startsWith(this.inputItem.toUpperCase()));
    }
}
    // select highlighted item when enter is pressed or any item that is clicked
    selectItem(ind) {
        this.inputItem = ind < 0 ? '' :this.filteredList[ind].nameCategory;
        this.itemSelected = ind <0 ? null: this.filteredList[ind];
        this.listHidden = true;
        this.selectedIndex = ind;
        if (ind >=0) {
            this.accessCategory(this.itemSelected);
        }else{
            this.accessCategory(null);
        }    
    }
    // navigate through the list of items
    onKeyPress(event) {
        if (!this.listHidden) {
            if (event.key === 'Escape') {
                this.selectedIndex = -1;
                this.toggleListDisplay(0);
            }else if (event.key === 'Enter') {
                this.toggleListDisplay(0);
            }else if (event.key === 'ArrowDown') {
                this.listHidden = false;
                this.selectedIndex = (this.selectedIndex + 1) % this.filteredList.length;
                if (this.filteredList.length > 0 && !this.listHidden) {
                    document.getElementsByTagName('list-item')[this.selectedIndex].scrollIntoView();
                }
            } else if (event.key === 'ArrowUp') {
                this.listHidden = false;
                if (this.selectedIndex <= 0) {
                    this.selectedIndex = this.filteredList.length;
                }
                this.selectedIndex = (this.selectedIndex - 1) % this.filteredList.length;
                if (this.filteredList.length > 0 && !this.listHidden) {
                document.getElementsByTagName('list-item')[this.selectedIndex].scrollIntoView();
                }
            }
        }
    }
    // show or hide the dropdown list when input is focused or moves out of focus
    toggleListDisplay(sender: number) {
        if (sender === 1) {
            this.listHidden = false;
            this.getFilteredList();
        } else {
            // helps to select item by clicking
            setTimeout(() => {
                this.selectItem(this.selectedIndex);
                this.listHidden = true;
                if (!this.list.includes(this.itemSelected)) {
                    this.showError = true;
                    this.filteredList = this.list;
                } else {
                    this.showError = false;
                }
            }, 500);
        }
    }

    accessCategory(category: any){
        this.category.emit(this.itemSelected);
      }
}