import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-visitallstoredetails',
  templateUrl: './visitallstoredetails.component.html',
  styleUrls: ['./visitallstoredetails.component.scss'],
})
export class VisitallstoredetailsComponent implements OnInit {
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
  MerchantdataSource!: MatTableDataSource<any>;
  id: number = 0;
  nodestores$: Observable<any[]> = of();
  storelist: Array<any> = [];
  vsaDataid: string = '';
  constructor(
    public router: Router,
    public api: ApiserviceService,
    public auth: AuthService,
    public dialogRef: MatDialogRef<VisitallstoredetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    if (this.data.selectednode != undefined) {
      this.api
        .getstoreaspernode('VSAExternalSection', this.data.selectednode?.id)
        .pipe(take(1))
        .subscribe((data: any) => {
          this.vsaDataid = data[0]?.id;
          if (data[0]?.Stores.length > 0) {
            this.api.getStoresbyIds(data[0]?.Stores).subscribe((data: any) => {
              this.storelist = data;
            });
          }
        });
    }
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
        if (recentStore.length == 0) {
          this.auth.resource.startSnackBar('No Store Found.');
        } else {
          this.MerchantdataSource = new MatTableDataSource(recentStore);
        }
      });
  }

  action(data: any) {
    if (this.isstorealreadyadded == true) {
      if (this.storelist.length == 1) {
        this.api.deletestoresectiondata(this.vsaDataid).then(() => {
          this.storelist = [];
          this.close();
        });
      } else {
        this.api
          .AddORRemoveSectionStores(2, data.id, this.vsaDataid)
          .then(() => {
            let i = this.storelist.findIndex((x: any) => x.id == data.id);
            this.storelist.splice(i, 1);
          });
      }
      this.isstorealreadyadded = false;
    } else {
      if (this.storelist.length >= 10) {
        this.auth.resource.startSnackBar('Max limit 10.');
      } else {
        if (this.data.selectednode != undefined) {
          this.api
            .AddORRemoveSectionStores(1, data.id, this.vsaDataid)
            .then(() => {
              this.storelist.push(data);
            });
        } else {
          let datas = {
            Stores: [data.id],
            C_Date: this.api.newTimestamp,
            M_Date: this.api.newTimestamp,
            SectionName: 'VSAExternalSection',
            CityId: this.data.cityid,
            NodeId:
              this.data.selectednode == undefined
                ? this.data.node.id
                : this.data.selectednode.id,
          };
          this.api.adddatatosectionstore(datas).then((res: any) => {
            this.vsaDataid = res.id;
            this.data.selectednode = this.data.node;
            this.storelist.push(data);
            this.auth.resource.startSnackBar('Store Added');
          });
        }
        this.isstorealreadyadded = true;
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  async takePicture(ratio: string, type: string, Storeid: string) {
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
    Storeid: string
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
            .updateSectionStorebanner(Storeid, result.croppedImage, 'VSA')
            .then((data: any) => {
              this.auth.resource.startSnackBar('banner uploaded');
            });
        }
      }
    });
  }

  deletestore(id: string) {
    if (this.storelist.length == 1) {
      this.api.deletestoresectiondata(this.vsaDataid).then(() => {
        this.storelist = [];
        this.close();
      });
    } else {
      this.api.AddORRemoveSectionStores(2, id, this.vsaDataid).then(() => {
        let i = this.storelist.findIndex((x: any) => x.id == id);
        this.storelist.splice(i, 1);
      });
    }
  }
}
