import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hgbnodecatstores',
  templateUrl: './hgbnodecatstores.component.html',
  styleUrls: ['./hgbnodecatstores.component.scss'],
})
export class HgbnodecatstoresComponent implements OnInit {
  selectedcat: string = '';
  Catthumbnail = '';
  Catbanner = '';
  HGBdata: any;
  editpeoplechoice: boolean = false;
  parameters: string = 'phone';
  parameters1: string = 'phone';
  operators: string = '==';
  searchvalue: string = '9876543210';
  searchvalue1: string = '9876543210';
  isstorealreadyadded: boolean = false;
  isstorealreadyadded1: boolean = false;
  MerchantdataSource!: MatTableDataSource<any>;
  MerchantdataSource1!: MatTableDataSource<any>;
  catindex: number = -1;
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

  ParaArr1: Array<any> = [
    {
      Title: 'Store Phone Number',
      titvalue: 'phone',
    },
    {
      Title: 'Store Id',
      titvalue: 'id',
    },
  ];

  peoplechoicecatpara: string = '';

  marchantColumns: string[] = [
    'MerchantId',
    'storename',
    'contact',
    'storetype',
    'city',
    'action',
  ];
  PChoiceStores: Array<any> = [];
  // trendingStores: Array<any> = [];
  constructor(
    public api: ApiserviceService,
    public actRoute: ActivatedRoute,
    public auth: AuthService,
    private router: Router,
    public Location: Location
  ) {}

  ngOnInit(): void {
    this.gethomegrowndata();
    this.api
      .getDataCat_Subcatdata('HomegrownInternalCatSection',this.actRoute.snapshot.params['catid'],'PeopleChoice')
      .subscribe((data: any) => {
        this.HGBdata = data[0];
        if(this.HGBdata != undefined){
          this.peoplechoicecatpara = data[0].Peoplechoicepara;
          this.api
            .getStoresbyIds(data[0]?.Stores)
            .subscribe((data: any) => {
              this.PChoiceStores = data;
            });
        }
        // this.PChoiceStores = data;
      });

    // this.api
    //   .getHgrowntrendingCatstores(this.actRoute.snapshot.params['catid'])
    //   .subscribe((data: any) => {
    //     this.trendingStores = data;
    //   });
  }

  navigatecat() {
    this.router.navigateByUrl(
      'HGBsubcatstores/' + this.actRoute.snapshot.params['catid']
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  ApplyFilter(i: number) {
    this.isstorealreadyadded = false;
    this.isstorealreadyadded1 = false;
    this.api
      .getRecentStores(
        1,
        false,
        i == 1 ? this.parameters : this.parameters1,
        this.operators,
        i == 1 ? this.searchvalue : this.searchvalue1
      )
      .pipe(take(1))
      .subscribe((recentStore: any) => {
        if (recentStore.length == 0) {
          this.auth.resource.startSnackBar('No store found.');
        } else {
          if (i == 1) {
            this.MerchantdataSource = new MatTableDataSource(recentStore);
            this.isstorealreadyadded =
              this.PChoiceStores.findIndex((x) => x.id == recentStore[0].id) < 0
                ? false
                : true;
          }
          // else {
          //   this.MerchantdataSource1 = new MatTableDataSource(recentStore);
          //   this.isstorealreadyadded =
          //     this.trendingStores.findIndex((x) => x.id == recentStore[0].id) <
          //     0
          //       ? false
          //       : true;
          // }
        }
      });
  }

  action(i: number, Data: any) {
    if (i == 1) {
      if (this.HGBdata == undefined) {
        this.addsectionstoredata(i, Data);
      }
      else {
        // Data.catId = this.actRoute.snapshot.params['catid'];
        // Data.iscat_subCatstore = 'Cat';
        // Data.sectionName = 'HomegrownSection';
        // this.api.addstoretoPeoplechoice(Data).then((data: any) => {
        //   this.isstorealreadyadded = true;
        //   this.PChoiceStores.push(Data);
        // });
        this.api
          .AddORRemoveSectionStores(1, Data.id, this.HGBdata.id)
          .then(() => {
            this.PChoiceStores.push(Data);
          });
      }
    }
    // else {
    //   Data.catId = this.actRoute.snapshot.params['catid'];
    //   Data.iscat_subCatstore = 'Cat';
    //   Data.sectionName = 'HomegrownSection';
    //   this.api.addstoretoTrendingStore(Data).then((data: any) => {
    //     this.isstorealreadyadded1 = true;
    //     this.trendingStores.push(Data);
    //   });
    // }
  }

  addsectionstoredata(i: number, data: any) {
    let datas:any;
    if (i == 1) {
      datas = {
        Stores: [data.id],
        C_Date: this.api.newTimestamp,
        M_Date: this.api.newTimestamp,
        SectionName: 'HomegrownInternalCatSection',
        Catid: this.actRoute.snapshot.params['catid'],
        ContainerType: 'PeopleChoice',
      };
    } else {
      datas = {
        C_Date: this.api.newTimestamp,
        M_Date: this.api.newTimestamp,
        SectionName: 'HomegrownInternalCatSection',
        Catid: this.actRoute.snapshot.params['catid'],
        ContainerType: 'PeopleChoice',
        Peoplechoicepara: data,
      };
    }
    this.api.adddatatosectionstore(datas).then(() => {
      this.HGBdata = datas;
      if (i == 1) {
      this.api.startSnackBar('Store Added');
      }
      else {
      this.api.startSnackBar('People Choice Added.');
      }
    });
  }

  deletestore(i: number, id: string) {
    if (i == 1) {
      // this.api.deletestorefrompeopleStore(id).then((data: any) => {
      //   this.MerchantdataSource = new MatTableDataSource();
      // });


      this.api.AddORRemoveSectionStores(2, id, this.HGBdata.id).then(() => {
        let i = this.PChoiceStores.findIndex((x: any) => x.id == id);
        this.PChoiceStores.splice(i, 1);
      });

    }
    // else {
    //   this.api.deletestorefromTrendingStore(id).then((data: any) => {
    //     this.MerchantdataSource1 = new MatTableDataSource();
    //   });
    // }
  }

  gethomegrowndata() {
    // this.api.gethomegrowndata().subscribe((data: any) => {
    // this.HGBdata = data[0];
    let i = this.auth.resource.categoryList.findIndex(
      (x: any) => x.id == this.actRoute.snapshot.params['catid']
    );
    this.catindex = i;
    this.selectedcat = this.auth.resource.categoryList[i].title;
    this.Catthumbnail = this.auth.resource.categoryList[i].HGThumbnail;
    this.Catbanner = this.auth.resource.categoryList[i].HGCatbanner;
    // this.peoplechoicecatpara = data[0].Categories[i].peoplechoicecatpara;
    // });
  }

  async takePicture(ratio: string, type: string, id?: string, i?: number) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(ratio, imageUrl, type, id, i);
    }
  }

