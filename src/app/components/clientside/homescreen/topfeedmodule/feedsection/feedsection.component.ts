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
    public api: ApiserviceService
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
      let upload$ = this.http.post(
        'http://localhost:3000/upload-video',
        formData
      );

      upload$.subscribe((res: any) => {
        this.videoPath = res;
        console.log('res', res),
          (err: any) => {
            console.log(err);
          };
      });

      if (file.type.indexOf('video') > -1) {
        this.format = 'video';
      } else if (file.type.indexOf('image') > -1) {
        this.format = 'image';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }
  }

  addVideo() {
    let datas = {
      created_at: this.api.newTimestamp,
      updated_at: this.api.newTimestamp,
      name: this.fileName,
      path: this.videoPath,
    };
    this.api.UploadVideo(datas).then((data) => {
      console.log('sucess', data);
    });
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
