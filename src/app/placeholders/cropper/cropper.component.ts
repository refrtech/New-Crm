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
    let type = this.data.type;
    this.imageUrl = this.data.webPath;
    console.log(this.imageUrl);
    if (type == 'logo') {
      this.aspectRatio = 1 / 1;
    }
    if (type == 'banner') {
      this.aspectRatio = 16 / 9;
    }
    if (type == 'banners') {
      this.aspectRatio = 16 / 9;
    }
  }

  fileChangeEvent(event: Event): void {
    console.log(event);
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
    console.log('imageLoaded');
  }
  cropperReady() {
    // cropper ready
    console.log('cropperReady');
    this.showCropper = true;
  }
  loadImageFailed() {
    // show message
    console.log('loadImageFailed');
    this.dialogRef.close({ success: false, info: 'Failed to load image.' });
  }
  loadCropFailed() {
    // show message
    console.log('loadCropFailed');
    this.dialogRef.close({ success: false, info: 'Cropper has been closed.' });
  }

  selectImage() {
    this.dialogRef.close({ success: true, croppedImage: this.croppedImage });
  }
}
