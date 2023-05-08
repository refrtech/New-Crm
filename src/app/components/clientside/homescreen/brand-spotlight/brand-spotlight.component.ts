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
  SectionTitle: string = '';
  SectionSTitle: string = '';
  selectedstores: Array<any> = [];
  BSmoduledata: any = [];
  BSmoduleStoredata: any = [];
  isstorealreadyadded: boolean = false;
  nodestoresid: string = '';
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
        if (recentStore.length == 0) {
          this.auth.resource.startSnackBar('No Store found.');
        } else {
          this.MerchantdataSource = new MatTableDataSource(recentStore);
          let index = this.BSmoduleStoredata.findIndex(
            (x: any) => x.id == recentStore[0].id
          );
          if (index == 0) {
            this.isstorealreadyadded = true;
          }
        }
      });
  }

  getspotlightdata() {
    this.api
      .getSectionData('BrandSpotLight')
      .pipe(take(1))
      .subscribe((data: any) => {
        this.BSmoduledata = data[0];
        this.SectionTitle = this.BSmoduledata.Section_title;
        this.SectionSTitle = this.BSmoduledata.Section_Stitle;
      });

    this.api
      .getSectionsdata('BrandspotLightSection')
      .pipe(take(1))
      .subscribe((data: any) => {
        this.nodestoresid = data[0].id;
        if (data[0].Stores.length > 0) {
          this.api
            .getStoresbyIds(data[0].Stores)
            .pipe(take(1))
            .subscribe((data: any) => {
              this.BSmoduleStoredata = data;
            });
        }
      });
  }

  updateSectionDetails(i: number) {
    if (i == 1 && !this.editTitle) {
      this.editTitle = !this.editTitle;
    } else if (i == 2 && !this.editSubt) {
      this.editSubt = !this.editSubt;
    } else if (i == 1 && this.SectionTitle == this.BSmoduledata.Section_title) {
      this.editTitle = !this.editTitle;
    } else if (
      i == 2 &&
      this.SectionSTitle == this.BSmoduledata.Section_Stitle
    ) {
      this.editSubt = !this.editSubt;
    } else {
      if (i == 1 && !this.SectionTitle) {
        this.auth.resource.startSnackBar('please enter the Title.');
      } else if (i == 2 && !this.SectionSTitle) {
        this.auth.resource.startSnackBar('please enter the sub Title.');
      } else {
        this.api
          .updateSectionData(
            i,
            this.BSmoduledata.SectionID,
            i == 1 ? this.SectionTitle : this.SectionSTitle
          )
          .then((data) => {
            if (data != undefined) {
              if (i == 1) {
                this.editTitle = !this.editTitle;
              } else {
                this.editSubt = !this.editSubt;
              }
            }
          })
          .catch(() => {
            return false;
          });
      }
    }
  }

  // updateBSTitle() {
  //   if (!this.editTitle) {
  //     this.editTitle = !this.editTitle;
  //   } else if (this.SectionTitle == this.BSmoduledata.BS_Title) {
  //     this.editTitle = !this.editTitle;
  //   } else {
  //     if (!this.SectionTitle) {
  //       this.auth.resource.startSnackBar('please enter the Title.');
  //     } else {
  //       this.api
  //         .updateBStitle(this.SectionTitle, this.BSmoduledata.id)
  //         .then((data) => {
  //           if (data != undefined) {
  //           }
  //         })
  //         .catch(() => {
  //           return false;
  //         });
  //     }
  //   }
  // }

  // updateBSSTitle() {
  //   if (!this.editSubt) {
  //     this.editSubt = !this.editSubt;
  //   } else if (this.brandspotST == this.BSmoduledata.BS_STitle) {
  //     this.editSubt = !this.editSubt;
  //   } else {
  //     if (!this.brandspotST) {
  //       this.auth.resource.startSnackBar('please enter the sub Title.');
  //     } else {
  //       this.api
  //         .updateBSStitle(this.brandspotST, this.BSmoduledata.id)
  //         .then((data) => {
  //           if (data != undefined) {
  //           }
  //         })
  //         .catch(() => {
  //           return false;
  //         });
  //     }
  //   }
  // }

  action(data: any) {
    if (this.isstorealreadyadded == true) {
      this.api
        .AddORRemoveSectionStores(2, data.id, this.nodestoresid)
        .then(() => {
          let i = this.BSmoduleStoredata.findIndex((x: any) => x.id == data.id);
          this.BSmoduleStoredata.splice(i, 1);
        });
      this.isstorealreadyadded = false;
    } else {
      this.api
        .AddORRemoveSectionStores(1, data.id, this.nodestoresid)
        .then(() => {
          this.BSmoduleStoredata.push(data);
        });
      this.isstorealreadyadded = true;
    }
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
        if (type == 'homeBanner') {
          this.api
            .updateSectionStorebanner(
              Storeid,
              result.croppedImage,
              'BrandSpotlight'
            )
            .then((data) => {
              this.auth.resource.startSnackBar('banner updated');
            });
        }
      }
    });
  }
}
