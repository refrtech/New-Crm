import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addinfoslide',
  templateUrl: './addinfoslide.component.html',
  styleUrls: ['./addinfoslide.component.scss'],
})
export class AddinfoslideComponent implements OnInit {
  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }
  selectedFiles: any;

  fileName = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  url: any;
  format: any;

  onSelectFile(event: any) {
    const file = event.target.files && event.target.files[0];
    // this.selectedFiles = event.target.files[0];
    // console.log('abc', this.selectedFiles.name);

    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this.fileName = file.name;

      const formData = new FormData();

      formData.append('thumbnail', file);

      const upload$ = this.http.post('/api/thumbnail-upload', formData);

      upload$.subscribe();
      if (file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }
  }
}
