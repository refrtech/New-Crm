import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-visitallstoredetails',
  templateUrl: './visitallstoredetails.component.html',
  styleUrls: ['./visitallstoredetails.component.scss'],
})
export class VisitallstoredetailsComponent implements OnInit {
  parameters: string = 'phone';
  operators: string = '==';
  searchvalue: string = '9876543210';
  isstorealreadyadded: boolean = false;
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
  id: number = 0;
  nodestores$: Observable<any[]> = of();
  storelist$: Observable<any[]> = of();

  constructor(
    public router: Router,
    public api: ApiserviceService,
    public auth: AuthService,
    public dialogRef: MatDialogRef<VisitallstoredetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    if (this.data.selectednode != undefined) {
      this.api
        .getstoreaspernode('VSAsection', this.data.selectednode.id)
        .subscribe((data: any) => {
          this.storelist$ = of(data);
        });
    }
  }

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
        this.MerchantdataSource = new MatTableDataSource(recentStore);
      });
  }

  action(data: any) {
    data.city_id = this.data.cityid;
    data.nodeid =
      this.data.selectednode == undefined
        ? this.data.node.id
        : this.data.selectednode.id;
    data.sectionname = 'VSAsection';
    this.api.addstorewithnodeid(data).then((data: any) => {
      this.isstorealreadyadded = true;
      this.auth.resource.startSnackBar('Store added');
    });
  }

  close() {
    this.dialogRef.close();
  }

  async takePicture(ratio: string, type: string, id: string, item: any) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(ratio, imageUrl, type, id, item);
    }
  }

  async startCropper(
    ratio: string,
    webPath: string,
    type: string,
    id: string,
    item: any
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
        if (type == 'banner') {
          this.api
            .updatestorewithnodebanner(id, result.croppedImage)
            .then((data: any) => {
              this.auth.resource.startSnackBar('Banner uploaded');
            });
        }
      }
    });
  }

  deletestore(id: string) {
    this.api.deletestorefromnodes(id).then((data: any) => {
      this.auth.resource.startSnackBar('store deleted');
    });
  }
}
