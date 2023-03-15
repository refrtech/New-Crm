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

@Component({
  selector: 'app-hgbnodesubcatstores',
  templateUrl: './hgbnodesubcatstores.component.html',
  styleUrls: ['./hgbnodesubcatstores.component.scss'],
})
export class HgbnodesubcatstoresComponent implements OnInit {
  selectedcat: string = '';

  parameters: string = 'phone';
  parameters1: string = 'phone';
  parameters2: string = 'phone';


  operators: string = '==';
  operators1: string = '==';
  operators2: string = '==';


  searchvalue: string = '9833006431'; //9833006431
  searchvalue1: string = '9833006431'; //9833006431
  searchvalue2: string = '9833006431'; //9833006431


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

  constructor(
    private api: ApiserviceService,
    private actRoute: ActivatedRoute,
    private auth :AuthService
  ) {}

  ngOnInit(): void {
    this.selectedcat = this.actRoute.snapshot.params['catid'];
    this.api
      .gethomegrowPeoplechoicesubCatstores(
        this.actRoute.snapshot.params['catid']
      )
      .subscribe((data: any) => {
        this.PChoiceStores = data;
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
        console.log(this.PChoiceStores);
        console.log('Store has been added in People choice section.');
      });
    } else if(i == 2){
      Data.catId = this.actRoute.snapshot.params['catid'];
      Data.iscat_subCatstore = 'SubCat';
      Data.sectionName = 'HomegrownSection';
      this.api.addstoretoTrendingStore(Data).then((data: any) => {
        this.isstorealreadyadded1 = true;
        this.trendingStores.push(Data);
        console.log(this.trendingStores);
        console.log('Store has been added in trending section.');
      });
    }
    else {

    }
  }

  ApplyFilter(i: number) {
    this.isstorealreadyadded = false;
    this.isstorealreadyadded1 = false;
    this.api
      .getRecentStores(
        1,
        false,
        i == 1 ? this.parameters : (i == 2 ? this.parameters1 : this.parameters2),
        i == 1 ? this.operators : (i == 2 ? this.operators1 : this.operators2),
        i == 1 ? this.searchvalue : (i == 2 ? this.searchvalue1 : this.searchvalue2),
      )
      .pipe(take(1))
      .subscribe((recentStore: any) => {
        if (i == 1) {
          this.MerchantdataSource = new MatTableDataSource(recentStore);
          this.isstorealreadyadded =
            this.PChoiceStores.findIndex((x) => x.id == recentStore[0].id) < 0
              ? false
              : true;
        } else if( i == 2) {
          this.MerchantdataSource1 = new MatTableDataSource(recentStore);
          this.isstorealreadyadded =
            this.trendingStores.findIndex((x) => x.id == recentStore[0].id) < 0
              ? false
              : true;
        }
        else{
          this.MerchantdataSource = new MatTableDataSource(recentStore);
        }
      });
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
        }
      }
    });
  }

}
