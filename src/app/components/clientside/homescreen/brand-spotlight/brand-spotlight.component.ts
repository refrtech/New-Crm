import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-brand-spotlight',
  templateUrl: './brand-spotlight.component.html',
  styleUrls: ['./brand-spotlight.component.scss']
})
export class BrandSpotlightComponent implements OnInit {
  editSubt: boolean = false;
  editTitle: boolean = false;
  parameters: string = "phone";
  operators: string = "==";
  searchvalue: string = "";
  brandspotT: string = "";
  brandspotST: string = "";
  selectedstores: Array<any> = [];
  BSmoduledata: any = [];
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
    this.getspotlightdata();
  }

  ApplyFilter() {
    this.isstorealreadyadded = false;
    this.api.getRecentStores(1, false, this.parameters, this.operators, this.searchvalue).pipe(take(1)).subscribe((recentStore: any) => {
      this.MerchantdataSource = new MatTableDataSource(recentStore);
      let index = this.BSmoduledata.Stores.findIndex((x: any) => x.id == recentStore[0].id);
      if (index == 0) {
        this.isstorealreadyadded = true;
      }
    });
  }

  getspotlightdata() {
    this.api.getspotlightdata().subscribe((data: any) => {
      console.log(data);
      this.BSmoduledata = data[0];
      this.brandspotT = this.BSmoduledata.BS_Title;
      this.brandspotST = this.BSmoduledata.BS_STitle;
    });
  }

  updateBSTitle() {
    if (!this.editTitle) {
      this.editTitle = !this.editTitle;
    }
    else if (this.brandspotT == this.BSmoduledata.BS_Title) {
      this.editTitle = !this.editTitle;
    }
    else {
      if (!this.brandspotT) {
        alert("please enter the Title.");
      }
      else {
        this.api.updateBStitle(this.brandspotT, this.BSmoduledata.id).then((data) => {
          if (data != undefined) {
            console.log("title updated");
          }
        }).catch(() => {
          return false;
        });
      }
    }
  }

  updateBSSTitle() {
    if (!this.editSubt) {
      this.editSubt = !this.editSubt;
    }
    else if (this.brandspotST == this.BSmoduledata.BS_STitle) {
      this.editSubt = !this.editSubt;
    }
    else {
      if (!this.brandspotST) {
        alert("please enter the sub Title.");
      }
      else {
        this.api.updateBSStitle(this.brandspotST, this.BSmoduledata.id).then((data) => {
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
      this.api.removeBSstores(data, this.BSmoduledata.id);
      this.isstorealreadyadded = false;
    }
    else {
      this.api.addBSstores(data, this.BSmoduledata.id);
      this.isstorealreadyadded = true;
    }
  }

}
