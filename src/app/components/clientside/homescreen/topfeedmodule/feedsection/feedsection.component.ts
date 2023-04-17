import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { log } from 'console';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from 'src/app/auth.service';
import { Camera } from '@capacitor/camera';
import { CameraResultType } from '@capacitor/camera/dist/esm/definitions';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';

@Component({
  selector: 'app-feedsection',
  templateUrl: './feedsection.component.html',
  styleUrls: ['./feedsection.component.scss'],
})
export class FeedsectionComponent implements OnInit {
  @ViewChild('imagePreview') imagePreview?: ElementRef;
  @ViewChild('videoPreview') videoPreview?: ElementRef;
  imageSrc: string = '';
  videoSrc: string = '';
  feedsection: string = '';
  uploadVideoarr: string = '';
  videoIndex?: number;
  videoPath: any;
  selectedFiles: any;
  fileName = '';
  url: any;
  format: any;

  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<FeedsectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiserviceService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {}

  private storageUrl = 'https://storage.googleapis.com'; // Set the storage URL
  private bucketName = 'refr'; // Set the name of the bucket
  private folderPath = 'FeedVideos/'; // Set the folder path

  async onSelectFile(event: any) {
    const file = (await event.target.files) && event.target.files[0];
    if (file) {
      console.log('filenaee', file);

      var reader = new FileReader();
      reader.readAsDataURL(file);
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('file', file, this.fileName);
      const uploadUrl = 'http://34.100.197.18:5001/upload';
      this.http.post(uploadUrl, formData).subscribe(
        (response: any) => {
          console.log(response.url_link[0]);
          let data = {
            url: response.url_link[0],
            c_Date: this.api.newTimestamp,
            fileName: this.fileName,
            fileType: file.type.toString().includes('video')
              ? 'video'
              : 'image',
          };
          console.log('dataaaaaa', data);

          this.auth.addVideo(data).then((d) => {
            this.dialogRef.close();
          });
        },
        (error) => {
          console.error('Error uploading video:', error);
        }
      );
    }
  }

  // async takePicture(ratio:string,type: string) {
  //   const image = await Camera.getPhoto({
  //     quality: 100,
  //     height: 300,
  //     width: 300,
  //     allowEditing: false,
  //     resultType: CameraResultType.Uri,
  //   });
  //   const imageUrl = image.webPath || '';
  //   if (imageUrl) {
  //     this.startCropper(ratio,imageUrl, type);
  //   }
  // }

  // startCropper(ratio:string,webPath: string, type: string) {
  //   let isPhone = this.auth.resource.getWidth < 768;
  //   let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
  //   const refDialog = this.auth.resource.dialog.open(CropperComponent, {
  //     width: w,
  //     minWidth: '320px',
  //     maxWidth: '480px',
  //     height: '360px',
  //     data: { webPath: webPath, type: type ,ratio:ratio },
  //     disableClose: true,
  //     panelClass: 'dialogLayout',
  //   });
  //   refDialog.afterClosed().subscribe((result) => {
  //     if (!result.success) {
  //       if (result.info) {
  //         this.auth.resource.startSnackBar(result.info);
  //       }
  //     } else {
  //       if (type == 'homeBanner') {
  //         this.api
  //           .updateNodeinternalBanner(this.id, result.croppedImage)
  //           .then((ref) => {
  //             if (!ref || !ref.success) {
  //               this.auth.resource.startSnackBar('Upload Failed!');
  //             } else {
  //               this.storeBanner = ref.url;
  //               this.auth.resource.startSnackBar('Banner Update Under Review!');
  //             }
  //           });
  //       }
  //     }
  //   });
  // }

  close() {
    this.dialogRef.close();
  }
}
