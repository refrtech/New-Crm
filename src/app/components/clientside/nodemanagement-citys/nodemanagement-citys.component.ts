import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-nodemanagement-citys',
  templateUrl: './nodemanagement-citys.component.html',
  styleUrls: ['./nodemanagement-citys.component.scss']
})
export class NodemanagementCitysComponent implements OnInit {
  cityList$: Observable<any[]> = of();
  fileName:string = '';


  constructor(
    public api: ApiserviceService,
    public http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getallcity();
  }

  getallcity() {
    this.cityList$= this.api.getcity();
  }








  cloudupload2(event: any){
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this.fileName = file.name;

    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = 'https://api.imagekit.io/v1/files/upload';
    this.http
      .post(url, formData, {
        headers: {
          Authorization: 'private_u8LLcJelqtJeixtvSTyJ9VYH82Q=',
          'Content-Type': 'multipart/form-data',
        },
      })
      .subscribe(
        (res) => {
          console.log("success");
          console.log(res);
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }
}
