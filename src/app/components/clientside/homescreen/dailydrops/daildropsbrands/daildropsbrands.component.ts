import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-daildropsbrands',
  templateUrl: './daildropsbrands.component.html',
  styleUrls: ['./daildropsbrands.component.scss'],
})
export class DaildropsbrandsComponent implements OnInit {
  parameters: string = 'phone';
  operators: string = '==';
  searchvalue: string = "9876543210";
  isstorealreadyadded: boolean = false;

  ParaArr: Array<any> = [
    {
      Title: 'Store Phone Number',
      titvalue: 'phone',
    },
    {
      Title: 'Store Id',
      titvalue: 'id',
    },
  ];

  marchantColumns: string[] = [
    'MerchantId',
    'storename',
    'contact',
    'storetype',
    'city',
    'action',
  ];
  storelist: Array<any> = [];


  MerchantdataSource!: MatTableDataSource<any>;
  daildropDataId:string="";
  constructor(
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<DaildropsbrandsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public auth: AuthService
  ) {
  }

  ngOnInit(): void {
    if (this.data.selectednode != undefined) {
      // this.api
      //   .getstoreaspernode('dailydropsection', this.data.selectednode.id)
      //   .subscribe((data: any) => {
      //     this.storelist$ = of(data);
      //   });

        this.api
        .getstoreaspernode('DailydropSection', this.data.selectednode?.id)
        .pipe(take(1))
        .subscribe((data: any) => {
          this.daildropDataId = data[0]?.id;
        if (data[0].Stores.length > 0) {

          this.api
            .getStoresbyIds(data[0]?.Stores)
            .subscribe((data: any) => {
              this.storelist = data;
            });
          }
        });
    }
  }

  action(data: any) {
    // data.city_id = this.data.cityid;
    // data.nodeid = this.data.selectednode == undefined ? this.data.node.id : this.data.selectednode.id;
    // data.sectionname = 'dailydropsection';
    // this.api.addstorewithnodeid(data).then((data:any)=>{
    //   this.isstorealreadyadded = true;
    //   this.auth.resource.startSnackBar("store added");
    // });
    if (this.isstorealreadyadded == true) {
      if (this.storelist.length == 1) {
        this.api.deletestoresectiondata(this.daildropDataId).then(() => {
          this.storelist = [];
          this.close();
        });
      } else {
        this.api
          .AddORRemoveSectionStores(2, data.id, this.daildropDataId)
          .then(() => {
            let i = this.storelist.findIndex((x: any) => x.id == data.id);
            this.storelist.splice(i, 1);
          });
      }
      this.isstorealreadyadded = false;
    } else {
      if (this.data.selectednode != undefined) {
        this.api
          .AddORRemoveSectionStores(1, data.id, this.daildropDataId)
          .then(() => {
            this.storelist.push(data);
          });
      } else {
        let datas = {
          Stores: [data.id],
          C_Date: this.api.newTimestamp,
          M_Date: this.api.newTimestamp,
          SectionName: 'DailydropSection',
          CityId: this.data.cityid,
          NodeId:
            this.data.selectednode == undefined
              ? this.data.node.id
              : this.data.selectednode.id,
        };
        this.api.adddatatosectionstore(datas).then(() => {
          this.storelist.push(data);
          this.auth.resource.startSnackBar('Store Added');
        });
      }
      this.isstorealreadyadded = true;
    }
  }

  close() {
    this.dialogRef.close();
  }

  ApplyFilter() {
    this.isstorealreadyadded = false;
    this.api
      .getRecentStores(
        1,
        false,
        this.parameters,
        this.operators,
        this.searchvalue
      )
      .pipe(take(1))
      .subscribe((recentStore: any) => {
        if(recentStore.length == 0 ){
          this.auth.resource.startSnackBar('No Store found.');
        }
        else {
        this.MerchantdataSource = new MatTableDataSource(recentStore);
      }
      });
  }

  async takePicture(ratio:string,type: string, Storeid: string) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(ratio,imageUrl, type, Storeid);
    }
  }

  async startCropper(ratio:string,webPath: string, type: string, Storeid: string) {
    let isPhone = this.auth.resource.getWidth < 768;
    let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
    const refDialog = this.auth.resource.dialog.open(CropperComponent, {
      width: w,
      minWidth: '320px',
      maxWidth: '480px',
      height: '360px',
      data: { webPath: webPath, type: type,ratio:ratio },
      disableClose: true,
      panelClass: 'dialogLayout',
    });
    refDialog.afterClosed().subscribe(async (result) => {
      if (!result.success) {
        if (result.info) {
          this.auth.resource.startSnackBar(result.info);
        }
      } else {
        if (type == 'banner') {
          // this.api
          //   .updatestorewithnodebanner(id, result.croppedImage)
          //   .then((data: any) => {
          //     this.auth.resource.startSnackBar('banner uploaded');
          //   });
          this.api
          .updateSectionStorebanner(Storeid, result.croppedImage,'DailyDrop')
          .then((data: any) => {
            this.auth.resource.startSnackBar('banner uploaded');
          });
        }
      }
    });
  }

  deletestore(id: string) {
    // this.api.deletestorefromnodes(id).then((data: any) => {
    //   this.auth.resource.startSnackBar('store deleted');
    // });
    if (this.storelist.length == 1) {
      this.api.deletestoresectiondata(this.daildropDataId).then(() => {
        this.storelist = [];
        this.close();
      });
    } else {
      this.api.AddORRemoveSectionStores(2, id, this.daildropDataId).then(() => {
        let i = this.storelist.findIndex((x: any) => x.id == id);
        this.storelist.splice(i, 1);
      });
    }
  }
}
