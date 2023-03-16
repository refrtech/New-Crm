import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResourceService } from './resource.service';

@Injectable({
  providedIn: 'root'
})
export class DependencyService {

  constructor(
    private httpClient: HttpClient,
    private resource: ResourceService
    ) { }

  getState(){
    return this.httpClient.get(`${environment.server}/api/refrBot/${ !environment.production ? "TEST" : "CRM" }`);
  }

  sendSMS(iso:string, phone:string, mes:string){
    const body = {
      phone, mes
    }
      return this.httpClient.post(`${environment.server}/api/SMS/sendSMS/${ iso }`, body);
  }

  sendSES(iso:string, email:string, mes:string){
    const body = {
      email, mes
    }
      return this.httpClient.post(`${environment.server}/api/SES/sendSES/${ iso }`, body);
  }

  sendSNS(iso:string, token:string, mes:string){
    const body = {
      token, mes
    }
      return this.httpClient.post(`${environment.server}/api/SNS/sendSNS/${ iso }`, body);
  }

  getLocationInfo(iso:string, lat:number, lon:number){
    const body = {
      lat, lon
    }
      return this.httpClient.post(`${environment.server}/api/locate/about/${ iso }`, body);
  }


}
