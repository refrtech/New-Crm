import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Index } from 'firebase/firestore';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from 'src/app/auth.service';

import * as XLSX from 'xlsx';
import { TransactionDetailsComponent } from '../../transaction-details/transaction-details.component';
// type AOA = any[][];
@Component({
  selector: 'app-merchants-profile',
  templateUrl: './merchants-profile.component.html',
  styleUrls: ['./merchants-profile.component.scss'],
})
export class MerchantsProfileComponent implements OnInit {
  indexs: number = 0;
  catindex: number = 0;
  subcatindex: number = 0;
  listLoc: any[] = [];
  @ViewChild('MatTabGroupss') mattab?: MatTabGroup;
  @ViewChild('MatTaborders') mattaborders?: MatTabGroup;

  SubColumns: string[] = [
    'Sub_plan',
    'Sub_amt',
    'Refr_Count',
    'Status',
    'Created_Date',
    'Valid_Till',
    'action',
  ];

  CampColumns: string[] = [
    'Camp_name',
    'Camp_type',
    'Camp_min',
    'Camp_start',
    'Camp_end',
    'Direct_User',
    'New_User',
    'Existing_User',
    'Status',
  ];

  ProdColumns: string[] = [
    'Product',
    'MRP',
    'Discounted_price',
    'Qty',
    'action',
    'Request',
    'status',
  ];

  Ordercolumns: string[] = [
    'Sr_no',
    'orderDate',
    'StoreName',
    'Cust_Name',
    'journey',
    'Vendor_Amt',
    'Tax',
    'tcsTax',
    'Gatway',
    'Total',
    'ordStatus',
    'action',
  ];

  Campwalletecolumn: string[] = [
    'orderD',
    'Cust_name',
    'Cashbacktype',
    'Cashback',
    'OrderAmt',
    'CwBalance',
  ];

