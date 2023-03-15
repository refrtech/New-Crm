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

@Component({
  selector: 'app-vsanodecatstores',
  templateUrl: './vsanodecatstores.component.html',
  styleUrls: ['./vsanodecatstores.component.scss'],
})
export class VSAnodecatstoresComponent implements OnInit {
  storeBanner = '';
  nodeId: string = '';

  parameters: string = 'phone';
  parameters1: string = 'phone';

  operators: string = '==';
  operators1: string = '==';

  searchvalue: string = '9833006431'; //9833006431
  searchvalue1: string = '9833006431'; //9833006431

  isstorealreadyadded: boolean = false;
  isstorealreadyadded1: boolean = false;

  MerchantdataSource!: MatTableDataSource<any>;
  MerchantdataSource1!: MatTableDataSource<any>;

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
  constructor(
    public auth: AuthService,
    private router: Router,
    private api: ApiserviceService,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.api
      .getnodeinterdata(this.actRoute.snapshot.params['nodeid'])
      .pipe(take(1))
      .subscribe((data: any) => {
        console.log(data);
        this.catarray =
          data[0].CategoryBanners != undefined ? data[0].CategoryBanners : [];
        console.log(this.catarray);

        let i = this.catarray.findIndex(
          (x: any) => x.Catid == this.actRoute.snapshot.params['catid']
        );
        if (i != -1) {
          this.storeBanner = this.catarray[i].Catbanner;
        }
      });

    this.api
      .getVSAPeoplechoiceCatstores(
        this.actRoute.snapshot.params['nodeid'],
        this.actRoute.snapshot.params['catid']
      )
      .subscribe((data: any) => {
        this.PChoiceStores = data;
      });

    this.api
      .getVSAtrendingCatstores(
        this.actRoute.snapshot.params['nodeid'],
        this.actRoute.snapshot.params['catid']
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
        i == 1 ? this.operators : this.operators1,
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
      Data.iscat_subCatstore = 'Cat';
      Data.sectionName = "VSAsection";
      this.api.addstoretoPeoplechoice(Data).then((data: any) => {
        this.isstorealreadyadded = true;
        this.PChoiceStores.push(Data);
        console.log(this.PChoiceStores);
        console.log('Store has been added in People choice section.');
      });
    } else {
      Data.Nodeid = this.actRoute.snapshot.params['nodeid'];
      Data.catId = this.actRoute.snapshot.params['catid'];
      Data.iscat_subCatstore = 'Cat';
      Data.sectionName = "VSAsection";

      this.api.addstoretoTrendingStore(Data).then((data: any) => {
        this.isstorealreadyadded1 = true;
        this.trendingStores.push(Data);
        console.log(this.trendingStores);
        console.log('Store has been added in trending section.');
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

  gotointernal() {
    this.router.navigateByUrl(
      '/VSAsubcatstores/' +
        this.actRoute.snapshot.params['internalid'] +
        '/' +
        this.actRoute.snapshot.params['nodeid'] +
        '/' +
        this.actRoute.snapshot.params['catid']
    );
  }

  deletestore(i: number, id: string) {
    console.log(i);
    console.log(id);
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

  async takePicture(type: string,id?:string) {
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

  startCropper(webPath: string, type: string,id?:string) {
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
        if (type == 'homeBanner') {
          this.api
            .updateNodecatinternalBanner(
              this.actRoute.snapshot.params['internalid'],
              result.croppedImage,
              this.catarray,
              this.actRoute.snapshot.params['catid']
            )
            .then((ref) => {
              if (!ref || !ref.success) {
                this.auth.resource.startSnackBar('Upload Failed!');
              } else {
                this.storeBanner = ref.url;
                this.auth.resource.startSnackBar('Banner Update Under Review!');
              }
            });
        }

        else if(type == 'trendingstorebanner'){
          this.api
          .updateTrendingstorebanner(
            id == undefined ? "" : id,
            result.croppedImage,
          )
          .then((ref) => {
            if (!ref || !ref.success) {
              this.auth.resource.startSnackBar('Upload Failed!');
            } else {
              // this.storeBanner = ref.url;
              this.auth.resource.startSnackBar('Banner Update Under Review!');
            }
          });
        }
        else if(type == "peopleCstorebanner"){
          this.api
          .updatePchoicestorebanner(
            id == undefined ? "" : id,
            result.croppedImage,
          )
          .then((ref) => {
            if (!ref || !ref.success) {
              this.auth.resource.startSnackBar('Upload Failed!');
            }
             else {
              this.auth.resource.startSnackBar('Banner Update Under Review!');
            }
          });
        }
      }
    });
  }
}
