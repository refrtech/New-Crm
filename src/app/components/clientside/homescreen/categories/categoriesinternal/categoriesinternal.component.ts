import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { AuthService } from 'src/app/auth.service';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';

@Component({
  selector: 'app-categoriesinternal',
  templateUrl: './categoriesinternal.component.html',
  styleUrls: ['./categoriesinternal.component.scss'],
})
export class CategoriesinternalComponent implements OnInit {
  storeBanner = '';
  Catthumbnail = '';

  parameters: string = 'phone';
  parameters1: string = 'phone';
  parameters2: string = 'phone';
  parameters3: string = 'phone';

  operators: string = '==';

  searchvalue: string = '9876543210';
  searchvalue1: string = '9876543210';
  searchvalue2: string = '9876543210';
  searchvalue3: string = '9876543210';

  isstorealreadyadded: boolean = false;
  isstorealreadyadded1: boolean = false;
  isstorealreadyadded2: boolean = false;
  isstorealreadyadded3: boolean = false;

  MerchantdataSource!: MatTableDataSource<any>;
  MerchantdataSource1!: MatTableDataSource<any>;
  MerchantdataSource2!: MatTableDataSource<any>;
  MerchantdataSource3!: MatTableDataSource<any>;
  MerchantdataSource4!: MatTableDataSource<any>;

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
  ParaArr2: Array<any> = [
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
  PChoicedata: any;
  trendingdata: any;
  CURATEDdata: any;
  productYWLData: any;

  PChoiceStores: Array<any> = [];
  trendingStores: Array<any> = [];
  curatedstores: Array<any> = [];
  products: Array<any> = [];
  catindex: number = -1;
  constructor(
    public api: ApiserviceService,
    private actRoute: ActivatedRoute,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.catindex = this.auth.resource.categoryList.findIndex(
      (x: any) => x.id == this.actRoute.snapshot.params['cat']
    );

    this.api
      .getDataCat_Subcatdata(
        'CategorySection',
        this.actRoute.snapshot.params['cat'],
        'PeopleChoice'
      )
      .subscribe((data: any) => {
        this.PChoicedata = data[0];
        if (this.PChoicedata != undefined) {
          this.api.getStoresbyIds(data[0]?.Stores).subscribe((data: any) => {
            this.PChoiceStores = data;
          });
        }
      });

    this.api
      .getDataCat_Subcatdata(
        'CategorySection',
        this.actRoute.snapshot.params['cat'],
        'Trending'
      )
      .subscribe((data: any) => {
        this.trendingdata = data[0];
        if (this.trendingdata != undefined) {
          this.api.getStoresbyIds(data[0]?.Stores).subscribe((data: any) => {
            this.trendingStores = data;
          });
        }
      });

    this.api
      .getDataCat_Subcatdata(
        'CategorySection',
        this.actRoute.snapshot.params['cat'],
        'Curated'
      )
      .subscribe((data: any) => {
        this.CURATEDdata = data[0];
        if (this.CURATEDdata != undefined) {
          this.api.getStoresbyIds(data[0]?.Stores).subscribe((data: any) => {
            this.curatedstores = data;
          });
        }
      });

    this.api
      .getDataCat_Subcatdata(
        'CategorySection',
        this.actRoute.snapshot.params['cat'],
        'ProductsYWL'
      )
      .subscribe((data: any) => {
        this.productYWLData = data[0];
        if (this.productYWLData != undefined) {
          this.api.getStoresbyIds(data[0]?.Stores).subscribe((data: any) => {
            this.products = data;
          });
        }
      });

    // this.api
    //   .getPeoplechoiceCatstores(
    //     this.actRoute.snapshot.params['cat']
    //   )
    //   .subscribe((data: any) => {
    //     this.PChoiceStores = data;
    //   });

    // this.api
    //   .gettrendingCatstores(
    //     this.actRoute.snapshot.params['cat']
    //   )
    //   .subscribe((data: any) => {
    //     this.trendingStores = data;
    //   });

    // this.api
    //   .getcuratedtrendingCatstores(
    //     this.actRoute.snapshot.params['cat']
    //   )
    //   .subscribe((data: any) => {
    //     this.curatedstores = data;
    //   });

    // this.api
    //   .gethomegrowproductssubCatstores('Categorysection',this.actRoute.snapshot.params['cat'])
    //   .subscribe((data: any) => {
    //     this.products = data;
    //   });
  }

  ApplyFilter(i: number) {
    this.isstorealreadyadded = false;
    this.isstorealreadyadded1 = false;
    this.isstorealreadyadded2 = false;
    this.isstorealreadyadded3 = false;

    this.api
      .getRecentStores(
        1,
        false,
        i == 1
          ? this.parameters
          : i == 2
          ? this.parameters1
          : i == 3
          ? this.parameters2
          : this.parameters3,
        this.operators,
        i == 1
          ? this.searchvalue
          : i == 2
          ? this.searchvalue1
          : i == 3
          ? this.searchvalue2
          : this.searchvalue3
      )
      .pipe(take(1))
      .subscribe((recentStore: any) => {
        if (recentStore.length == 0) {
          this.auth.resource.startSnackBar('No Store Found.');
        } else {
          if (i == 1) {
            this.MerchantdataSource = new MatTableDataSource(recentStore);
            this.isstorealreadyadded =
              this.PChoiceStores.findIndex((x) => x.id == recentStore[0].id) < 0
                ? false
                : true;
          } else if (i == 2) {
            this.MerchantdataSource1 = new MatTableDataSource(recentStore);
            this.isstorealreadyadded1 =
              this.trendingStores.findIndex((x) => x.id == recentStore[0].id) <
              0
                ? false
                : true;
          } else if (i == 3) {
            this.MerchantdataSource3 = new MatTableDataSource(recentStore);
            this.isstorealreadyadded3 =
              this.curatedstores.findIndex((x) => x.id == recentStore[0].id) < 0
                ? false
                : true;
          } else {
            this.MerchantdataSource2 = new MatTableDataSource(recentStore);
            this.isstorealreadyadded2 =
              this.products.findIndex((x) => x.id == recentStore[0].id) < 0
                ? false
                : true;
          }
        }
      });
  }

  action(i: number, Data: any) {
    // Data.catId = this.actRoute.snapshot.params['cat'];
    // Data.sectionName = 'Categorysection';
    // if (i == 1) {
    //   this.api.addstoretoPeoplechoice(Data).then((data: any) => {
    //     this.isstorealreadyadded = true;
    //     this.PChoiceStores.push(Data);
    //   });
    // } else if (i == 2 || i == 4) {
    //   if (i == 4) {
    //     Data.sectionName = 'Categorysection-CuratedStores';
    //   }
    //   this.api.addstoretoTrendingStore(Data).then((data: any) => {
    //     if (i == 4) {
    //       this.isstorealreadyadded3 = true;
    //       this.curatedstores.push(Data);
    //     } else {
    //       this.isstorealreadyadded1 = true;
    //       this.trendingStores.push(Data);
    //     }
    //   });
    // } else {
    //   this.api.addProductTohomegrown(Data).then((data: any) => {
    //     this.isstorealreadyadded2 = true;
    //     this.homegrownproducts.push(Data);
    //   });
    // }
    if (i == 1) {
      console.log(this.PChoicedata);
      if (this.PChoicedata == undefined) {
        this.addsectionstoredata(i, Data);
      } else {
        this.api
          .AddORRemoveSectionStores(1, Data.id, this.PChoicedata.id)
          .then(() => {
            this.PChoiceStores.push(Data);
          });
      }
    } else if (i == 2) {
      if (this.trendingdata == undefined) {
        this.addsectionstoredata(i, Data);
      } else {
        this.api
          .AddORRemoveSectionStores(2, Data.id, this.trendingdata.id)
          .then(() => {
            this.trendingStores.push(Data);
          });
      }
    } else if (i == 3) {
      if (this.productYWLData == undefined) {
        this.addsectionstoredata(i, Data);
      } else {
        this.api
          .AddORRemoveSectionStores(1, Data.id, this.productYWLData.id)
          .then(() => {
            this.products.push(Data);
          });
      }
    } else if (i == 4) {
      if (this.CURATEDdata == undefined) {
        this.addsectionstoredata(i, Data);
      } else {
        this.api
          .AddORRemoveSectionStores(1, Data.id, this.CURATEDdata.id)
          .then(() => {
            this.curatedstores.push(Data);
          });
      }
    }
  }

  addsectionstoredata(i: number, data: any) {
    console.log('Data', data);
    let datas: any;
    if (i == 1) {
      datas = {
        Stores: [data.id],
        C_Date: this.api.newTimestamp,
        M_Date: this.api.newTimestamp,
        SectionName: 'CategorySection',
        Catid: this.actRoute.snapshot.params['cat'],
        ContainerType: 'PeopleChoice',
      };
    } else if (i == 2) {
      datas = {
        Stores: [data.id],
        C_Date: this.api.newTimestamp,
        M_Date: this.api.newTimestamp,
        SectionName: 'CategorySection',
        Catid: this.actRoute.snapshot.params['cat'],
        ContainerType: 'Trending',
      };
    } else if (i == 3) {
      datas = {
        Stores: [data.id],
        C_Date: this.api.newTimestamp,
        M_Date: this.api.newTimestamp,
        SectionName: 'CategorySection',
        Catid: this.actRoute.snapshot.params['cat'],
        ContainerType: 'ProductsYWL',
      };
    } else if (i == 4) {
      datas = {
        Stores: [data.id],
        C_Date: this.api.newTimestamp,
        M_Date: this.api.newTimestamp,
        SectionName: 'CategorySection',
        Catid: this.actRoute.snapshot.params['cat'],
        ContainerType: 'Curated',
      };
    }
    this.api.adddatatosectionstore(datas).then(() => {
      this.api.startSnackBar('Store Added');

      if (i == 1) {
        this.PChoiceStores.push(data);
      } else if(i ==2) {
        this.trendingStores.push(data);
      }
      else if(i == 3){
        this.products.push(data);
      }
      else if(i == 4){
        this.curatedstores.push(data);
      }
    });
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

  startCropper(ratio: string, webPath: string, type: string, Storeid?: string) {
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
        if (type == 'homeBanner' || type == 'logo') {
          this.api
            .updatecatBannerORthumbnail(
              this.actRoute.snapshot.params['cat'],
              result.croppedImage,
              type
            )
            .then((ref: any) => {
              if (!ref || !ref.success) {
                this.auth.resource.startSnackBar('Upload Failed!');
              } else {
                if (type == 'homeBanner') {
                  this.auth.resource.categoryList[
                    this.catindex
                  ].CategoryBanner = ref.url;
                } else {
                  this.auth.resource.categoryList[this.catindex].thumbnail =
                    ref.url;
                }
                this.auth.resource.startSnackBar('Banner Update Under Review!');
              }
            });
        } else {
          this.api
            .updateSectionStorebanner('Categores', Storeid, result.croppedImage)
            .then((data: any) => {
              this.auth.resource.startSnackBar('banner uploaded');
            });
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
        // } else {
        //   this.api
        //     .updatesubcatproductbanner(
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

  deletestore(i: number, docid: string, id: string) {
    this.api.AddORRemoveSectionStores(2, id, docid).then(() => {
      if (i == 1) {
        let i = this.PChoiceStores.findIndex((x: any) => x.id == id);
        this.PChoiceStores.splice(i, 1);
      } else if (i == 2) {
        let i = this.trendingStores.findIndex((x: any) => x.id == id);
        this.trendingStores.splice(i, 1);
      } else if (i == 3) {
        let i = this.curatedstores.findIndex((x: any) => x.id == id);
        this.curatedstores.splice(i, 1);
      } else if (i == 4) {
        let i = this.products.findIndex((x: any) => x.id == id);
        this.products.splice(i, 1);
      }
    });
    // if (i == 1) {
    // this.api.deletestorefrompeopleStore(id).then((data: any) => {
    //   this.MerchantdataSource = new MatTableDataSource();
    // });
    // } else if (i == 2) {
    // this.api.deletestorefromTrendingStore(id).then((data: any) => {
    //   this.MerchantdataSource1 = new MatTableDataSource();
    // });
    // } else if (i == 3) {
    // this.api.deleteproductfromhomegrown(id).then((data: any) => {
    //   this.MerchantdataSource2 = new MatTableDataSource();
    // });
    // }
  }

  //   dataURLtoFile(dataurl:any, filename:string) {

  //     var arr = dataurl.split(','),
  //         mime = arr[0].match(/:(.*?);/)[1],
  //         bstr = atob(arr[1]),
  //         n = bstr.length,
  //         u8arr = new Uint8Array(n);

  //     while(n--){
  //         u8arr[n] = bstr.charCodeAt(n);
  //     }

  //     return new File([u8arr], filename, {type:mime});
  // }
}
