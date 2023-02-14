import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-visiteditstoredetails',
  templateUrl: './visiteditstoredetails.component.html',
  styleUrls: ['./visiteditstoredetails.component.scss'],
})
export class VisiteditstoredetailsComponent implements OnInit {
  parameters: string = '';
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings!: IDropdownSettings;

  ParaArr: Array<any> = [
    {
      Title: 'Enable',
      titvalue: '',
    },
    {
      Title: 'Disable',
      titvalue: '',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.dropdownList = [
      { item_id: 1, item_text: 'Vileparle East 400057' },
      { item_id: 2, item_text: 'Santacruz East 400056' },
      { item_id: 3, item_text: 'Santacruz East 400056' },
      { item_id: 4, item_text: 'Vileparle East 400057' },
      { item_id: 5, item_text: 'Santacruz East 400056' },
      { item_id: 6, item_text: 'Santacruz East 400056' },
    ];

    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
    };
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
}
