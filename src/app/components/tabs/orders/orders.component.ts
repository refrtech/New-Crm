import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from 'src/app/auth.service';
import { ExcelexportService } from 'src/app/excelexport.service';
import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  getall: boolean = false;
  recentorderss: any;
  inputtype: any;
  showerror: boolean = false;
  parameters: string = '';
  operators: string = '';
  errormsg: string = '';
  searchvalue: any;
  valuetype: number = 2;
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

  orderdatasource!: MatTableDataSource<any>;
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
      titvalue: 'storeName',
    },
    {
      Title: 'Customer Name',
      titvalue: 'userName',
    },
    {
      Title: 'Customer Mobile No ',
      titvalue: 'logistics.phone',
    },
    {
      Title: 'Customer E-mail ID',
      titvalue: 'logistics.email',
    },
    {
      Title: 'Order Type',
      titvalue: 'ordrTYPE',
    },
    {
      Title: 'Journey Type',
      titvalue: 'journey',
    },
  ];

  Valuearr: Array<any> = [
    { Title: 'All', titvalue: '' },
    { Title: 'Online', titvalue: 'online' },
    { Title: 'Offline', titvalue: 'offline' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  excelarr: Array<any> = [];
  constructor(
    private apiservice: ApiserviceService,
    private excelservice: ExcelexportService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  onChange() {
    if (this.parameters == 'ordrTYPE') {
      this.searchvalue = '';
      this.valuetype = 1;
    } else {
      this.valuetype = 2;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.execute();
    }, 1000);
  }

  execute() {

    if (this.parameters == 'ordrTYPE') {
      if (this.searchvalue == 'online') {
        this.operators = "in";
        this.searchvalue = ["RefrCASH","RefrCASH+ONLINE","ONLINE"];
      }
      else if (this.searchvalue == 'offline') {
        this.operators = "==";
        this.searchvalue = "CASH";
      }
      else {
        alert("please select the option.");
        return;
      }
    }
    this.apiservice
      .getRecentAddedOrder(
        100,
        this.getall,
        this.parameters,
        this.operators,
        this.searchvalue
      )
      .pipe(take(1))
      .subscribe((recentorders: any) => {
        this.orderdatasource = new MatTableDataSource(recentorders);
        this.orderdatasource.sort = this.sort;
      });
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

  exportexcel() {
    if (this.parameters == 'ordrTYPE') {
      if (this.searchvalue == 'online') {
        this.operators = "in";
        this.searchvalue = ["RefrCASH","RefrCASH+ONLINE","ONLINE"];
      }
      else if (this.searchvalue == 'offline') {
        this.operators = "==";
        this.searchvalue = "CASH";
      }
      else {
        alert("please select the option.");
        return;
      }
    }
    this.apiservice
      .getRecentAddedOrder(
        100,
        this.getall,
        this.parameters,
        this.operators,
        this.searchvalue
      )
      .pipe(take(1))
      .subscribe((recentorders: any) => {
        this.recentorderss = '';
        this.recentorderss = recentorders;
        for (let i = 0; i < this.recentorderss.length; i++) {
          let orderstatus = '';
          let ordertype = '';
          if (this.recentorderss[i].journey == 'F2F') {
            if (this.recentorderss[i].cart.length > 0) {
              ordertype = 'F2F - Online';
            } else {
              ordertype = 'F2F - Offline';
            }
          } else {
            ordertype = this.recentorderss[i].journey;
          }
          if (
            this.recentorderss[i].journey == 'F2F' ||
            this.recentorderss[i].journey == 'DIRECT' ||
            this.recentorderss[i].journey == 'BURN' ||
            this.recentorderss[i].journey == 'POS'
          ) {
            if (
              this.recentorderss[i].cart.length > 0 &&
              ((this.recentorderss[i].ordrTYPE !== 'RefrCASH' &&
                this.recentorderss[i].status == 1) ||
                (this.recentorderss[i].ordrTYPE == 'RefrCASH' &&
                  this.recentorderss[i].status == 0))
            ) {
              orderstatus = 'Placed';
            }
            if (
              this.recentorderss[i].ordrTYPE == 'CASH' &&
              this.recentorderss[i].logistics.status == 0
            ) {
              if (this.recentorderss[i].status == 10) {
                orderstatus = 'Complete';
              } else if (this.recentorderss[i].status == 0) {
                orderstatus = 'POS In queue';
              } else if (this.recentorderss[i].status == -10) {
                orderstatus = 'Rejected';
              }
            } else if (
              this.recentorderss[i].status == 10 &&
              this.recentorderss[i].logistics.status == 20
            ) {
              orderstatus = 'Delivered';
            } else if (
              this.recentorderss[i].status == -10 &&
              this.recentorderss[i].logistics.status == -100
            ) {
              orderstatus = 'Returned';
            } else if (
              this.recentorderss[i].status == -10 &&
              this.recentorderss[i].logistics.status == -10
            ) {
              orderstatus = 'Rejected';
            } else if (
              this.recentorderss[i].status == -10 &&
              this.recentorderss[i].logistics.status == -1000
            ) {
              orderstatus = 'Refunded';
            }
          } else if (this.recentorderss[i].status == '4') {
            orderstatus = 'Refunded';
          } else if (this.recentorderss[i].status == '5') {
            orderstatus = 'Out for delivery';
          }
          this.excelarr.push({
            Order_date_time: new Date(
              this.recentorderss[i].sin.seconds * 1000
            ).toDateString(),
            Order_Id: this.recentorderss[i].id,
            Order_type: ordertype,
            Store_name: this.recentorderss[i].storeName,
            Cust_name: this.recentorderss[i].userName,
            Phone_No: this.recentorderss[i].logistics.phone,
            Mail_id: this.recentorderss[i].logistics.email,
            Refr_cashUse: this.recentorderss[i].invoice.amtRefrCash,
            PaymentMethod: this.recentorderss[i].ordrTYPE,
            Burst: this.recentorderss[i].amBurst,
            Tax: this.recentorderss[i].amTax,
            Save: this.recentorderss[i].amSave,
            TCS_tax: this.recentorderss[i].amTaxTCS,
            GateWay_charges: this.recentorderss[i].amGateway,
            Total: this.recentorderss[i].amTotal,
            Order_status: orderstatus,
            deliveryCharge: this.recentorderss[i].amParcel,
          });
        }
        this.excelservice.exportasexcelfile(this.excelarr, 'demo');
      });
  }
}
