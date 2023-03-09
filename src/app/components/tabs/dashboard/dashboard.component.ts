import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  selected = 'option2';
  alldata: Array<any> = [];
  marchantColumns: string[] = [
    'MerchantId',
    'storename',
    'contact',
    'storetype',
    'Campwallet',
    'city',
    'status',
    'action',
  ];

  usercolumn: string[] = [
    'User_id',
    'User_name',
    'User_contact',
    'city',
    'level',
    'Refr_E',
    'Bus_share',
    'recc_used',
    'status',
    'action',
  ];

  Ordercolumns: string[] = [
    'orderDate',
    'StoreName',
    'Cust_Name',
    'journey',
    'Order_type',
    'Vendor_Amt',
    'Tax',
    'tcsTax',
    'Gatway',
    'Total',
    'ordStatus',
  ];

  redeemColumns: string[] = [
    'Details',
    'Cust_Details',
    'Store_Details',
    'Sale_type',
    'Order_value',
    'CashbackAmt',
    'city',
    'r_status',
    'action',
  ];

  usertrancolumn: string[] = [
    'tran_id',
    'contact',
    'store',
    'category',
    'bill',
    'transationtype',
    'paymentmode',
    'refrcash_E',
    'refrcash_P',
    'action',
  ];

  mertrancolumn: string[] = [
    'tran_id',
    'store_name',
    'contact',
    'store_type',
    'Category',
    'Amount',
    'trans_type',
    'action',
  ];
  MerchantdataSource!: MatTableDataSource<any>;
  UserdataSource!: MatTableDataSource<any>;
  orderdatasource!: MatTableDataSource<any>;
  redeemreqdatasource!: MatTableDataSource<any>;
  usertrandatasource!: MatTableDataSource<any>;
  mertrandatasource!: MatTableDataSource<any>;
  latestEntry: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiservice: ApiserviceService,
    public auth: AuthService
  ) {}
  ngAfterViewInit() {
    setTimeout(() => {
      this.execute();
    }, 1000);
  }
  ngOnInit() {
    this.auth.user$.pipe(take(1)).subscribe((user) => {
      const data = {
        //false, user.username,
        name: user.name || '',
        soIG: user.soIG,
        soYT: user.soYT,
        soTW: user.soTW,
        soWA: user.soWA,
        //user.info, user.url, user.typ, user.sex, user.stat, user.check,
        uid: user.uid,
        iso: user.iso || '',
        phoneNumFull: user.phone.split('+91')[1] || '',
      };
      // this.changeAbout(data)
    });
  }

  execute() {
    this.alldata = [
      {
        title: 'Users',
        imgurl: '',
        count: '8,784,705',
      },
      {
        title: 'Merchants',
        imgurl: '',
        count: '8,784,705',
      },
      {
        title: 'Orders',
        imgurl: '',
        count: '8,784,705',
      },
      {
        title: 'Campaigns',
        imgurl: '',
        count: '8,784,705',
      },
      {
        title: 'Total Campaign Wallet Fund',
        imgurl: '',
        count: '8,784,705',
      },
      {
        title: 'Total Store Wallet Fund',
        imgurl: '',
        count: '8,784,705',
      },
      {
        title: 'Total Rewards',
        imgurl: '',
        count: '8,784,705',
      },
      {
        title: 'Total Commission',
        imgurl: '',
        count: '8,784,705',
      },
    ];

    this.apiservice
      .getRecentStores(1, false)
      .pipe(take(1))
      .subscribe((recentStore: any) => {
        this.MerchantdataSource = new MatTableDataSource(recentStore);
        this.MerchantdataSource.sort = this.sort;
      });
  }
}
