import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { StoresinhoodComponent } from './storesinhood/storesinhood.component';

@Component({
  selector: 'app-newstoreinhood',
  templateUrl: './newstoreinhood.component.html',
  styleUrls: ['./newstoreinhood.component.scss'],
})
export class NewstoreinhoodComponent implements OnInit {
  nodeColumns: string[] = ['node', 'no_stores', 'storename', 'date', 'action'];
  NSIYHTitle: string = "";
  NSIYHSTitle: string = "";
  editSubt: boolean = false;
  editTitle: boolean = false;
  Selectedcity: string = "";
  cityList$: Observable<any[]> = of();
  nodes$: Observable<any[]> = of();
  Selectednode: string = "";
  creatednodes: Array<any> = [];
  selectednodedata: any;
  NSIYHmoduledata:any = [];

  constructor(
    public dialog: MatDialog,
    public api: ApiserviceService,
  ) {}

  ngOnInit(): void {
    this.getNSIYHdata();
    this.getallcity();
  }

  allstores(creatednode?: any) {
    if (this.Selectedcity == "") {
      alert("please select city.");
    }
    else if (creatednode == undefined && this.Selectednode == "") {
      alert("please select node.")
    }
    else {
      const dialogRef = this.dialog.open(StoresinhoodComponent, {
        width: "90%",
        data: { node: this.selectednodedata, id: this.NSIYHmoduledata.id, selectednode: creatednode, creatednodes: this.creatednodes },
        hasBackdrop: true,
        disableClose: true,
        panelClass: 'thanksscreen'
      });
    }
  }

  getallcity() {
    this.cityList$ = this.api.getcity().pipe(take(1));
  }

  getNSIYHdata() {
    this.api.getNSIYHData().pipe(take(1)).subscribe((NSIYNdata: any) => {
      console.log(NSIYNdata);
      this.NSIYHmoduledata = NSIYNdata[0];
      this.NSIYHTitle = NSIYNdata[0].NSIYH_Title;
      this.NSIYHSTitle = NSIYNdata[0].NSIYH_STitle;
      this.creatednodes = NSIYNdata[0].Nodes;
    });
  }

  updateNSIYHTitle() {
    if (!this.editTitle) {
      this.editTitle = !this.editTitle;
    }
    else if (this.NSIYHTitle == this.NSIYHmoduledata.NSIYH_Title) {
      this.editTitle = !this.editTitle;
    }
    else {
      if (!this.NSIYHTitle) {
        alert("please enter the Title.");
      }
      else {
        this.api.updateNSIYHtitle(this.NSIYHTitle, this.NSIYHmoduledata.id).then((data) => {
          if (data != undefined) {
            this.editTitle = !this.editTitle;
            console.log("title updated");
          }
        }).catch(() => {
          return false;
        });
      }
    }
  }

  updateNSIYHTSTitle() {
    if (!this.editSubt) {
      this.editSubt = !this.editSubt;
    }
    else if (this.NSIYHSTitle == this.NSIYHmoduledata.NSIYH_STitle) {
      this.editSubt = !this.editSubt;
    }
    else {
      if (!this.NSIYHSTitle) {
        alert("please enter the sub Title.");
      }
      else {
        this.api.updateNSIYHStitle(this.NSIYHSTitle, this.NSIYHmoduledata.id).then((data) => {
          if (data != undefined) {
            console.log("Sub-title updated");
          }
        }).catch(() => {
          return false;
        });
      }
    }
  }


  citychange() {
    this.api.getNodeDataaspercity(this.Selectedcity).subscribe((data: any) => {
      let nodearr: Array<any> = [];
      for (let i = 0; i < data.length; i++) {
        let index = this.creatednodes.findIndex((x: any) => x.id == data[i].id);
        if (index < 0) {
          nodearr.push(data[i]);
        }
      }
      this.nodes$ = of(nodearr);
    })
  }

