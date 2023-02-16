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
  constructor(
    public api: ApiserviceService,
  ) { }

  ngOnInit(): void {
    this.getallcity();
  }

  getallcity() {
    this.cityList$= this.api.getcity();
  }

}