  startCropper(
    ratio: string,
    webPath: string,
    type: string,
    id?: string,
    subcatindex?: number
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
    refDialog.afterClosed().subscribe((result) => {
      if (!result.success) {
        if (result.info) {
          this.auth.resource.startSnackBar(result.info);
        }
      } else {
        if (type == 'Thumbnail' || type == 'homeBanner') {
          this.api
            .updatehomegrownbanners(
              this.actRoute.snapshot.params['catid'],
              type == 'Thumbnail' ? 1 : 2,
              result.croppedImage
            )
            .then((ref) => {
              if (!ref || !ref.success) {
                this.auth.resource.startSnackBar('Upload Failed!');
              } else {
                let i = this.auth.resource.categoryList.findIndex(
                  (x: any) => x.id == this.actRoute.snapshot.params['catid']
                );

                if (type == 'Thumbnail') {
                  this.Catthumbnail = ref.url;
                  this.auth.resource.categoryList[i].HGThumbnail = ref.url;
                } else if (type == 'homeBanner') {
                  this.Catbanner = ref.url;
                  this.auth.resource.categoryList[i].HGCatbanner = ref.url;
                }
                this.auth.resource.startSnackBar('Banner Update.');
              }
            });
        }
        //  else if (type == 'homeBanner') {
        //   this.api
        //     .updatehomegrownbanners(
        //       this.HGBdata.id,
        //       result.croppedImage,
        //       this.HGBdata.Categories,
        //       this.selectedcat,
        //       2
        //     )
        //     .then((ref) => {
        //       if (!ref || !ref.success) {
        //         this.auth.resource.startSnackBar('Upload Failed!');
        //       } else {
        //         this.Catbanner = ref.url;
        //         this.auth.resource.startSnackBar('Banner Update Under Review!');
        //       }
        //     });
        // }
        // else if (type == 'trendingstorebanner') {
        //   this.api
        //     .updateTrendingstorebanner(
        //       id == undefined ? '' : id,
        //       result.croppedImage
        //     )
        //     .then((ref) => {
        //       if (!ref || !ref.success) {
        //         this.auth.resource.startSnackBar('Upload Failed!');
        //       } else {
        //         this.auth.resource.startSnackBar('Banner Update Under Review!');
        //       }
        //     });
        // }
         else if (type == 'peopleCstorebanner') {
          // this.api
          //   .updatePchoicestorebanner(
          //     id == undefined ? '' : id,
          //     result.croppedImage
          //   )
          //   .then((ref) => {
          //     if (!ref || !ref.success) {
          //       this.auth.resource.startSnackBar('Upload Failed!');
          //     } else {
          //       this.auth.resource.startSnackBar('Banner Update Under Review!');
          //     }
          //   });



            this.api
            .updateSectionStorebanner(
              id,
              result.croppedImage,
              'homegrown'
            )
            .then((data) => {
              this.auth.resource.startSnackBar('banner updated');
            });

        } else {
          this.api
            .updatehomegrownbanners(
              this.actRoute.snapshot.params['catid'],
              3,
              result.croppedImage,
              this.catindex,
              subcatindex || 0
            )
            .then((ref) => {
              if (!ref) {
                this.auth.resource.startSnackBar('Upload Failed!');
              } else {
                this.auth.resource.startSnackBar('Banner Update Under Review!');
              }
            });
        }
      }
    });
  }

  updatepeoplechoice() {
    if (!this.editpeoplechoice) {
      this.editpeoplechoice = !this.editpeoplechoice;
    } else if (this.peoplechoicecatpara == this.HGBdata?.Peoplechoicepara) {
      this.editpeoplechoice = !this.editpeoplechoice;
    } else {
      if (this.peoplechoicecatpara == '') {
        this.auth.resource.startSnackBar('please enter the People choice.');
      } else {
        if (this.HGBdata == undefined){
          this.addsectionstoredata(2, this.peoplechoicecatpara);
        }
        else {
          this.api
            .updatepeoplechoicepara(this.HGBdata.id, this.peoplechoicecatpara)
            .then((data) => {
              if (data != undefined) {
                this.HGBdata.Peoplechoicepara = this.peoplechoicecatpara;
                this.editpeoplechoice = !this.editpeoplechoice;
              }
            })
            .catch(() => {
              return false;
            });
        }
      }
    }
  }

  back() {
    this.Location.back();
  }
}
