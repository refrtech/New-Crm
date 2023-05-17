import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  marchantColumns: string[] = [
    'MerchantId',
    'storename',
    'contact',
    'storetype',
    'city',
    'action',
  ];
  MerchantdataSource!: MatTableDataSource<any>;

  constructor(
    public api: ApiserviceService,
  ) { }

  ngOnInit(): void {
  }

}
