import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from 'src/app/auth.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-homegrowbrands',
  templateUrl: './homegrowbrands.component.html',
  styleUrls: ['./homegrowbrands.component.scss'],
})
export class HomegrowbrandsComponent implements OnInit {
  editSubt: boolean = false;
  editTitle: boolean = false;
  parameters: string = 'phone';
  operators: string = '==';
  searchvalue: string = '9876543210';
  SectionTitle: string = '';
  SectionSTitle: string = '';
  selectedstores: Array<any> = [];
  HGmoduledata: any = [];
  isstorealreadyadded: boolean = false;
  rowno: string = '1';

  First_Stores: Array<any> = [];
  Second_Stores: Array<any> = [];
  third_Stores: Array<any> = [];

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
  constructor(
    public api: ApiserviceService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.gethomegrowndata();
  }

  // addhomegrownbrand() {
  //   if (!this.homegrownT) {
  //     this.auth.resource.startSnackBar('please enter the Title.');
  //   } else if (!this.homegrownST) {
  //     this.auth.resource.startSnackBar('please enter the Sub-Title.');
  //   } else {
  //     let datas = {
  //       HG_Title: this.homegrownT,
  //       HG_STitle: this.homegrownST,
  //       CDateTime: this.api.newTimestamp,
  //       MDateTime: this.api.newTimestamp,
  //       Stores: this.selectedstores,
  //     };
  //     this.api
  //       .addstore_homegrown(datas)
  //       .then((data) => {
  //         if (data != undefined) {
  //           this.auth.resource.startSnackBar('city added');
  //         }
  //       })
  //       .catch(() => {
  //         return false;
  //       });
  //   }
  // }

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
          if (this.HGmoduledata != undefined) {
            let index;
            if (this.rowno == '1') {
              index = this.First_Stores?.findIndex(
                (x: any) => x.id == recentStore[0].id
              );
            } else if (this.rowno == '2') {
              index = this.Second_Stores?.findIndex(
                (x: any) => x.id == recentStore[0].id
              );
            } else {
              index = this.third_Stores?.findIndex(
                (x: any) => x.id == recentStore[0].id
              );
            }
            if (index >= 0) {
              this.isstorealreadyadded = true;
            }
          }
        }
      });
  }

  gethomegrowndata() {
    this.api
      .getSectionData('HomeGrown')
      .pipe(take(1))
      .subscribe((data: any) => {
        this.HGmoduledata = data[0];
        this.SectionTitle = this.HGmoduledata.Section_title;
        this.SectionSTitle = this.HGmoduledata.Section_Stitle;

        if (
          data[0].First_Stores != undefined &&
          data[0].First_Stores.length > 0
        ) {
          this.api
            .getStoresbyIds(data[0].First_Stores)
            .pipe()
            .subscribe((data: any) => {
              this.First_Stores = data;
            });
        }
        if (
          data[0].Second_Stores != undefined &&
          data[0].Second_Stores.length > 0
        ) {
          this.api
            .getStoresbyIds(data[0].Second_Stores)
            .pipe()
            .subscribe((data: any) => {
              this.Second_Stores = data;
            });
        }
        if (
          data[0].third_Stores != undefined &&
          data[0].third_Stores.length > 0
        ) {
          this.api
            .getStoresbyIds(data[0].third_Stores)
            .pipe()
            .subscribe((data: any) => {
              this.third_Stores = data;
            });
        }
      });
  }

  // updateHGTitle() {
  //   if (!this.editTitle) {
  //     this.editTitle = !this.editTitle;
  //   } else if (this.homegrownT == this.HGmoduledata.HG_Title) {
  //     this.editTitle = !this.editTitle;
  //   } else {
  //     if (!this.homegrownT) {
  //       this.auth.resource.startSnackBar('please enter the Title.');
  //     } else {
  //       this.api
  //         .updateHGtitle(this.homegrownT, this.HGmoduledata.id)
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

  // updateHGSTitle() {
  //   if (!this.editSubt) {
  //     this.editSubt = !this.editSubt;
  //   } else if (this.homegrownST == this.HGmoduledata.HG_STitle) {
  //     this.editSubt = !this.editSubt;
  //   } else {
  //     if (!this.homegrownST) {
  //       this.auth.resource.startSnackBar('please enter the sub Title.');
  //     } else {
  //       this.api
  //         .updateHGStitle(this.homegrownST, this.HGmoduledata.id)
  //         .then((data) => {
  //           this.editSubt = !this.editSubt;
  //         })
  //         .catch(() => {
  //           return false;
  //         });
  //     }
  //   }
  // }

  updateSectionDetails(i: number) {
    if (i == 1 && !this.editTitle) {
      this.editTitle = !this.editTitle;
    } else if (i == 2 && !this.editSubt) {
      this.editSubt = !this.editSubt;
    } else if (i == 1 && this.SectionTitle == this.HGmoduledata.Section_title) {
      this.editTitle = !this.editTitle;
    } else if (
      i == 2 &&
      this.SectionSTitle == this.HGmoduledata.Section_Stitle
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
            this.HGmoduledata.SectionID,
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

  action(datas: any, rowno?: string) {
    if (this.isstorealreadyadded == true || rowno != undefined) {
      this.api
        .updateHomeGrwonStoreData(
          false,
          rowno || '',
          this.HGmoduledata.SectionID,
          datas.id
        )
        .then((data: any) => {
          if (data != undefined) {
            if (rowno == '1') {
              let i = this.First_Stores.findIndex((x: any) => x.id == data.id);
              this.First_Stores.splice(i, 1);
            } else if (rowno == '2') {
              let i = this.Second_Stores.findIndex((x: any) => x.id == data.id);
              this.First_Stores.splice(i, 1);
            } else if (rowno == '3') {
              let i = this.third_Stores.findIndex((x: any) => x.id == data.id);
              this.First_Stores.splice(i, 1);
            }
          }
        });

      // if (rowno == '1') {
      //   this.api.removeHGFRstores(data, this.HGmoduledata.id);
      // } else if (rowno == '2') {
      //   this.api.removeHGSRstores(data, this.HGmoduledata.id);
      // } else if (rowno == '3') {
      //   this.api.removeHGTRstores(data, this.HGmoduledata.id);
      // }
      this.isstorealreadyadded = false;
    } else {
      if (
        (this.rowno == '1' && this.First_Stores.length >= 10) ||
        (this.rowno == '2' && this.Second_Stores.length >= 10) ||
        (this.rowno == '3' && this.third_Stores.length >= 10)
      ) {
        this.auth.resource.startSnackBar('Max limit 10.');
      } else {
        this.api
          .updateHomeGrwonStoreData(
            true,
            this.rowno || '',
            this.HGmoduledata.SectionID,
            datas.id
          )
          .then((data: any) => {
            if (data != undefined) {
              if (this.rowno == '1') {
                this.First_Stores.push(datas);
              } else if (this.rowno == '2') {
                this.Second_Stores.push(datas);
              } else if (this.rowno == '3') {
                this.third_Stores.push(datas);
              }
            }
          });

        this.isstorealreadyadded = true;
      }
    }
  }

  opnconfirmationpopup(item: string, row: string) {
    let isPhone = this.auth.resource.getWidth < 768;
    let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
    const refDialog = this.auth.resource.dialog.open(
      ConfirmationPopupComponent,
      {
        width: w,
        minWidth: '320px',
        maxWidth: '480px',
        height: '200px',
        data: 'Store',
        disableClose: true,
        panelClass: 'dialogLayout',
      }
    );
    refDialog.afterClosed().subscribe((result) => {
      if (!result.success) {
        if (result.info) {
          this.auth.resource.startSnackBar(result.info);
        }
      } else {
        // if (row == '1') {
        //   this.action(item, row);
        // } else if (row == '2') {
        //   this.action(item, row);
        // } else {
        this.action(item, row);
        // }
      }
    });
  }

  // async takePicture(ratio: string, type: string,Storeid:string) {
  //   const image = await Camera.getPhoto({
  //     quality: 100,
  //     height: 300,
  //     width: 300,
  //     allowEditing: false,
  //     resultType: CameraResultType.Uri,
  //   });
  //   const imageUrl = image.webPath || '';
  //   if (imageUrl) {
  //     this.startCropper(ratio, imageUrl, type,Storeid);
  //   }
  // }

  // startCropper(
  //   ratio: string,
  //   webPath: string,
  //   type: string,
  //   Storeid: string
  // ) {
  //   let isPhone = this.auth.resource.getWidth < 768;
  //   let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
  //   const refDialog = this.auth.resource.dialog.open(CropperComponent, {
  //     width: w,
  //     minWidth: '320px',
  //     maxWidth: '480px',
  //     height: '360px',
  //     data: { webPath: webPath, type: type, ratio: ratio },
  //     disableClose: true,
  //     panelClass: 'dialogLayout',
  //   });
  //   refDialog.afterClosed().subscribe((result) => {
  //     if (!result.success) {
  //       if (result.info) {
  //         this.auth.resource.startSnackBar(result.info);
  //       }
  //     } else {
  //       if (type == 'logo') {
  //         this.api
  //           .updateSectionStorebanner(
  //             Storeid,
  //             result.croppedImage,
  //             'BrandSpotlight'
  //           )
  //           .then((data) => {
  //             this.auth.resource.startSnackBar('banner updated');
  //           });
  //         // if (rowno == 1) {
  //         //   this.api
  //         //     .updatehomegrownFirststorelogo(
  //         //       result.croppedImage,
  //         //       this.HGmoduledata.First_Stores,
  //         //       index,
  //         //       this.HGmoduledata.SectionID
  //         //     )
  //         //     .then((ref: any) => {
  //         //       this.auth.resource.startSnackBar('Banner Update Under Review!');
  //         //     });
  //         // } else if (rowno == 2) {
  //         //   this.api
  //         //     .updatehomegrownSecondstorelogo(
  //         //       result.croppedImage,
  //         //       this.HGmoduledata.Second_Stores,
  //         //       index,
  //         //       this.HGmoduledata.SectionID
  //         //     )
  //         //     .then((ref: any) => {
  //         //       this.auth.resource.startSnackBar('Banner Update Under Review!');
  //         //     });
  //         // } else {
  //         //   this.api
  //         //     .updatehomegrownThirdstorelogo(
  //         //       result.croppedImage,
  //         //       this.HGmoduledata.third_Stores,
  //         //       index,
  //         //       this.HGmoduledata.SectionID
  //         //     )
  //         //     .then((ref: any) => {
  //         //       this.auth.resource.startSnackBar('Banner Update Under Review!');
  //         //     });
  //         // }
  //       }
  //     }
  //   });
  // }

  rowchange() {
    this.MerchantdataSource = new MatTableDataSource();
  }

  navigatecat() {
    this.router.navigateByUrl('HGBcatList');
  }
}