  //  adddata() {
  //   let data =
  //   {
  //     "VSA_Title": "Visit Share earn",
  //     "VSA_STitle": "This is sub-title of visit share earn",
  //     "Nodes": [
  //       {
  //         "name": "node 2",
  //         "city": "Mumbai ",
  //         "city_id": "4LicMMjSXrTz2hK070Wd",
  //         "created_at": {
  //           "seconds": 1676373287,
  //           "nanoseconds": 246000000
  //         },
  //         "updated_at": {
  //           "seconds": 1676373287,
  //           "nanoseconds": 246000000
  //         },
  //         "Nareas": [
  //           {
  //             "MDateTime": {
  //               "seconds": 1676362395,
  //               "nanoseconds": 932000000
  //             },
  //             "Area_Pin": "400049",
  //             "Area_N": "Vile Parle West ",
  //             "CDateTime": {
  //               "seconds": 1676362395,
  //               "nanoseconds": 932000000
  //             },
  //             "isaddedincity": false,
  //             "id": "0VXX94rv5It4opU5LZtZ"
  //           },
  //           {
  //             "Area_N": "Andheri West ",
  //             "CDateTime": {
  //               "seconds": 1676362456,
  //               "nanoseconds": 381000000
  //             },
  //             "Area_Pin": "400078",
  //             "id": "4PANO0b5yosU1i7liQEr",
  //             "MDateTime": {
  //               "seconds": 1676362456,
  //               "nanoseconds": 381000000
  //             },
  //             "isaddedincity": false
  //           }
  //         ],
  //         "id": "amQ2G9WhXMtZ9LP04teN",
  //         "stores": [
  //           {
  //             "cat": "fashion_brand",
  //             "log": {
  //               "seconds": 1648672299,
  //               "nanoseconds": 867000000
  //             },
  //             "longLinkB1": "https://refrclub.com/o/?link=https%3A%2F%2Fapp.refr.club%2Fb1%2F8B9ozj7aTPvywkIvVWiK&apn=club.refr.app&afl=https%3A%2F%2Fapp.refr.club%2Fb1%2F8B9ozj7aTPvywkIvVWiK&ibi=club.refr.app&ifl=https%3A%2F%2Fapp.refr.club%2Fb1%2F8B9ozj7aTPvywkIvVWiK&ofl=club.refr.app&st=Fit%20Foods&sd=Lorem%20ipsum%20dolor%20sit%20amet%2C%20consectetur%20adipiscing%20elit&si=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Frefr%2Fo%2Fstore%252F8B9ozj7aTPvywkIvVWiK1656593787215%3Falt%3Dmedia%26token%3D7cec8f94-bc20-4a14-92ee-c77e82ade5c8",
  //             "typeORDER": {
  //               "nationCharge": 10,
  //               "phoneHide": true,
  //               "exchange": false,
  //               "delivery": "Nationwide",
  //               "freeParcel": true,
  //               "logistics": false,
  //               "cityCharge": 10,
  //               "freeStart": 499,
  //               "refund": true,
  //               "COD": true,
  //               "return": true
  //             },
  //             "type": "Both",
  //             "schedule": {
  //               "openSatS": "06:00",
  //               "openFriS": "06:00",
  //               "openWedE": "19:00",
  //               "openThuE": "19:00",
  //               "openWed": true,
  //               "openMonS": "09:00",
  //               "openTueS": "06:00",
  //               "openFri": true,
  //               "openSunS": "06:00",
  //               "openBreak": false,
  //               "openThu": true,
  //               "openWedS": "06:00",
  //               "openBreakE": "15:00",
  //               "openBreakS": "11:00",
  //               "openTue": true,
  //               "opensDailyS": "10:00",
  //               "opensDailyE": "23:00",
  //               "opensDaily": false,
  //               "openFriE": "19:00",
  //               "openSunE": "19:00",
  //               "openThuS": "06:00",
  //               "openSatE": "19:00",
  //               "openTueE": "19:00",
  //               "openMon": true,
  //               "openMonE": "19:00",
  //               "openSat": true,
  //               "openSun": false
  //             },
  //             "vAte": 3208.1499999999996,
  //             "shareUrlV1": "https://refrclub.com/o/tobR",
  //             "GST": "123123123",
  //             "id": "8B9ozj7aTPvywkIvVWiK",
  //             "vGave": 4164.85,
  //             "addedDynamicLink": true,
  //             "banner": "https://firebasestorage.googleapis.com/v0/b/refr/o/store%2F8B9ozj7aTPvywkIvVWiK1664544112393?alt=media&token=d9cd0883-b09e-4a40-8d8c-ea636efbff9c",
  //             "proCat": [
  //               "gfjgjhgjhghjg",
  //               "hhkhkjhjk",
  //               "some category",
  //               "Dal",
  //               "Paneer",
  //               "Kolhapuri",
  //               "chocolate",
  //               "1"
  //             ],
  //             "longLinkP1": "https://refrclub.com/o/?link=https%3A%2F%2Fapp.refr.club%2Fp1%2F8B9ozj7aTPvywkIvVWiK&apn=club.refr.app&afl=https%3A%2F%2Fapp.refr.club%2Fp1%2F8B9ozj7aTPvywkIvVWiK&ibi=club.refr.app&ifl=https%3A%2F%2Fapp.refr.club%2Fp1%2F8B9ozj7aTPvywkIvVWiK&ofl=club.refr.app&st=Fit%20Food&sd=Lorem%20ipsum%20dolor%20sit%20amet%2C%20consectetur%20adipiscing%20elit&si=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Frefr%2Fo%2Fstore%252F8B9ozj7aTPvywkIvVWiK1656593787215%3Falt%3Dmedia%26token%3D7cec8f94-bc20-4a14-92ee-c77e82ade5c8",
  //             "name": "Fit Food",
  //             "shareUrlP1": "https://refrclub.com/o/EncD",
  //             "email": "dipeshbhoir@hotmail.com",
  //             "vOrdr": 192,
  //             "longLinkV1": "https://refrclub.com/o/?link=https%3A%2F%2Fapp.refr.club%2Fv1%2F8B9ozj7aTPvywkIvVWiK&apn=club.refr.app&afl=https%3A%2F%2Fapp.refr.club%2Fv1%2F8B9ozj7aTPvywkIvVWiK&ibi=club.refr.app&ifl=https%3A%2F%2Fapp.refr.club%2Fv1%2F8B9ozj7aTPvywkIvVWiK&ofl=club.refr.app&st=Fit%20Foods&sd=Lorem%20ipsum%20dolor%20sit%20amet%2C%20consectetur%20adipiscing%20elit&si=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Frefr%2Fo%2Fstore%252F8B9ozj7aTPvywkIvVWiK1656593787215%3Falt%3Dmedia%26token%3D7cec8f94-bc20-4a14-92ee-c77e82ade5c8",
  //             "phone": "9876543210",
  //             "cashback": 25,
  //             "by": "zn99lfRpB4bDy4KBvu4K1QpSMBk2",
  //             "banners": [
  //               "https://firebasestorage.googleapis.com/v0/b/refr/o/store%2F8B9ozj7aTPvywkIvVWiK1660791163789?alt=media&token=c790f623-7b8b-4791-9db2-903588eaecbb",
  //               "https://firebasestorage.googleapis.com/v0/b/refr/o/store%2F8B9ozj7aTPvywkIvVWiK1671023984210?alt=media&token=f549e45d-e7c6-4426-b7b5-0a7d30fde6b6"
  //             ],
  //             "shareUrlX1": "https://refrclub.com/o/WoQJ",
  //             "upd": {
  //               "seconds": 1676121909,
  //               "nanoseconds": 568000000
  //             },
  //             "logo": "https://firebasestorage.googleapis.com/v0/b/refr/o/store%2F8B9ozj7aTPvywkIvVWiK1664544103649?alt=media&token=cace74d2-365e-4906-8c4c-4cfcf199aa74",
  //             "products": 12,
  //             "about": "Fit Food has a wide range of products and / or services to cater to the varied requirements of their customers.",
  //             "sin": {
  //               "seconds": 1648672299,
  //               "nanoseconds": 867000000
  //             },
  //             "longLinkX1": "https://refrclub.com/o/?link=https%3A%2F%2Fapp.refr.club%2Fx1%2F8B9ozj7aTPvywkIvVWiK&apn=club.refr.app&afl=https%3A%2F%2Fapp.refr.club%2Fx1%2F8B9ozj7aTPvywkIvVWiK&ibi=club.refr.app&ifl=https%3A%2F%2Fapp.refr.club%2Fx1%2F8B9ozj7aTPvywkIvVWiK&ofl=club.refr.app&st=Fit%20Foods&sd=Lorem%20ipsum%20dolor%20sit%20amet%2C%20consectetur%20adipiscing%20elit&si=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Frefr%2Fo%2Fstore%252F8B9ozj7aTPvywkIvVWiK1656593787215%3Falt%3Dmedia%26token%3D7cec8f94-bc20-4a14-92ee-c77e82ade5c8",
  //             "subCat": "sc-fashion_brand-kids_fashion",
  //             "shareUrlB1": "https://refrclub.com/o/4Yif",
  //             "addedDynamicLinkP1": true,
  //             "loc": [
  //               {
  //                 "city": "Mumbai Suburban",
  //                 "line1": "Dipesadsadas sadasdas",
  //                 "nation": "IND",
  //                 "lon": 72.83105909999999,
  //                 "id": "IND_MH_1648672299398",
  //                 "lat": 19.0662066,
  //                 "line2": "",
  //                 "area": "Dent Heal",
  //                 "locality": "Mumbai",
  //                 "zip": "400050",
  //                 "region": "Maharashtra",
  //                 "state": "MH"
  //               },
  //               {
  //                 "zip": "400053",
  //                 "nation": "IND",
  //                 "region": "Maharashtra",
  //                 "lat": 19.134840193193707,
  //                 "line2": "",
  //                 "lon": 72.8213950683594,
  //                 "area": "26-2, Vidhneswar Temple Marg, Swastik Cooperative Housing Society, SV Patel Nagar, Andheri West, Mumbai, Maharashtra 400053, India",
  //                 "city": "Mumbai Suburban",
  //                 "line1": "sadas sadasdasd sdasdas",
  //                 "id": "IND_MH_1656024949912",
  //                 "state": "MH",
  //                 "locality": "Mumbai"
  //               }
  //             ],
  //             "vEarn": 64472,
  //             "vFan": 192
  //           }
  //         ]
  //       }
  //     ],
  //     "Mod_date": {
  //       "seconds": 1676546015,
  //       "nanoseconds": 370000000
  //     }
  //   }
  //   this.api.addNSIYH(data).then((data:any)=>{
  //     alert("data added.");
  //   })
  // }

}
