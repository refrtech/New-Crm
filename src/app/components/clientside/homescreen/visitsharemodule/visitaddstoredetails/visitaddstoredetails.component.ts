import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { AuthService } from 'src/app/auth.service';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';

@Component({
  selector: 'app-visitaddstoredetails',
  templateUrl: './visitaddstoredetails.component.html',
  styleUrls: ['./visitaddstoredetails.component.scss'],
})
export class VisitaddstoredetailsComponent implements OnInit {
  fileName = '';
  url: any;
  format: any;
  storeID = '8B9ozj7aTPvywkIvVWiK';
  storeType = '';
  storeLogo = '';
  storeBanner = '';
  storeBannersActive = '';
  storeBannersList: string[] = [];
  listLoc: any[] = [];
  makingChanges = true;
  imageLOADED: string[] = [];
  homeBanner = '';
  homeBannerActive = '';
  homeBannerList: string[] = [];
  constructor(public router: Router, public auth: AuthService) {}

  ngOnInit(): void {}

  async takePicture(ratio:string,type: string) {
    const image = await Camera.getPhoto({
      quality: 100,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    const imageUrl = image.webPath || '';
    if (imageUrl) {
      this.startCropper(ratio,imageUrl, type);
    }
  }

  startCropper(ratio:string,webPath: string, type: string) {
    let isPhone = this.auth.resource.getWidth < 768;
    let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
    const refDialog = this.auth.resource.dialog.open(CropperComponent, {
      width: w,
      minWidth: '320px',
      maxWidth: '480px',
      height: '360px',
      data: { webPath: webPath, type: type, ratio:ratio },
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
