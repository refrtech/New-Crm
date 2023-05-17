import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss'],
})
export class CropperComponent implements OnInit {
  showCropper = false;
  imageUrl: any = '';
  imageChangedEvent: any = '';
  croppedImage: any = '';
  aspectRatio = 1 / 1;

  constructor(
    public dialogRef: MatDialogRef<CropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    let ratio = this.data.ratio;
    this.imageUrl = this.data.webPath;
    if (ratio == '1:1') {
      this.aspectRatio = 1 / 1;
    }
    else if (ratio == '16:9') {
      this.aspectRatio = 16 / 9;
    }
    else if(ratio == '3:4'){
      this.aspectRatio = 3 / 4;
    }
    else if(ratio == '9:16'){
      this.aspectRatio = 9 / 16;
    }
    else if(ratio == '17:14'){
      this.aspectRatio = 17 / 14.35;
    }
    else if( ratio == '17:13'){
      this.aspectRatio = 17.2 / 13.1;
    }
    else if( ratio == '15:10'){
      this.aspectRatio = 15.4 / 10;
    }
    else {
      this.aspectRatio = 1 / 1;
    }

  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  cropperReady() {
    this.showCropper = true;
  }

  loadImageFailed() {
    this.dialogRef.close({ success: false, info: 'Failed to load image.' });
  }

  loadCropFailed() {
    this.dialogRef.close({ success: false, info: 'Cropper has been closed.' });
  }

  selectImage() {
    this.dialogRef.close({ success: true, croppedImage: this.croppedImage });
  }
}
