import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Camera } from '@capacitor/camera';
import {
  CameraOptions,
  CameraResultType,
} from '@capacitor/camera/dist/esm/definitions';
import { url } from 'inspector';
import { AuthService } from 'src/app/auth.service';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';

import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

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
  makingChanges = true;

  constructor(
    public router: Router,
    private http: HttpClient,
    public auth: AuthService
  ) {}

  ngOnInit(): void {}

  onSelectFile(event: any) {
    const file = event.target.files && event.target.files[0];

    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this.fileName = file.name;

      const formData = new FormData();

      formData.append('thumbnail', file);

      const upload$ = this.http.post('/api/thumbnail-upload', formData);

      upload$.subscribe();
      if (file.type.indexOf('image') > -1) {
        this.format = 'image';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
      // const imageUrl = event.webPath || '';
      // if (imageUrl) {
      //   this.startCropper(imageUrl, event);
      //   console.log('image', imageUrl);
      // } else {
      //   console.log('No image');
      // }
      this.startCropper('banner', 'logo');
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
      if (!result.success) {
        if (result.info) {
          console.log(result.info);
          this.auth.resource.startSnackBar(result.info);
        }
      } else {
        if (type == 'banner') {
          this.auth
            .updateStoreBanner(this.storeID, result.croppedImage)
            .then((ref) => {
              if (!ref || !ref.success) {
                this.auth.resource.startSnackBar('Upload Failed!');
                this.makingChanges = false;
              } else {
                this.storeBanner = ref.url;
                this.auth.resource.startSnackBar('Banner Update Under Review!');
                this.makingChanges = false;
              }
            });
        }
      }
    });
  }
}
