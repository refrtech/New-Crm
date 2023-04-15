import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
//import {ImagekitService  } from 'imagekitio-angular';


@Component({
  selector: 'app-nodemanagement-citys',
  templateUrl: './nodemanagement-citys.component.html',
  styleUrls: ['./nodemanagement-citys.component.scss'],
})
export class NodemanagementCitysComponent implements OnInit {
  cityList$: Observable<any[]> = of();
  fileName: string = '';


  constructor(public api: ApiserviceService, public http: HttpClient) {
  }

  ngOnInit(): void {
    this.getallcity();
  }

  getallcity() {
    this.cityList$ = this.api.getcity();
  }

  cloudupload2(event: any) {
    console.log('Inside upload...')
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this.fileName = file.name;

      const formData = new FormData();
      formData.append('file', file, file.name);
      // const options = {
      //   headers: {
      //     Authorization: 'u8LLcJelqtJeixtvSTyJ9VYH82Q='
      //   }
      // };
      // this.http.post('https://ik.imagekit.io/refrclub01/', formData, options).subscribe(res=>{
      //     console.log('After file upload :'+res)
      // },error=>{
      //   console.log('Error :'+error.message)
      // });
    
      const headers = new HttpHeaders();
      headers.append('Content-Type:multipart/form-data; boundary=------------------------1234567890', 'multipart/form-data');

      const url =
        'http://localhost:5001/api/imagekit/upload';
      const prod_url = "https://app.refr.club/api/imagekit/upload"
      const proxy_url = 'http://34.100.197.18:5001/upload-image'
      this.http.post(prod_url, formData, {headers:headers}).subscribe(
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
