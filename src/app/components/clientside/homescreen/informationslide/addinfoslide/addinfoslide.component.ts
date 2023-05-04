import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-addinfoslide',
  templateUrl: './addinfoslide.component.html',
  styleUrls: ['./addinfoslide.component.scss'],
})
export class AddinfoslideComponent implements OnInit {
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
  isInProcess: boolean = false;
  size = 1024 * 1024;
  size_limit: boolean = false;

  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }

  constructor(
    private http: HttpClient,
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<AddinfoslideComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public auth: AuthService
  ) {}

  ngOnInit(): void {}

  async onSelectFile(event: any) {
    const file = (await event.target.files) && event.target.files[0];
    console.log('size = ', file.size);
    console.log('size in MB', file.size / (1024 * 1024) + 'MB');

    if (file && file.size / (1024 * 1024) < 250) {
      this.isInProcess = true;
      console.log('filenaee', file);
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('file', file, this.fileName);

      const uploadUrl = 'http://34.100.197.18:5001/upload';
      this.http.post(uploadUrl, formData).subscribe(
        (response: any) => {
          this.isInProcess = false;
          console.log(response.url_link[0]);
          let data = {
            url: response.url_link[0],
            // c_Date: this.api.newTimestamp,
            fileName: this.fileName,
            fileType: file.type.toString().includes('video')
              ? 'video'
              : 'image',
          };

          console.log('dataaaaaa', this.data);
          if (this.data.infoVideos == undefined) {
            this.data.infoVideos = [data];
          } else {
            this.data.infoVideos.push(data);
          }
          this.api
            .UpdateVideo(this.data.id, this.data.infoVideos)
            .then(() => {
              this.dialogRef.close();
            });
        },
        (error) => {
          this.isInProcess = false;
          console.error('Error uploading video:', error);
        }
      );
    } else {
      alert('Please upload the size of file below 250mb');
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
