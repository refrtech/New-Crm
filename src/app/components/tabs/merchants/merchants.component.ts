import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ExcelexportService } from 'src/app/excelexport.service';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.scss'],
})
export class MerchantsComponent implements OnInit {
  getall: boolean = false;
  showerror: boolean = false;
  parameters: string = '';
  operators: string = '';
  errormsg: string = '';
  searchvalue: any;
  inputtype: any;
  excelarr: Array<any> = [];

  OperatorArr: Array<any> = [
    {
      Title: 'All',
      titvalue: '',
    },
    {
      Title: 'Equal to',
      titvalue: '==',
    },
    {
      Title: 'Array contains',
      titvalue: 'array-contains',
    },
  ];

  ParaArr: Array<any> = [
    {
      Title: 'All',
      titvalue: '',
    },
    {
      Title: 'Store Name',
      titvalue: 'name',
    },
    {
      Title: 'Mobile No ',
      titvalue: 'phone',
    },
    {
      Title: 'E-mail ID',
      titvalue: 'email',
    },
    {
      Title: 'Category',
      titvalue: 'cat',
    },
    {
      Title: 'Sub-Category',
      titvalue: 'subCat',
    },
    {
      Title: 'Store-Type',
      titvalue: 'type',
    },
  ];

  Valuearr: Array<any> = [];

  marchantColumns: string[] = [
    'MerchantId',
    'storename',
    'contact',
    'storetype',
    'city',
    'action',
  ];
  MerchantdataSource!: MatTableDataSource<any>;
  valuetype: number = 2;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    public api: ApiserviceService,
    private excelservice: ExcelexportService
  ) {}
  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.execute();
    }, 1000);
  }

  onChange() {
    if (
      this.parameters == 'cat' ||
      this.parameters == 'subCat' ||
      this.parameters == 'type'
    ) {
      this.searchvalue = '';
      this.valuetype = 1;
      if (this.parameters == 'cat') {
        this.Valuearr = [
          { Title: 'Food and Beverages', titvalue: 'food_and_beverages' },
          { Title: 'Fashion Brand', titvalue: 'fashion_brand' },
          { Title: 'Electronics', titvalue: 'electronics' },
          { Title: 'Healthcare', titvalue: 'healthcare' },
          { Title: 'Salons And Spa', titvalue: 'salons_and_spa' },
          { Title: 'Fitness', titvalue: 'fitness' },
          { Title: 'Beauty', titvalue: 'beauty' },
          { Title: 'Pet Care', titvalue: 'pet_care' },
        ];
      }
      if (this.parameters == 'subCat') {
        this.Valuearr = [
          {
            Title: 'Restaurants',
            titvalue: 'sc-food_and_beverages-restaurants',
          },
          { Title: 'Cafe', titvalue: 'sc-food_and_beverages-cafe' },
          {
            Title: 'Club and Bars',
            titvalue: 'sc-food_and_beverages-clubs_and_bars',
          },
        ];
      }
      if (this.parameters == 'type') {
        this.Valuearr = [
          { Title: 'Both', titvalue: 'Both' },
          { Title: 'Online', titvalue: 'Onli' },
          { Title: 'Offline', titvalue: 'Offl' },
        ];
      }
    } else {
      this.valuetype = 2;
    }
  }

  ApplyFilter() {
    this.showerror = false;
    if (this.parameters == '') {
      this.showerror = true;
      this.errormsg = 'Please select the parameter.';
    } else if (this.operators == '') {
      this.showerror = true;
      this.errormsg = 'Please select the operators.';
    } else if (this.searchvalue == '' || this.searchvalue == undefined) {
      this.showerror = true;
      this.errormsg = 'Please Enter the value in input Box.';
    } else {
      this.execute();
    }
  }

  execute() {
    this.api
      .getRecentStores(
        1000,
        this.getall,
        this.parameters,
        this.operators,
        this.searchvalue
      )
      .pipe(take(1))
      .subscribe((recentStore: any) => {
        this.MerchantdataSource = new MatTableDataSource(recentStore);
        this.MerchantdataSource.sort = this.sort;
      });
  }

  exportexcel() {
    this.api
      .getRecentStores(
        1000,
        this.getall,
        this.parameters,
        this.operators,
        this.searchvalue
      )
      .pipe(take(1))
      .subscribe((recentStore: any) => {
        for (let i = 0; i < recentStore.length; i++) {
          this.excelarr.push({
            Merchant_date_time: new Date(
              recentStore[i].sin.seconds * 1000
            ).toDateString(),
            Merchant_id: recentStore[i].id,
            Store_Name: recentStore[i].excelarr,
            Mobile_No: recentStore[i].phone,
            Email_id: recentStore[i].email,
            Category: recentStore[i].cat,
            Sub_Category: recentStore[i].subCat,
            Store_type: recentStore[i].type,
          });
        }
        this.excelservice.exportasexcelfile(this.excelarr, 'demo');
      });
  }
}
