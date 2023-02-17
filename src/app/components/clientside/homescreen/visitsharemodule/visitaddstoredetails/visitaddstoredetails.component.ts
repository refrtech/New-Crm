import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { AuthService } from 'src/app/auth.service';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';

import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-visitaddstoredetails',
  templateUrl: './visitaddstoredetails.component.html',
  styleUrls: ['./visitaddstoredetails.component.scss'],
})
export class VisitaddstoredetailsComponent implements OnInit {
  fileName = '';
  url: any;
  format: any;

  storeID = '';
  storeType = '';
  storeLogo = '';
  storeBanner = '';
  storeBannersActive = '';
  storeBannersList: string[] = [];
  listLoc: any[] = [];
  makingChanges = true;
  imageLOADED: string[] = [];

  constructor(
    public router: Router,
    private http: HttpClient,
    public auth: AuthService,

    public api: ApiserviceService,
    private actRoute: ActivatedRoute
  ) {
    // this.execute();
  }

  ngOnInit(): void {}

  // onSelectFile(event: any) {
  //   const file = event.target.files && event.target.files[0];

  //   if (file) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     this.fileName = file.name;

  //     const formData = new FormData();

  //     formData.append('thumbnail', file);

  //     const upload$ = this.http.post('/api/thumbnail-upload', formData);

  //     upload$.subscribe();
  //     if (file.type.indexOf('image') > -1) {
  //       this.format = 'image';
  //     }
  //     reader.onload = (event) => {
  //       this.url = (<FileReader>event.target).result;
  //     };
  //     // const imageUrl = event.webPath || '';
  //     // if (imageUrl) {
  //     //   this.startCropper(imageUrl, event);
  //     //   console.log('image', imageUrl);
  //     // } else {
  //     //   console.log('No image');
  //     // }
  //     this.startCropper('banner', 'logo');
  //   }
  // }

  async takePicture(type: string) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      //source:CameraSource.Camera,
      resultType: CameraResultType.Uri,
    });

    console.log('image', image);
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(imageUrl, type);
      console.log('image', imageUrl);
    } else {
      console.log('No image');
    }
  }

  startCropper(webPath: string, type: string) {
    console.log('click');

    let isPhone = this.auth.resource.getWidth < 768;
    let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
    let h = isPhone ? this.auth.resource.getHeight + 'px' : '';
    const refDialog = this.auth.resource.dialog.open(CropperComponent, {
      width: w,
      minWidth: '320px',
      maxWidth: '480px',
      height: h,
      data: { webPath: webPath, type: type },
      disableClose: true,
      panelClass: 'dialogLayout', //, autoFocus:false
    });
    refDialog.afterClosed().subscribe((result) => {
      console.log('cropper closed');
      if (type == 'banner') {
        console.log(webPath, type, 'asdasd');
      }
    });
  }
}
