import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { AuthService } from 'src/app/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-vsanodecatstores',
  templateUrl: './vsanodecatstores.component.html',
  styleUrls: ['./vsanodecatstores.component.scss'],
})
export class VSAnodecatstoresComponent implements OnInit {
  // storeBanner = '';
  nodeId: string = '';
  peoplechoicecatpara: string = '';
  editpeoplechoice: boolean = false;

  parameters: string = 'phone';
  // parameters1: string = 'phone';

  operators: string = '==';

  searchvalue: string = '9876543210';
  // searchvalue1: string = '9876543210';

  isstorealreadyadded: boolean = false;
  // isstorealreadyadded1: boolean = false;

  MerchantdataSource!: MatTableDataSource<any>;
  // MerchantdataSource1!: MatTableDataSource<any>;

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
  // catarray: Array<any> = [];
  DocId: string = '';
  catindex: number = -1;
  VSAPeopleCHoicedata: any;

  constructor(
    public auth: AuthService,
    private router: Router,
    public api: ApiserviceService,
    public actRoute: ActivatedRoute,
    public Location: Location
  ) {}

  ngOnInit(): void {
    this.catindex = this.auth.resource.categoryList.findIndex(
      (x: any) => x.id == this.actRoute.snapshot.params['catid']
    );
    console.log(this.catindex);
    this.api
    .getDataCat_Subcatdata('VSAInternalCatSection',this.actRoute.snapshot.params['catid'],'PeopleChoice')
    .subscribe((data: any) => {
      this.VSAPeopleCHoicedata = data[0];
      if(this.VSAPeopleCHoicedata != undefined){
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
    //   .getnodeinterdata(this.actRoute.snapshot.params['nodeid'])
    //   .pipe(take(1))
    //   .subscribe((data: any) => {
    //     this.DocId = data[0].id;
    //     this.catarray =
    //       data[0].CategoryBanners != undefined ? data[0].CategoryBanners : [];
    //     let i = this.catarray.findIndex(
    //       (x: any) => x.Catid == this.actRoute.snapshot.params['catid']
    //     );
    //     if (i != -1) {
    //       this.storeBanner = this.catarray[i].Catbanner;
    //       this.peoplechoicecatpara = this.catarray[i].peoplechoicecatpara;
    //     }
    //   });

    // this.api
    //   .getVSAPeoplechoiceCatstores(
    //     this.actRoute.snapshot.params['nodeid'],
    //     this.actRoute.snapshot.params['catid']
    //   )
    //   .subscribe((data: any) => {
    //     this.PChoiceStores = data;
    //   });

    // this.api
    //   .getVSAtrendingCatstores(
    //     this.actRoute.snapshot.params['nodeid'],
    //     this.actRoute.snapshot.params['catid']
    //   )
    //   .subscribe((data: any) => {
    //     this.trendingStores = data;
    //   });
  }

  ApplyFilter(i: number) {
    this.isstorealreadyadded = false;
    // this.isstorealreadyadded1 = false;
    this.api
      .getRecentStores(
        1,
        false,
        this.parameters, //i == 1 ? this.parameters : this.parameters1,
        this.operators,
        this.searchvalue //i == 1 ? this.searchvalue : this.searchvalue1
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
          //     this.trendingStores.findIndex((x) => x.id == recentStore[0].id) < 0
          //       ? false
          //       : true;
          // }
        }
      });
  }

  action(i: number, Data: any) {
    if (i == 1) {
      if (this.VSAPeopleCHoicedata == undefined) {
        this.addsectionstoredata(i, Data);
      }
      else {
        this.api
        .AddORRemoveSectionStores(1, Data.id, this.VSAPeopleCHoicedata.id)
        .then(() => {
          this.PChoiceStores.push(Data);
        });
      }

      // Data.Nodeid = this.actRoute.snapshot.params['nodeid'];
      // Data.catId = this.actRoute.snapshot.params['catid'];
      // Data.iscat_subCatstore = 'Cat';
      // Data.sectionName = 'VSAsection';
      // this.api.addstoretoPeoplechoice(Data).then((data: any) => {
      //   this.isstorealreadyadded = true;
      //   this.PChoiceStores.push(Data);
      // });
    }
    // else {
    //   Data.Nodeid = this.actRoute.snapshot.params['nodeid'];
    //   Data.catId = this.actRoute.snapshot.params['catid'];
    //   Data.iscat_subCatstore = 'Cat';
    //   Data.sectionName = 'VSAsection';

    //   this.api.addstoretoTrendingStore(Data).then((data: any) => {
    //     this.isstorealreadyadded1 = true;
    //     this.trendingStores.push(Data);
    //   });
    // }
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

  gotointernal() {
    this.router.navigateByUrl(
      '/VSAsubcatstores/' +
        this.actRoute.snapshot.params['nodeid'] +
        '/' +
        this.actRoute.snapshot.params['catid']
    );
  }

  deletestore(i: number, id: string) {
    if (i == 1) {
      this.api.deletestorefrompeopleStore(id).then((data: any) => {
        this.MerchantdataSource = new MatTableDataSource();
      });
    }
    // else {
    //   this.api.deletestorefromTrendingStore(id).then((data: any) => {
    //     this.MerchantdataSource1 = new MatTableDataSource();
    //   });
    // }
  }

  async takePicture(ratio: string, type: string, id?: string) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(ratio, imageUrl, type, id);
    }
  }

