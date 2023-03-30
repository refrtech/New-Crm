import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';

@Component({
  selector: 'app-vsanodesubcatstores',
  templateUrl: './vsanodesubcatstores.component.html',
  styleUrls: ['./vsanodesubcatstores.component.scss'],
})
export class VSAnodesubcatstoresComponent implements OnInit {
  subCatBanner: string = '';
  CatBanner: string = '';
  SelectedSubCat: string = '';
  SelectedCat: string = '';

  subcatlist: Array<any> = [];

  parameters: string = 'phone';
  parameters1: string = 'phone';

  operators: string = '==';

  searchvalue: string = '9876543210';
  searchvalue1: string = '9876543210';

  isstorealreadyadded: boolean = false;
  isstorealreadyadded1: boolean = false;

  MerchantdataSource!: MatTableDataSource<any>;
  MerchantdataSource1!: MatTableDataSource<any>;
  peoplechoicecatpara: string = '';
  editpeoplechoice: boolean = false;

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
  trendingStores: Array<any> = [];
  catarray: Array<any> = [];
  DocId: string = '';
  constructor(
    public auth: AuthService,
    public actRoute: ActivatedRoute,
    private api: ApiserviceService
  ) {
    if (this.actRoute.snapshot.params['catid'] != 'in_the_mix') {
      let i = this.auth.resource.categoryList.findIndex(
        (x: any) => x.id == this.actRoute.snapshot.params['catid']
      );
      this.subcatlist = this.auth.resource.categoryList[i].items;
      this.SelectedSubCat = this.auth.resource.categoryList[i].items[0].id;
    } else {
      this.SelectedCat = this.auth.resource.categoryList[0].id;
    }
  }

  ngOnInit(): void {
    if (this.actRoute.snapshot.params['catid'] != 'in_the_mix') {
      this.subcatchange();
    } else {
      this.catchange();
    }
  }

  subcatchange() {
    this.peoplechoicecatpara = '';
    this.PChoiceStores = [];
    this.trendingStores = [];
    //get the vsa people choice stores as per node id and sub cat
    this.api
      .getVSAPeoplechoicesubCatstores(
        this.actRoute.snapshot.params['nodeid'],
        this.SelectedSubCat
      )
      .pipe(take(1))
      .subscribe((data: any) => {
        this.PChoiceStores = data;

        this.api
          .getnodeinterdata(this.actRoute.snapshot.params['nodeid'])
          .pipe(take(1))
          .subscribe((data: any) => {
            this.DocId = data[0].id;
            this.catarray =
              data[0].CategoryBanners != undefined
                ? data[0].CategoryBanners
                : [];
            let catindex = this.catarray.findIndex(
              (x: any) => x.Catid == this.actRoute.snapshot.params['catid']
            );

            let subcatindex = this.catarray[catindex].subcatbanners.findIndex(
              (x: any) => x.Subcatid == this.SelectedSubCat
            );

            this.peoplechoicecatpara =
              this.catarray[catindex].subcatbanners[
                subcatindex
              ].peoplechoicecatpara;
            let i = this.catarray.findIndex(
              (x: any) => x.Catid == this.actRoute.snapshot.params['catid']
            );
            if (i != -1) {
              let j = this.catarray[i].subcatbanners.findIndex(
                (x: any) => x.Subcatid == this.SelectedSubCat
              );
              if (j != -1) {
                this.subCatBanner =
                  this.catarray[i].subcatbanners[j].Subcatbanner;
              } else {
                this.subCatBanner = '';
              }
            }
          });
      });

    this.api
      .getVSAtrendingsubCatstores(
        this.actRoute.snapshot.params['nodeid'],
        this.SelectedSubCat
      )
      .subscribe((data: any) => {
        this.trendingStores = data;
      });
  }

