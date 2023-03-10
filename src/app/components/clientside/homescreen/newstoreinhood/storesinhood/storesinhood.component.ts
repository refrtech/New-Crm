import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-storesinhood',
  templateUrl: './storesinhood.component.html',
  styleUrls: ['./storesinhood.component.scss']
})
export class StoresinhoodComponent implements OnInit {
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
  storelist: Array<any> = [];
  MerchantdataSource!: MatTableDataSource<any>;
  constructor(
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<StoresinhoodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.storelist = this.data.selectednode != undefined ? this.data.selectednode.stores : [];
  }

  ngOnInit(): void { }

  action(data: any) {
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

  ApplyFilter() {
    this.isstorealreadyadded = false;
    this.api.getRecentStores(1, false, this.parameters, this.operators, this.searchvalue).pipe(take(1)).subscribe((recentStore: any) => {
      this.MerchantdataSource = new MatTableDataSource(recentStore);
      this.isstorealreadyadded = this.storelist.findIndex((x) => x.id == recentStore[0].id) < 0 ? false : true;
    });
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
      this.api.addNSIYHstores(data, this.data.id).then((data: any) => {
        if (!data) {
          this.dialogRef.close();
        }
      });
    }
    else {
      let index = this.data.creatednodes.findIndex((x: any) => x.id == this.data.selectednode.id);
      this.data.creatednodes[index].stores = this.storelist;
      this.api.editNSIYHstores(this.data.creatednodes, this.data.id).then((data: any) => {
        if (!data) {
          this.dialogRef.close();
        }
      });
    }
  }

}
