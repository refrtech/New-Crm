import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hgbnodesubcatstores',
  templateUrl: './hgbnodesubcatstores.component.html',
  styleUrls: ['./hgbnodesubcatstores.component.scss'],
})
export class HgbnodesubcatstoresComponent implements OnInit {
  selectedcat: string = '';
  editpeoplechoice: boolean = false;
  peoplechoicesubcatpara: string = '';
  HGBdata: any;

  parameters: string = 'phone';
  parameters1: string = 'phone';
  parameters2: string = 'phone';

  operators: string = '==';

  searchvalue: string = '9876543210';
  searchvalue1: string = '9876543210';
  searchvalue2: string = '9876543210';

  isstorealreadyadded: boolean = false;
  isstorealreadyadded1: boolean = false;
  isstorealreadyadded2: boolean = false;

  MerchantdataSource!: MatTableDataSource<any>;
  MerchantdataSource1!: MatTableDataSource<any>;
  MerchantdataSource2!: MatTableDataSource<any>;

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
  homegrownproducts: Array<any> = [];
  constructor(
    private api: ApiserviceService,
    private actRoute: ActivatedRoute,
    private auth: AuthService,
    private https: HttpClient,
    public Location: Location
  ) {}

  ngOnInit(): void {
    this.gethomegrowndata();
    this.selectedcat = this.actRoute.snapshot.params['catid'];
    this.api
      .gethomegrowPeoplechoicesubCatstores(
        this.actRoute.snapshot.params['catid']
      )
      .subscribe((data: any) => {
        this.PChoiceStores = data;
      });
    this.api
      .gethomegrowbrandsUlovesubCatstores(
        this.actRoute.snapshot.params['catid']
      )
      .subscribe((data: any) => {
        this.trendingStores = data;
      });
    this.api
      .gethomegrowproductssubCatstores(
        'HomegrownSection',
        this.actRoute.snapshot.params['cat']
      )
      .subscribe((data: any) => {
        this.homegrownproducts = data;
      });
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

  action(i: number, Data: any) {
    if (i == 1) {
      Data.catId = this.actRoute.snapshot.params['catid'];
      Data.iscat_subCatstore = 'SubCat';
      Data.sectionName = 'HomegrownSection';
      this.api.addstoretoPeoplechoice(Data).then((data: any) => {
        this.isstorealreadyadded = true;
        this.PChoiceStores.push(Data);
      });
    } else if (i == 2) {
      Data.catId = this.actRoute.snapshot.params['catid'];
      Data.iscat_subCatstore = 'SubCat';
      Data.sectionName = 'HomegrownSection';
      this.api.addstoretoTrendingStore(Data).then((data: any) => {
        this.isstorealreadyadded1 = true;
        this.trendingStores.push(Data);
      });
    } else {
      Data.catId = this.actRoute.snapshot.params['catid'];
      Data.iscat_subCatstore = 'SubCat';
      Data.sectionName = 'HomegrownSection';
      this.api.addProductTohomegrown(Data).then((data: any) => {
        this.isstorealreadyadded2 = true;
        this.homegrownproducts.push(Data);
      });
    }
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
        this.operators,
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
          this.MerchantdataSource2 = new MatTableDataSource(recentStore);
          this.isstorealreadyadded2 =
            this.homegrownproducts.findIndex((x) => x.id == recentStore[0].id) <
            0
              ? false
              : true;
        }
      });
  }

  deletestore(i: number, id: string) {
    if (i == 1) {
      this.api.deletestorefrompeopleStore(id).then((data: any) => {
        this.MerchantdataSource = new MatTableDataSource();
      });
    } else if (i == 2) {
      this.api.deletestorefromTrendingStore(id).then((data: any) => {
        this.MerchantdataSource1 = new MatTableDataSource();
      });
    } else {
      this.api.deleteproductfromhomegrown(id).then((data: any) => {
        this.MerchantdataSource2 = new MatTableDataSource();
      });
    }
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
        if (type == 'peopleCstorebanner') {
          this.api
            .updatePchoicestorebanner(
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
        } else if (type == 'trendingstorebanner') {
          this.api
            .updateTrendingstorebanner(
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
      }
    });
  }

  gethomegrowndata() {
    this.api.gethomegrowndata().subscribe((data: any) => {
      this.HGBdata = data[0];
      let i = data[0].Categories.findIndex(
        (x: any) => x.id == this.actRoute.snapshot.params['catid']
      );
      this.peoplechoicesubcatpara =
        data[0].Categories[i].peoplechoiceSubcatpara;
    });
  }

  updatepeoplechoice() {
    let index = this.HGBdata.Categories.findIndex(
      (x: any) => x.id == this.actRoute.snapshot.params['catid']
    );
    if (!this.editpeoplechoice) {
      this.editpeoplechoice = !this.editpeoplechoice;
    } else if (
      this.peoplechoicesubcatpara ==
      this.HGBdata.Categories[index].peoplechoicecatpara
    ) {
      this.editpeoplechoice = !this.editpeoplechoice;
    } else {
      if (this.peoplechoicesubcatpara == '') {
        alert('please enter the People choice.');
      } else {
        this.HGBdata.Categories[index].peoplechoiceSubcatpara =
          this.peoplechoicesubcatpara;
        this.api
          .updatepeoplechoicepara(this.HGBdata.id, this.HGBdata.Categories)
          .then((data) => {
            if (data != undefined) {
              this.editpeoplechoice = !this.editpeoplechoice;
            }
          })
          .catch(() => {
            return false;
          });
      }
    }
  }

  back() {
    this.Location.back();
  }
}
