import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from 'src/app/auth.service';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';

@Component({
  selector: 'app-brandsstore',
  templateUrl: './brandsstore.component.html',
  styleUrls: ['./brandsstore.component.scss'],
})
export class BrandsstoreComponent implements OnInit {
  parameters: string = 'phone';
  operators: string = '==';
  searchvalue: string = '9876543210';
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
  BIYNDataId: string = '';
  constructor(
    public router: Router,
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<BrandsstoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    if (this.data.selectednode != undefined) {
      this.api
        .getstoreaspernode('BIYNSection', this.data.selectednode?.id).pipe(take(1))
        .subscribe((data: any) => {
          this.BIYNDataId = data[0]?.id;
          this.api
            .getStoresbyIds(data[0]?.Stores)
            .pipe(take(1))
            .subscribe((data: any) => {
              this.storelist = data;
            });
        });
    }
  }

  action(data: any) {
    if (this.isstorealreadyadded == true) {
      if (this.storelist.length == 1) {
        this.api.deletestoresectiondata(this.BIYNDataId).then(() => {
          this.storelist = [];
        this.close();

        });
      } else {
        this.api
          .AddORRemoveSectionStores(2, data.id, this.BIYNDataId)
          .then(() => {
            let i = this.storelist.findIndex((x: any) => x.id == data.id);
            this.storelist.splice(i, 1);
          });
      }
      this.isstorealreadyadded = false;
    } else {
      if (this.data.selectednode != undefined) {
        this.api
          .AddORRemoveSectionStores(1, data.id, this.BIYNDataId)
          .then(() => {
            this.storelist.push(data);
          });
      } else {
        let datas = {
          Stores: [data.id],
          C_Date: this.api.newTimestamp,
          M_Date: this.api.newTimestamp,
          SectionName: 'BIYNSection',
          CityId: this.data.cityid,
          NodeId:
            this.data.selectednode == undefined
              ? this.data.node.id
              : this.data.selectednode.id,
        };
        this.api.adddatatosectionstore(datas).then(() => {
          this.storelist.push(data);
          this.api.startSnackBar('Store Added');
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
        this.MerchantdataSource = new MatTableDataSource(recentStore);

        let index = this.storelist.findIndex(
          (x: any) => x.id == recentStore[0].id
        );
        if (index == 0) {
          this.isstorealreadyadded = true;
        }
      });
  }

  async takePicture(ratio: string, type: string, Storeid: string,) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(ratio, imageUrl, type, Storeid);
    }
  }

  async startCropper(
    ratio: string,
    webPath: string,
    type: string,
    Storeid: string,
  ) {
    let isPhone = this.auth.resource.getWidth < 768;
    let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
    const refDialog = this.auth.resource.dialog.open(CropperComponent, {
      width: w,
      minWidth: '320px',
      maxWidth: '480px',
      height: '360px',
      data: { webPath: webPath, type: type, ratio: ratio },
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
          this.api
            .updatestorewithnodebanner(Storeid, result.croppedImage)
            .then((data: any) => {
              alert('banner uploaded');
            });
        }
      }
    });
  }

  deletestore(id: string) {
    // this.api.deletestorefromnodes(id).then((data: any) => {
    //   alert('store deleted');
    // });
    if (this.storelist.length == 1) {
      this.api.deletestoresectiondata(this.BIYNDataId).then(() => {
        this.storelist = [];
        this.close();
      });
    } else {
      this.api.AddORRemoveSectionStores(2, id, this.BIYNDataId).then(() => {
        let i = this.storelist.findIndex((x: any) => x.id == id);
        this.storelist.splice(i, 1);
      });
    }
  }
}
