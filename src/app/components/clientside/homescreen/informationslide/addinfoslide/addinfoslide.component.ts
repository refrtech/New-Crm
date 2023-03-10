import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-addinfoslide',
  templateUrl: './addinfoslide.component.html',
  styleUrls: ['./addinfoslide.component.scss'],
})
export class AddinfoslideComponent implements OnInit {
  url: any;
  format: any;
  videoPath: any;
  showData: any;
  selectedFiles: any;
  fileName = '';
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
        (err: any) => {};
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
    this.auth.addInfoVideo(datas).then((d) => {
      console.log('d', d);
    });
    console.log('datas', datas);
    // this.dialogRef.close({ data: datas });
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
