import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/auth.service';
import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { ApiserviceService } from 'src/app/apiservice.service';
import { Observable, of, take } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
@Component({
  selector: 'app-hgbcreatecategory',
  templateUrl: './hgbcreatecategory.component.html',
  styleUrls: ['./hgbcreatecategory.component.scss'],
})
export class HgbcreatecategoryComponent implements OnInit {
  storeBanner = '';
  homeGrownproducts$: Observable<any[]> = of();
  Searchtxt: string = '';
  isstorealreadyadded: boolean = false;

  HGdata: any;
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
    public auth: AuthService,
    public api: ApiserviceService,
    private https: HttpClient,
    public Location: Location
  ) {}

  ngOnInit(): void {
    console.log(this.auth.resource.categoryList);
    this.api
      .gethomegrowndata()
      .pipe(take(1))
      .subscribe((data: any) => {
        this.HGdata = data[0];
        this.storeBanner = data[0].HGbanner;
        this.homeGrownproducts$ = of(data[0].products);
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

  async takePicture(ratio: string, type: string, index?: number) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(ratio, imageUrl, type, index);
    }
  }

  async startCropper(
    ratio: string,
    webPath: string,
    type: string,
    index?: number
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
        if (type == 'logo') {
          this.api
            .updatehomegrownbanner(this.HGdata.SectionID, result.croppedImage)
            .then((data: any) => {
              this.storeBanner = data.url;
              this.auth.resource.startSnackBar('banner uploaded');
            });
        } else {
          this.api
            .updatehomegrownproductbanner(
              this.HGdata,
              result.croppedImage,
              index || 0
            )
            .then((data: any) => {
              this.storeBanner = data.url;
              this.auth.resource.startSnackBar('banner uploaded');
            });
        }
      }
    });
  }

  searchdata() {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Basic ' + btoa('elastic:bcFhFOqTCpvVJua+tnc-'),
    //   }),
    // };
    // let url =
    //   'https://app.refr.club/api/search/sendSearch/IN/things?q=' +
    //   this.Searchtxt +
    //   '';
    // this.https.get(url, httpOptions).subscribe((data: any) => {
    //   let products: any = [];
    //   for (let i = 0; i < data.hits.hits.length; i++) {
    //     products.push(data.hits.hits[i]._source);
    //   }
    //   this.MerchantdataSource = new MatTableDataSource(products);
    // });
  }

  action(item: any) {
    let index = -1;
    if (this.HGdata?.products != undefined) {
      index = this.HGdata?.products.findIndex((x: any) => x.id == item.id);
    }
    if (index == -1) {
      if (this.HGdata.products == undefined) {
        this.HGdata.products = [item];
      } else {
        this.HGdata.products.push(item);
      }
    } else {
      this.HGdata.products.splice(index, 1);
    }
    this.api.updateHomegrownproducts(this.HGdata.SectionID, this.HGdata.products);
  }

  back() {
    this.Location.back();
  }
}
