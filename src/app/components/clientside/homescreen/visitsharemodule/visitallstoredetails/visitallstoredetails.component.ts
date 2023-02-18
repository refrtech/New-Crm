import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  searchvalue: string = "9833006431";//9833006431
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
  storelist: Array<any> = [];

  constructor(public router: Router, public api: ApiserviceService,
    public dialogRef: MatDialogRef<VisitallstoredetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log("---");
    console.log(this.data.creatednodes);
    this.storelist = this.data.selectednode != undefined ? this.data.selectednode.stores : [];
    console.log("---");
  }

  ngOnInit(): void { }


  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  //   else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }

  ApplyFilter() {
    this.isstorealreadyadded = false;
    this.api.getRecentStores(1, false, this.parameters, this.operators, this.searchvalue).pipe(take(1)).subscribe((recentStore: any) => {
      this.MerchantdataSource = new MatTableDataSource(recentStore);
      console.log(recentStore);
      this.isstorealreadyadded = this.storelist.findIndex((x) => x.id == recentStore[0].id) < 0 ? false : true;
    });
  }

  action(data: any) {
    //   let storess = [data];
    //   data = {
    //     Nareas: this.data.node.Nareas,
    //     city: this.data.node.city,
    //     city_id: this.data.node.city_id,
    //     created_at: this.data.node.created_at,
    //     id: this.data.node.id,
    //     name: this.data.node.name,
    //     stores: storess,
    //     updated_at: this.data.node.updated_at,
    //   }
    //   console.log(data);
    //   this.api.addVSAstores(data, this.data.id).then((data:any)=>{
    //     if(!data){
    //       // alert(error);
    //     }
    //   });

    let i = this.storelist.findIndex((x) => x.id == data.id);
    if (i < 0) {
      this.storelist.push(data);
      this.isstorealreadyadded = true;
    }
    else {
      this.storelist.splice(i, i + 1);
      this.isstorealreadyadded = false;
    }
  }

  close() {
    this.dialogRef.close();
  }

  updatestore() {
    if (this.data.selectednode == undefined) {
      let data = {
        Nareas: this.data.node.Nareas,
        city: this.data.node.city,
        city_id: this.data.node.city_id,
        created_at: this.data.node.created_at,
        id: this.data.node.id,
        name: this.data.node.name,
        stores: this.storelist,
        updated_at: this.data.node.updated_at,
      }
      console.log(data);
      this.api.addVSAstores(data, this.data.id).then((data: any) => {
        if (!data) {
          this.dialogRef.close();

          // alert(error);
        }
      });
    }
    else {
      console.log(this.data.selectednode.id);
      let index = this.data.creatednodes.findIndex((x: any) => x.id == this.data.selectednode.id);
      this.data.creatednodes[index].stores = this.storelist;
      this.api.editVSAstores(this.data.creatednodes, this.data.id).then((data: any) => {
        if (!data) {
          this.dialogRef.close();
          // alert(error);
        }
      });
      console.log(this.data.creatednodes);
    }
    // this.api.VSAupdatestore().then((data: any) => {
    // })
  }
}
