import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feedsection',
  templateUrl: './feedsection.component.html',
  styleUrls: ['./feedsection.component.scss'],
})
export class FeedsectionComponent implements OnInit {
  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }
  selectedFiles: any;

  fileName = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  url: any;
  format: any;

  baseUrl: any = 'http://localhost:3000/upload-video';

  onSelectFile(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('video', file);

      this.http
        .post<any>('http://localhost:3000/upload-video', formData)
        .subscribe(
          (res) => console.log(res),
          (err: any) => {
            console.log(err);
          }
        );
      // const upload$ = this.http.post(this.baseUrl, formData);
      // upload$.subscribe();
      // if (file.type.indexOf('video') > -1) {
      //   this.format = 'video';
      // }
      // reader.onload = (event) => {
      //   this.url = (<FileReader>event.target).result;
      // };
    }
  }

  // onSelectFile(event: any){
  //   const formData = new FormData();
  //   formData.append('x', this.fileName)
  // }
}
