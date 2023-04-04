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
      formData.append('file', file, this.fileName);
      const uploadUrl = 'http://34.100.197.18:5001/upload';
      this.http.post(uploadUrl, formData).subscribe(
        (response: any) => {
          console.log(`Video uploaded to ${response.url_link}.`);
          let data = {
            url: response.url_link,
            c_Date: this.api.newTimestamp,
            fileName: this.fileName,
          };
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

  close() {
    this.dialogRef.close();
  }
}