  startCropper(ratio: string, webPath: string, type: string, id?: string) {
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
        if (type == 'logo') {
          this.api
            .updatecatBannerORthumbnail(
              this.actRoute.snapshot.params['catid'],
              result.croppedImage,
              'VSAthumbnail'
            )
            .then((ref: any) => {
              if (!ref || !ref.success) {
                this.auth.resource.startSnackBar('Upload Failed!');
              } else {
                // this.storeBanner = ref.url;
                this.auth.resource.categoryList[this.catindex].VSAthumbnail =  ref.url;
                this.auth.resource.startSnackBar('Banner Update.');
              }
            });

          // this.api
          //   .updateNodecatinternalBanner(
          //     this.actRoute.snapshot.params['internalid'],
          //     result.croppedImage,
          //     this.catarray,
          //     this.actRoute.snapshot.params['catid']
          //   )
          //   .then((ref) => {
          //     if (!ref || !ref.success) {
          //       this.auth.resource.startSnackBar('Upload Failed!');
          //     } else {
          //       this.storeBanner = ref.url;
          //       this.auth.resource.startSnackBar('Banner Update Under Review!');
          //     }
          //   });
        }
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
        // } else if (type == 'peopleCstorebanner') {
        //   this.api
        //     .updatePchoicestorebanner(
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
      }
    });
  }

  addsectionstoredata(i: number, data: any) {
    let datas:any;
    if (i == 1) {
      datas = {
        Stores: [data.id],
        C_Date: this.api.newTimestamp,
        M_Date: this.api.newTimestamp,
        SectionName: 'VSAInternalCatSection',
        Catid: this.actRoute.snapshot.params['catid'],
        NodeId:this.actRoute.snapshot.params['nodeid'],
        ContainerType: 'PeopleChoice',
      };
    } else {
      datas = {
        C_Date: this.api.newTimestamp,
        M_Date: this.api.newTimestamp,
        SectionName: 'VSAInternalCatSection',
        Catid: this.actRoute.snapshot.params['catid'],
        NodeId:this.actRoute.snapshot.params['nodeid'],
        ContainerType: 'PeopleChoice',
        Peoplechoicepara: data,
      };
    }
    this.api.adddatatosectionstore(datas).then(() => {
      this.VSAPeopleCHoicedata = datas;
      if (i == 1) {
      this.api.startSnackBar('Store Added');
      }
      else {
      this.api.startSnackBar('People Choice Added.');
      }
    });
  }

  updatepeoplechoice() {
    // let index = this.catarray.findIndex(
    //   (x: any) => x.Catid == this.actRoute.snapshot.params['catid']
    // );
    console.log(this.VSAPeopleCHoicedata);
    console.log(this.VSAPeopleCHoicedata?.Peoplechoicepara);
    console.log(this.peoplechoicecatpara);
    if (!this.editpeoplechoice) {
      this.editpeoplechoice = !this.editpeoplechoice;
    } else if (
      this.peoplechoicecatpara == this.VSAPeopleCHoicedata?.Peoplechoicepara
    ) {
      this.editpeoplechoice = !this.editpeoplechoice;
    } else {
      if (this.peoplechoicecatpara == '') {
        this.auth.resource.startSnackBar('please enter the People choice.');
      } else {
        if (this.VSAPeopleCHoicedata == undefined){
          this.addsectionstoredata(2, this.peoplechoicecatpara);
        }
        else {
          this.api
            .updatepeoplechoicepara(this.VSAPeopleCHoicedata.id, this.peoplechoicecatpara)
            .then((data) => {
              console.log("data",data);
              // if (data != undefined) {
                this.VSAPeopleCHoicedata.Peoplechoicepara = this.peoplechoicecatpara;
                console.log("adadsadas");
                this.editpeoplechoice = !this.editpeoplechoice;
              // }
            })
            .catch(() => {
              return false;
            });
        }

        // if (index != -1) {
        //   this.catarray[index].peoplechoicecatpara = this.peoplechoicecatpara;
        // } else {
        //   this.catarray.push({
        //     Catbanner: '',
        //     Catid: this.actRoute.snapshot.params['catid'],
        //     peoplechoicecatpara: this.peoplechoicecatpara,
        //   });
        // }
        // this.api
        //   .updatePeoplechoicepara(this.DocId, this.catarray)
        //   .then((data) => {
        //     if (data != undefined) {
        //       this.editpeoplechoice = !this.editpeoplechoice;
        //     }
        //   })
        //   .catch(() => {
        //     return false;
        //   });
      }
    }
  }

  back() {
    this.Location.back();
  }
}
