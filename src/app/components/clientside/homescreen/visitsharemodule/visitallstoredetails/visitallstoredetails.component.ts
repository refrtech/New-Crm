import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-visitallstoredetails',
  templateUrl: './visitallstoredetails.component.html',
  styleUrls: ['./visitallstoredetails.component.scss'],
})
export class VisitallstoredetailsComponent implements OnInit {
  id: number = 0;

  storedetails: Array<any> = [
    {
      storename: 'Dinshaws Xpress cafe',
      storetype: 'cafe',
    },
  ];

  stores: Array<any> = [
    { S_name: 'Dinshaws Xpress cafe', Category: 'Cafe',Last_m:"23/2/2023" },
    { S_name: 'Mexichino', Category: 'Cafe',Last_m:"23/2/2023" },
    { S_name: 'UK14 Icecream', Category: 'Cafe',Last_m:"23/2/2023" },
  ]

  constructor(public router: Router) {}

  ngOnInit(): void {}

  addstorelink(adds: any) {
    // visit share earn
    if (this.router.url == '/storedetails/visitstoresection') {
      this.router.navigate(['/addstore/' + adds]);
    }
    // Brands in your neighbourhood

    if (this.router.url == '/storedetails/brandsallstore') {
      this.router.navigate(['/addstore/' + adds]);
    }
    console.log('click');
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  
}
