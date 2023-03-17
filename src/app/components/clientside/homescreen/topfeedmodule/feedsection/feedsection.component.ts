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

  private storageUrl = 'https://storage.googleapis.com'; // Set the storage URL
  private bucketName = 'refr'; // Set the name of the bucket
  private folderPath = 'FeedVideos/'; // Set the folder path

  async onSelectFile(event: any) {
    const file = (await event.target.files) && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('video', file,this.fileName);
      
      const uploadUrl = `${this.storageUrl}/${this.bucketName}/${this.folderPath}`; // Set the upload URL
  

      const uploadOptions = {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type header
        },
      };
  
      // Make the upload request using the HttpClient module
      this.http
        .post(uploadUrl, formData, uploadOptions)
        .subscribe((response) => {
          console.log(`Video uploaded to ${uploadUrl}${this.fileName}.`);
        }, (error) => {
          console.error('Error uploading video:', error);
        });
      // let upload$ = this.http.post(
      //   'https://us-central1-refr-india.cloudfunctions.net/ind_serve/api/video',
      //   formData
      // );

    //   upload$.subscribe((res: any) => {
    //     this.videoPath = res;
    //     (err: any) => {};
    //   });
    //   let a: string = await file.type.toString();
    //   this.format = a.substring(0, a.indexOf('/'));

    //   // if ( == 'video') {
    //   // } else if (file.type.indexOf('image') > -1) {
    //   //   this.format = 'image';
    //   // }
    //   reader.onload = (event) => {
    //     this.url = (<FileReader>event.target).result;
    //   };
    // }

    // -------
    const readerer = new FileReader();
    readerer.onloadend = async () => {
      const content = reader.result?.toString();
      const mimeType = content?.split(',')[0].split(':')[1].split(';')[0];
      if (mimeType === 'image/webp' || mimeType === 'image/png') {
        this.auth.addInfoVideo(event).then((d) => {});
      } else if (mimeType === 'video/mp4' || mimeType === 'video/mpeg') {
        this.auth.addInfoVideo(event).then((d) => {});
      }
    };
    readerer.readAsDataURL(file);
  }
  }

  addVideo() {
    let datas = {
      created_at: this.api.newTimestamp,
      updated_at: this.api.newTimestamp,
      name: this.fileName,
      path: this.videoPath,
    };
    this.auth.addVideo(datas).then((d) => {});
    this.dialogRef.close({ data: datas });
  }

  close() {
    this.dialogRef.close();
  }
 }
