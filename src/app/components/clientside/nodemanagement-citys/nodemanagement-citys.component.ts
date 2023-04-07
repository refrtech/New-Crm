import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-nodemanagement-citys',
  templateUrl: './nodemanagement-citys.component.html',
  styleUrls: ['./nodemanagement-citys.component.scss'],
})
export class NodemanagementCitysComponent implements OnInit {
  cityList$: Observable<any[]> = of();
  fileName: string = '';

  constructor(public api: ApiserviceService, public http: HttpClient) {}

  ngOnInit(): void {
    this.getallcity();
  }

  getallcity() {
    this.cityList$ = this.api.getcity();
  }

  cloudupload2(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this.fileName = file.name;

      const formData = new FormData();
      formData.append('file', file, file.name);

      const headers = new HttpHeaders();
      headers.append('Content-Type:multipart/form-data; boundary=------------------------1234567890', 'multipart/form-data');

      const url =
        'https://us-central1-refr-india.cloudfunctions.net/ind_serve/api/imagekit/upload';
      this.http.post(url, formData, {headers}).subscribe(
        (res) => {
          console.log('success');
          console.log(res);
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }
}
