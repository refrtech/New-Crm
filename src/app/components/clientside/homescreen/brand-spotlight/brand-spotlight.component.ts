import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { Camera } from '@capacitor/camera';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-brand-spotlight',
  templateUrl: './brand-spotlight.component.html',
  styleUrls: ['./brand-spotlight.component.scss'],
})
export class BrandSpotlightComponent implements OnInit {
  storeID = '';
  makingChanges = true;
  storeBanner = '';
  editSubt: boolean = false;
  editTitle: boolean = false;
  parameters: string = 'phone';
  operators: string = '==';
  searchvalue: string = '';
  brandspotT: string = '';
  brandspotST: string = '';
  selectedstores: Array<any> = [];
  BSmoduledata: any = [];
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
  constructor(public api: ApiserviceService, public auth: AuthService) {}

  ngOnInit(): void {
    this.getspotlightdata();
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
        let index = this.BSmoduledata.Stores.findIndex(
          (x: any) => x.id == recentStore[0].id
        );
        if (index == 0) {
          this.isstorealreadyadded = true;
        }
      });
  }

  getspotlightdata() {
    this.api.getspotlightdata().subscribe((data: any) => {
      this.BSmoduledata = data[0];
      this.brandspotT = this.BSmoduledata.BS_Title;
      this.brandspotST = this.BSmoduledata.BS_STitle;
    });
  }

  updateBSTitle() {
    if (!this.editTitle) {
      this.editTitle = !this.editTitle;
    } else if (this.brandspotT == this.BSmoduledata.BS_Title) {
      this.editTitle = !this.editTitle;
    } else {
      if (!this.brandspotT) {
        alert('please enter the Title.');
      } else {
        this.api
          .updateBStitle(this.brandspotT, this.BSmoduledata.id)
          .then((data) => {
            if (data != undefined) {
            }
          })
          .catch(() => {
            return false;
          });
      }
    }
  }

  updateBSSTitle() {
    if (!this.editSubt) {
      this.editSubt = !this.editSubt;
    } else if (this.brandspotST == this.BSmoduledata.BS_STitle) {
      this.editSubt = !this.editSubt;
    } else {
      if (!this.brandspotST) {
        alert('please enter the sub Title.');
      } else {
        this.api
          .updateBSStitle(this.brandspotST, this.BSmoduledata.id)
          .then((data) => {
            if (data != undefined) {
            }
          })
          .catch(() => {
            return false;
          });
      }
    }
  }

  action(data: any) {
    if (this.isstorealreadyadded == true) {
      this.api.removeBSstores(data, this.BSmoduledata.id);
      this.isstorealreadyadded = false;
    } else {
      this.api.addBSstores(data, this.BSmoduledata.id);
      this.isstorealreadyadded = true;
    }
  }

  async takePicture(ratio: string, type: string, index: number, item: any) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(ratio, imageUrl, type, index, item);
    }
  }

  async startCropper(
    ratio: string,
    webPath: string,
    type: string,
    sindex: number,
    item: any
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
        if (type == 'homeBanner') {
          this.api
            .updatebsbanner(
              this.BSmoduledata.id,
              result.croppedImage,
              this.BSmoduledata.Stores,
              sindex
            )
            .then((data) => {
              alert('banner updated');
            });
        }
      }
    });
  }
}