  Storewalletecolumn: string[] = [
    'Trans_id',
    'Trans_type',
    'Amt',
    'charges',
    'Tamount',
    'PaymentMode',
    'SwBalance',
  ];
  Selcategory: string = '';
  Selsubcategory: string = '';
  CampdataSource!: MatTableDataSource<any>;
  SubdataSource!: MatTableDataSource<any>;
  ProductdataSource!: MatTableDataSource<any>;
  orderdataSource!: MatTableDataSource<any>;
  CampwalleteTrandataSource!: MatTableDataSource<any>;
  StorewalleteTrandataSource!: MatTableDataSource<any>;
  CampaigndataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  storeID: string = '';
  storeuid: string = '';
  storeDetails: any;
  storeinfoDetails: any;
  productList: Array<any> = [];
  // catindex:number;
  constructor(
    private actRoute: ActivatedRoute,
    public apiservice: ApiserviceService,
    private dialog: MatDialog,
    public auth: AuthService,
    private https: HttpClient
  ) {
    this.execute();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.execute();
    }, 1000);
  }

  execute() {
    this.storeID = this.actRoute.snapshot.params['id'];
    if (this.storeID != undefined) {
      this.apiservice.getStoreByID(this.storeID).then((storeRef) => {
        const store: any = storeRef.exists() ? storeRef.data() : null;
        this.storeDetails = store;
        this.listLoc = store.loc;
        this.Selcategory = store.cat;
        this.catindex = this.auth.resource.categoryList.findIndex(
          (x: any) => x.id == store.cat
        );
        this.subcatindex = this.auth.resource.categoryList[
          this.catindex
        ].items.findIndex((x: any) => x.id == store.subCat);
        this.Selsubcategory =
          this.auth.resource.categoryList[this.catindex].items[
            this.subcatindex
          ].id;
        this.apiservice.getUserByUID(store.by).then((storeuser) => {
          const storeuserD: any = storeuser.exists() ? storeuser.data() : null;
          console.log(storeuserD);
          this.storeuid = storeuserD.uid;
          this.storeinfoDetails = storeuserD;
        });
      });
    }
    const Products = [
      {
        ProdImg_url: 'https://app.refr.club/assets/shreyansh/webp/14.webp',
        ProdTitle: 'Food & Beverages',
        ProdDesc:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
        ProdMRP: '100',
        ProdDPrice: '100',
        ProdQty: '100',
      },
      {
        ProdImg_url: 'https://app.refr.club/assets/shreyansh/webp/14.webp',
        ProdTitle: 'Food & Beverages',
        ProdDesc:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
        ProdMRP: '100',
        ProdDPrice: '100',
        ProdQty: '100',
      },
    ];
    this.ProductdataSource = new MatTableDataSource(Products);
    this.ProductdataSource.paginator = this.paginator;
    this.ProductdataSource.sort = this.sort;
  }

  tabchange() {
    if (this.mattab?.selectedIndex == 2) {
      this.getcampaign();
    } else if (this.mattab?.selectedIndex == 3) {
      this.getproducts();
    } else if (this.mattab?.selectedIndex == 4) {
      this.getorders();
    }
  }

  ordertypechange() {
    this.orderdataSource = new MatTableDataSource();
    if (this.mattaborders?.selectedIndex == 0) {
      this.apiservice
        .getRecentAddedOrder(
          100,
          false,
          'to',
          '==',
          this.storeuid,
          'journey',
          '==',
          'DIRECT'
        )
        .pipe(take(1))
        .subscribe((recentorders: any) => {
          this.orderdataSource = new MatTableDataSource(recentorders);
          this.orderdataSource.sort = this.sort;
        });
    } else if (this.mattaborders?.selectedIndex == 1) {
      this.apiservice
        .getRecentAddedOrder(
          100,
          false,
          'to',
          '==',
          this.storeuid,
          'journey',
          '==',
          'F2F'
        )
        .pipe(take(1))
        .subscribe((recentorders: any) => {
          this.orderdataSource = new MatTableDataSource(recentorders);
          this.orderdataSource.sort = this.sort;
        });
    } else if (this.mattaborders?.selectedIndex == 2) {
      this.apiservice
        .getRecentAddedOrder(
          100,
          false,
          'to',
          '==',
          this.storeuid,
          'journey',
          '==',
          'POS'
        )
        .pipe(take(1))
        .subscribe((recentorders: any) => {
          this.orderdataSource = new MatTableDataSource(recentorders);
          this.orderdataSource.sort = this.sort;
        });
    } else if (this.mattaborders?.selectedIndex == 3) {
      this.apiservice
        .getRecentAddedOrder(
          100,
          false,
          'to',
          '==',
          this.storeuid,
          'journey',
          '==',
          'BURN'
        )
        .pipe(take(1))
        .subscribe((recentorders: any) => {
          this.orderdataSource = new MatTableDataSource(recentorders);
          this.orderdataSource.sort = this.sort;
        });
    }
  }

  getproducts() {
    this.apiservice
      .getProductList(this.storeID)
      .pipe(take(1))
      .subscribe((products: any) => {
        this.ProductdataSource = new MatTableDataSource(products);
        this.ProductdataSource.sort = this.sort;
      });
  }

  getcampaign() {
    this.apiservice
      .getCampaignList(this.storeID)
      .pipe(take(1))
      .subscribe((Campaigns) => {
        this.CampaigndataSource = new MatTableDataSource(Campaigns);
        this.CampaigndataSource.sort = this.sort;
      });
  }

  getorders() {
    this.apiservice
      .getRecentAddedOrder(
        100,
        false,
        'to',
        '==',
        this.storeuid,
        'journey',
        '==',
        'DIRECT'
      )
      .pipe(take(1))
      .subscribe((recentorders: any) => {
        this.orderdataSource = new MatTableDataSource(recentorders);
        this.orderdataSource.sort = this.sort;
      });
  }

  campareDate(S_date: any, E_date: any) {
    return Date.parse(S_date) <= Date.now() && Date.parse(E_date) >= Date.now();
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      /* save data */
      let desc: Array<string> = [];
      let spec: Array<any> = [];
      const data = <any>XLSX.utils.sheet_to_json(ws, { header: 1 });
      for (let i = 1; i < data.length; i++) {
        desc = [];
        data[0].forEach((element: string, indexs: Index) => {
          element.indexOf('Description') >= 0
            ? data[i][+indexs] !== '-'
              ? desc.push(data[i][+indexs])
              : ''
            : '';
        });
        spec = [];
        data[0].forEach((element: string, indexs: Index) => {
          if (element.indexOf('Specification') >= 0) {
          }
          element.indexOf('Specification') >= 0
            ? data[i][+indexs] !== '-'
              ? spec.push({
                  [element.substring(
                    element.indexOf('(') + 1,
                    element.indexOf(')')
                  )]: data[i][+indexs],
                })
              : ''
            : '';
        });
        this.productList.push({
          ProductName: data[i][0],
          MRP: data[i][1],
          Price: data[i][2],
          Category: data[i][3],
          'HSN CODE': data[i][4],
          Description: desc,
          Specification: spec,
        });
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  openDialog(data: any) {
    this.dialog.open(TransactionDetailsComponent, {
      width: '90%',
      minWidth: '90%',
      maxWidth: '90%',
      maxHeight: '80%',
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'dialogLayout',
      data: { Orderdata: data, id: 1 },
    });
  }
}
