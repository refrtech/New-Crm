import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from 'src/app/auth.service';
// import { Storage } from '@google-cloud/storage';

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

  onSelectFile(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('video', file);
      // let upload$ = this.http.post(
      //   'http://localhost:3000/upload-video',
      //   formData
      // );

      // upload$.subscribe((res: any) => {
      //   this.videoPath = res;
      //   (err: any) => {};
      // });
      let a: string = file.type.toString();
      this.format = a.substring(0, a.indexOf('/'));

      // if ( == 'video') {
      // } else if (file.type.indexOf('image') > -1) {
      //   this.format = 'image';
      // }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }
  }

  // addVideo() {
  //   let datas = {
  //     created_at: this.api.newTimestamp,
  //     updated_at: this.api.newTimestamp,
  //     name: this.fileName,
  //     path: this.videoPath,
  //   };
  //   // this.auth.UploadVideo(datas).then((data) => {});
  //   this.dialogRef.close();
  // }

  close() {
    this.dialogRef.close();
  }

  uploadFile(res: any) {
    let datas = {
      created_at: this.api.newTimestamp,
      updated_at: this.api.newTimestamp,
      name: this.fileName,
      path: this.videoPath,
    };
    console.log('1');
    this.auth.cloudVideoUpload(res).then((data) => {
      console.log(data);
    });
    this.dialogRef.close();
  }
}
