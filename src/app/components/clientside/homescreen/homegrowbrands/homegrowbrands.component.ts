import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-homegrowbrands',
  templateUrl: './homegrowbrands.component.html',
  styleUrls: ['./homegrowbrands.component.scss']
})
export class HomegrowbrandsComponent implements OnInit {
  editSubt: boolean = false;
  editTitle: boolean = false;
  parameters: string = "phone";
  operators: string = "==";
  searchvalue: string = "9876543210";
  homegrownT: string = "";
  homegrownST: string = "";
  selectedstores: Array<any> = [];
  HGmoduledata: any = [];
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
  constructor(public api: ApiserviceService) { }

  ngOnInit(): void {
    this.gethomegrowndata();
  }

  addhomegrownbrand() {
    if (!this.homegrownT) {
      alert("please enter the Title.");
    }
    else if (!this.homegrownST) {
      alert("please enter the Sub-Title.");
    }
    else {
      let datas = {
        HG_Title: this.homegrownT,
        HG_STitle: this.homegrownST,
        CDateTime: this.api.newTimestamp,
        MDateTime: this.api.newTimestamp,
        Stores: this.selectedstores,
      }
      this.api.addstore_homegrown(datas).then((data) => {
        if (data != undefined) {
          alert("city added");
        }
      }).catch(() => {
        return false;
      });
    }
  }

  ApplyFilter() {
    this.isstorealreadyadded = false;
    this.api.getRecentStores(1, false, this.parameters, this.operators, this.searchvalue).pipe(take(1)).subscribe((recentStore: any) => {
      this.MerchantdataSource = new MatTableDataSource(recentStore);
      let index = this.HGmoduledata.Stores.findIndex((x: any) => x.id == recentStore[0].id);
      if (index == 0) {
        this.isstorealreadyadded = true;
      }
    });
  }

  gethomegrowndata() {
    this.api.gethomegrowndata().subscribe((data: any) => {
      this.HGmoduledata = data[0];
      this.homegrownT = this.HGmoduledata.HG_Title;
      this.homegrownST = this.HGmoduledata.HG_STitle;
    });
  }

  updateHGTitle() {
    if (!this.editTitle) {
      this.editTitle = !this.editTitle;
    }
    else if (this.homegrownT == this.HGmoduledata.HG_Title) {
      this.editTitle = !this.editTitle;
    }
    else {
      if (!this.homegrownT) {
        alert("please enter the Title.");
      }
      else {
        this.api.updateHGtitle(this.homegrownT, this.HGmoduledata.id).then((data) => {
          if (data != undefined) {
            console.log("title updated");
          }
        }).catch(() => {
          return false;
        });
      }
    }
  }

  updateHGSTitle() {
    if (!this.editSubt) {
      this.editSubt = !this.editSubt;
    }
    else if (this.homegrownST == this.HGmoduledata.HG_STitle) {
      this.editSubt = !this.editSubt;
    }
    else {
      if (!this.homegrownST) {
        alert("please enter the sub Title.");
      }
      else {

        this.api.updateHGStitle(this.homegrownST, this.HGmoduledata.id).then((data) => {
          if (data != undefined) {
            console.log("Sub-title updated");
          }
        }).catch(() => {
          return false;
        });
      }
    }
  }

  action(data: any) {
    if (this.isstorealreadyadded == true) {
      this.api.removeHGstores(data, this.HGmoduledata.id);
      this.isstorealreadyadded = false;
    }
    else {
      this.api.addHGstores(data, this.HGmoduledata.id);
      this.isstorealreadyadded = true;
    }
  }
}
