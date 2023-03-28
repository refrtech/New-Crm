import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { AuthService } from 'src/app/auth.service';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-categoriesinternal',
  templateUrl: './categoriesinternal.component.html',
  styleUrls: ['./categoriesinternal.component.scss'],
})
export class CategoriesinternalComponent implements OnInit {
  storeBanner = '';
  Catthumbnail = '';
  Searchtxt: string = '';

  parameters: string = 'phone';
  parameters1: string = 'phone';
  parameters2: string = 'phone';

  operators: string = '==';
  operators1: string = '==';
  operators2: string = '==';

  searchvalue: string = '9876543210';
  searchvalue1: string = '9876543210';
  searchvalue2: string = '9876543210';

  isstorealreadyadded: boolean = false;
  isstorealreadyadded1: boolean = false;
  isstorealreadyadded2: boolean = false;
  isstorealreadyadded3: boolean = false;

  MerchantdataSource!: MatTableDataSource<any>;
  MerchantdataSource1!: MatTableDataSource<any>;
  MerchantdataSource2!: MatTableDataSource<any>;
  MerchantdataSource3!: MatTableDataSource<any>;

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

  PChoiceStores: Array<any> = [];
  trendingStores: Array<any> = [];
  curatedstores: Array<any> = [];
  homegrownproducts: Array<any> = [];
  catindex: number = -1;
  constructor(
    private api: ApiserviceService,
    private actRoute: ActivatedRoute,
    public auth: AuthService,
    private https: HttpClient
  ) {}

  ngOnInit(): void {
    this.catindex = this.auth.resource.categoryList.findIndex(
      (x: any) => x.id == this.actRoute.snapshot.params['cat']
    );
    this.api
      .getPeoplechoiceCatstores(
        this.actRoute.snapshot.params['nodeid'],
        this.actRoute.snapshot.params['cat']
      )
      .subscribe((data: any) => {
        console.log(data);
        this.PChoiceStores = data;
      });

    this.api
      .gettrendingCatstores(
        this.actRoute.snapshot.params['nodeid'],
        this.actRoute.snapshot.params['cat']
      )
      .subscribe((data: any) => {
        this.trendingStores = data;
      });

    this.api
      .getcuratedtrendingCatstores(
        this.actRoute.snapshot.params['nodeid'],
        this.actRoute.snapshot.params['cat']
      )
      .subscribe((data: any) => {
        this.curatedstores = data;
      });
  }

  ApplyFilter(i: number) {
    this.isstorealreadyadded = false;
    this.isstorealreadyadded1 = false;
    this.isstorealreadyadded2 = false;

    this.api
      .getRecentStores(
        1,
        false,
        i == 1 ? this.parameters : i == 2 ? this.parameters1 : this.parameters2,
        i == 1 ? this.operators : i == 2 ? this.operators1 : this.operators2,
        i == 1
          ? this.searchvalue
          : i == 2
          ? this.searchvalue1
          : this.searchvalue2
      )
      .pipe(take(1))
      .subscribe((recentStore: any) => {
        if (i == 1) {
          this.MerchantdataSource = new MatTableDataSource(recentStore);
          this.isstorealreadyadded =
            this.PChoiceStores.findIndex((x) => x.id == recentStore[0].id) < 0
              ? false
              : true;
        } else if (i == 2) {
          this.MerchantdataSource1 = new MatTableDataSource(recentStore);
          this.isstorealreadyadded1 =
            this.trendingStores.findIndex((x) => x.id == recentStore[0].id) < 0
              ? false
              : true;
        } else {
          this.MerchantdataSource3 = new MatTableDataSource(recentStore);
          this.isstorealreadyadded2 =
            this.curatedstores.findIndex((x) => x.id == recentStore[0].id) < 0
              ? false
              : true;
        }
      });
  }

  action(i: number, Data: any) {
    Data.catId = this.actRoute.snapshot.params['cat'];
    Data.Nodeid = this.actRoute.snapshot.params['nodeid'];
    Data.sectionName = 'Categorysection';
    if (i == 1) {
      this.api.addstoretoPeoplechoice(Data).then((data: any) => {
        this.isstorealreadyadded = true;
        this.PChoiceStores.push(Data);
      });
    } else if (i == 2 || i == 4) {
      if (i == 4) {
        Data.sectionName = 'Categorysection-CuratedStores';
      }
      this.api.addstoretoTrendingStore(Data).then((data: any) => {
        if (i == 4) {
          this.isstorealreadyadded3 = true;
          this.curatedstores.push(Data);
        } else {
          this.isstorealreadyadded1 = true;
          this.trendingStores.push(Data);
        }
      });
    } else {
      this.api.addProductTohomegrown(Data).then((data: any) => {
        this.isstorealreadyadded2 = true;
        this.homegrownproducts.push(Data);
      });
    }
  }

  async takePicture(type: string, id?: string) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(imageUrl, type, id);
    }
  }

  startCropper(webPath: string, type: string, id?: string) {
    let isPhone = this.auth.resource.getWidth < 768;
    let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
    const refDialog = this.auth.resource.dialog.open(CropperComponent, {
      width: w,
      minWidth: '320px',
      maxWidth: '480px',
      height: '360px',
      data: { webPath: webPath, type: type },
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
            .then((ref) => {
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
            .updatesubcatproductbanner(
              id == undefined ? '' : id,
              result.croppedImage
            )
            .then((ref) => {
              if (!ref || !ref.success) {
                this.auth.resource.startSnackBar('Upload Failed!');
              } else {
                this.auth.resource.startSnackBar('Banner Update Under Review!');
              }
            });
        }
        // else if(type == 'trendingstorebanner'){
        //   this.api
        //   .updateTrendingstorebanner(
        //     id == undefined ? "" : id,
        //     result.croppedImage,
        //   )
        //   .then((ref) => {
        //     if (!ref || !ref.success) {
        //       this.auth.resource.startSnackBar('Upload Failed!');
        //     } else {
        //       // this.storeBanner = ref.url;
        //       this.auth.resource.startSnackBar('Banner Update Under Review!');
        //     }
        //   });
        // }
        // else if(type == "peopleCstorebanner"){
        //   this.api
        //   .updatePchoicestorebanner(
        //     id == undefined ? "" : id,
        //     result.croppedImage,
        //   )
        //   .then((ref) => {
        //     if (!ref || !ref.success) {
        //       this.auth.resource.startSnackBar('Upload Failed!');
        //     }
        //      else {
        //       this.auth.resource.startSnackBar('Banner Update Under Review!');
        //     }
        //   });
        // }
      }
    });
  }

  deletestore(i: number, id: string) {
    if (i == 1) {
      this.api.deletestorefrompeopleStore(id).then((data: any) => {
        this.MerchantdataSource = new MatTableDataSource();
      });
    } else {
      this.api.deletestorefromTrendingStore(id).then((data: any) => {
        this.MerchantdataSource1 = new MatTableDataSource();
      });
    }
  }

  deleteproduct(id: any) {
    this.api.deleteproductfromhomegrown(id).then((data: any) => {
      this.Searchtxt = '';
    });
  }

  searchdata() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('elastic:bcFhFOqTCpvVJua+tnc-'),
      }),
    };
    let url =
      'https://app.refr.club/api/search/sendSearch/IN/things?q=' +
      this.Searchtxt +
      '';
    this.https.get(url, httpOptions).subscribe((data: any) => {
      let products: any = [];
      for (let i = 0; i < data.hits.hits.length; i++) {
        products.push(data.hits.hits[i]._source);
      }
      this.MerchantdataSource2 = new MatTableDataSource(products);
    });
  }
}
