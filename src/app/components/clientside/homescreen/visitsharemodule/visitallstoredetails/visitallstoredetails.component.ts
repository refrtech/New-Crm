import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
@Component({
  selector: 'app-visitallstoredetails',
  templateUrl: './visitallstoredetails.component.html',
  styleUrls: ['./visitallstoredetails.component.scss'],
})
export class VisitallstoredetailsComponent implements OnInit {
  parameters: string = "phone";
  operators: string = "==";
  searchvalue: string = "9876543210";
  isstorealreadyadded: boolean = false;
  ParaArr: Array<any> = [
    {
      Title: "Store Phone Number", titvalue: "phone",
    },
    {
      Title: "Store Id", titvalue: "id",
    }
  ];
  marchantColumns: string[] = [
    "MerchantId",
    "storename",
    "contact",
    "storetype",
    "city",
    "action"
  ];
  MerchantdataSource!: MatTableDataSource<any>;

  id: number = 0;
  nodestores$: Observable<any[]> = of();
  storedetails: Array<any> = [
    {
      storename: 'Dinshaws Xpress cafe',
      storetype: 'cafe',
    },
  ];

  constructor(public router: Router, public api: ApiserviceService) { }

  ngOnInit(): void { }

  addstorelink(adds: any) {
    // visit share earn
    if (this.router.url == '/storedetails/visitstoresection') {
      this.router.navigate(['/addstore/' + adds]);
    }
    // Brands in your neighbourhood
    if (this.router.url == '/storedetails/brandsallstore') {
      this.router.navigate(['/addstore/' + adds]);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }


  ApplyFilter() {
    this.isstorealreadyadded = false;
    this.api.getRecentStores(1, false, this.parameters, this.operators, this.searchvalue).pipe(take(1)).subscribe((recentStore: any) => {
      this.MerchantdataSource = new MatTableDataSource(recentStore);
      console.log(recentStore);
    });
  }

  action(data: any) {

  }

}