  catchange() {
    this.peoplechoicecatpara = '';
    this.PChoiceStores = [];
    this.trendingStores = [];

    this.api
      .getVSAPeoplechoiceCatstores(
        this.actRoute.snapshot.params['nodeid'],
        this.SelectedCat
      )
      .pipe(take(1))
      .subscribe((data: any) => {
        this.PChoiceStores = data;
        this.api
          .getnodeinterdata(this.actRoute.snapshot.params['nodeid'])
          .pipe(take(1))
          .subscribe((data: any) => {
            this.DocId = data[0].id;
            this.catarray =
              data[0].CategoryBanners != undefined
                ? data[0].CategoryBanners
                : [];
            let catindex = this.catarray.findIndex(
              (x: any) => x.Catid == this.SelectedCat
            );
            if (catindex != -1) {
              this.peoplechoicecatpara =
                this.catarray[catindex].peoplechoicecatpara;
            }
            let i = this.catarray.findIndex(
              (x: any) => x.Catid == this.SelectedCat
            );
            if (i != -1) {
              this.CatBanner = this.catarray[i].Catbanner;
            } else {
              this.CatBanner = '';
            }
          });
      });

    this.api
      .getVSAtrendingCatstores(
        this.actRoute.snapshot.params['nodeid'],
        this.SelectedCat
      )
      .subscribe((data: any) => {
        this.trendingStores = data;
      });
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
        if (i == 1) {
          this.MerchantdataSource = new MatTableDataSource(recentStore);
          this.isstorealreadyadded =
            this.PChoiceStores.findIndex((x) => x.id == recentStore[0].id) < 0
              ? false
              : true;
        } else {
          this.MerchantdataSource1 = new MatTableDataSource(recentStore);
          this.isstorealreadyadded =
            this.trendingStores.findIndex((x) => x.id == recentStore[0].id) < 0
              ? false
              : true;
        }
      });
  }

  action(i: number, Data: any) {
    if (i == 1) {
      Data.Nodeid = this.actRoute.snapshot.params['nodeid'];
      Data.catId = this.actRoute.snapshot.params['catid'];
      Data.iscat_subCatstore =
        this.actRoute.snapshot.params['catid'] != 'in_the_mix'
          ? 'SubCat'
          : 'Cat';
      Data.sectionName = 'VSAsection';
      if (this.actRoute.snapshot.params['catid'] != 'in_the_mix') {
        Data.SubcatId = this.SelectedSubCat;
      }
      this.api.addstoretoPeoplechoice(Data).then((data: any) => {
        this.isstorealreadyadded = true;
        this.PChoiceStores.push(Data);
      });
    } else {
      Data.Nodeid = this.actRoute.snapshot.params['nodeid'];
      Data.catId = this.actRoute.snapshot.params['catid'];
      Data.iscat_subCatstore =
        this.actRoute.snapshot.params['catid'] != 'in_the_mix'
          ? 'SubCat'
          : 'Cat';
      Data.sectionName = 'VSAsection';
      if (this.actRoute.snapshot.params['catid'] != 'in_the_mix') {
        Data.SubcatId = this.SelectedSubCat;
      }

      this.api.addstoretoTrendingStore(Data).then((data: any) => {
        this.isstorealreadyadded1 = true;
        this.trendingStores.push(Data);
      });
    }
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

  async takePicture(ratio:string,type: string, id?: string) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(ratio,imageUrl, type, id);
    }
  }

  startCropper(ratio:string,webPath: string, type: string, id?: string) {
    let isPhone = this.auth.resource.getWidth < 768;
    let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
    const refDialog = this.auth.resource.dialog.open(CropperComponent, {
      width: w,
      minWidth: '320px',
      maxWidth: '480px',
      height: '360px',
      data: { webPath: webPath, type: type,ratio:ratio },
      disableClose: true,
      panelClass: 'dialogLayout',
    });
    refDialog.afterClosed().subscribe((result) => {
      if (!result.success) {
        if (result.info) {
          this.auth.resource.startSnackBar(result.info);
        }
      } else {
        if (type == 'homeBanner' && (id == '1' || id == '2')) {
          this.api
            .updateNodesubcatinternalBanner(
              this.actRoute.snapshot.params['internalid'],
              result.croppedImage,
              this.catarray,
              this.actRoute.snapshot.params['catid'] != 'in_the_mix'
                ? this.actRoute.snapshot.params['catid']
                : this.SelectedCat,
              this.SelectedSubCat,
              id
            )
            .then((ref) => {
              if (!ref || !ref.success) {
                this.auth.resource.startSnackBar('Upload Failed!');
              } else {
                if (id == '1') {
                  this.subCatBanner = ref.url;
                } else {
                  this.CatBanner = ref.url;
                }
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
        } else if (type == 'peopleCstorebanner') {
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
        }
      }
    });
  }

  updatepeoplechoice() {
    let catindex = -1;
    let subcatindex = -1;
    if (this.actRoute.snapshot.params['catid'] != 'in_the_mix') {
      catindex = this.catarray.findIndex(
        (x: any) => x.Catid == this.actRoute.snapshot.params['catid']
      );

      subcatindex = this.catarray[catindex].subcatbanners.findIndex(
        (x: any) => x.Subcatid == this.SelectedSubCat
      );
    } else {
      catindex = this.catarray.findIndex(
        (x: any) => x.Catid == this.SelectedCat
      );
    }

    if (!this.editpeoplechoice) {
      this.editpeoplechoice = !this.editpeoplechoice;
    } else if (
      (this.actRoute.snapshot.params['catid'] == 'in_the_mix' &&
        catindex != -1 &&
        this.peoplechoicecatpara ==
          this.catarray[catindex].peoplechoicecatpara) ||
      (this.actRoute.snapshot.params['catid'] != 'in_the_mix' &&
        catindex != -1 &&
        subcatindex != -1 &&
        this.peoplechoicecatpara ==
          this.catarray[catindex].subcatbanners[subcatindex]
            .peoplechoicecatpara)
    ) {
      this.editpeoplechoice = !this.editpeoplechoice;
    } else {
      if (this.peoplechoicecatpara == '') {
        alert('please enter the People choice.');
      } else {
        if (
          catindex != -1 &&
          this.actRoute.snapshot.params['catid'] == 'in_the_mix'
        ) {
          this.catarray[catindex].peoplechoicecatpara =
            this.peoplechoicecatpara;
        } else {
          this.catarray.push({
            Catbanner: '',
            Catid: this.SelectedCat,
            peoplechoicecatpara: this.peoplechoicecatpara,
          });
        }

        if (
          catindex == -1 &&
          this.actRoute.snapshot.params['catid'] != 'in_the_mix'
        ) {
          this.catarray.push({
            Catbanner: '',
            Catid: this.actRoute.snapshot.params['catid'],
            subcatbanners: [
              {
                Subcatid: this.SelectedSubCat,
                peoplechoicecatpara: this.peoplechoicecatpara,
              },
            ],
          });
        } else if (
          catindex != -1 &&
          subcatindex == -1 &&
          this.actRoute.snapshot.params['catid'] != 'in_the_mix'
        ) {
          this.catarray[catindex].subcatbanners.push({
            Subcatid: this.SelectedSubCat,
            peoplechoicecatpara: this.peoplechoicecatpara,
          });
        } else if (
          catindex != -1 &&
          subcatindex != -1 &&
          this.actRoute.snapshot.params['catid'] != 'in_the_mix'
        ) {
          this.catarray[catindex].subcatbanners[
            subcatindex
          ].peoplechoicecatpara = this.peoplechoicecatpara;
        }
        this.api
          .updatePeoplechoicepara(this.DocId, this.catarray)
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
}
