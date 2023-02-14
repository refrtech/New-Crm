import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ExcelexportService } from 'src/app/excelexport.service';


@Component({
  selector: 'app-redeemreq',
  templateUrl: './redeemreq.component.html',
  styleUrls: ['./redeemreq.component.scss']
})
export class RedeemreqComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  getall: boolean = false;
  showerror: boolean = false;
  parameters: string = "";
  operators: string = "";
  errormsg: string = "";
  searchvalue: any;
  valuetype: number = 2;
  Valuearr: Array<any> = [];
  excelarr: Array<any> = [];
  OperatorArr: Array<any> = [
    {
      Title: "All", titvalue: "",
    },
    {
      Title: "Equal to", titvalue: "=="
    },
    {
      Title: "Greater Than", titvalue: ">"
    },
    {
      Title: "Less Than", titvalue: "<"
    },
    {
      Title: "Array contains", titvalue: "array-contains"
    }
  ];
  ParaArr: Array<any> = [
    {
      Title: "All", titvalue: "",
    },
    {
      Title: "Customer Name", titvalue: "userName",
    },
    {
      Title: "Merchant Name", titvalue: "storeName",
    },
    {
      Title: "Order Type", titvalue: "journey",
    },
    {
      Title: "Order Status", titvalue: "status",
    },
    {
      Title: "Order Total", titvalue: "amTotal",
    }
  ];
  inputtype = "string";
  redeemColumns: string[] = [
    'Details',
    'Cust_Details',
    'Store_Details',
    'Sale_type',
    'Order_value',
    'r_status',
    'action',
  ];

  redeemreqdatasource!: MatTableDataSource<any>;
  constructor( private apiservice: ApiserviceService, private excelservice: ExcelexportService ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.execute();
    }, 1000);
  }

  execute() {
    if(this.inputtype == "number" && typeof(this.searchvalue) != "number" ){
      this.searchvalue = parseFloat(this.searchvalue);
    }
    this.apiservice.getRedemList(20, this.getall, this.parameters, this.operators, this.searchvalue).pipe(take(1)).subscribe((Redeemreq: any) => {
      this.redeemreqdatasource = new MatTableDataSource(Redeemreq);
      this.redeemreqdatasource.sort = this.sort;
    });
  }

  exportexcel() {
    this.apiservice.getRedemList(10, this.getall, this.parameters, this.operators, this.searchvalue).pipe(take(1)).subscribe((Redeemreq: any) => {
      for (let i = 0; i < Redeemreq.length; i++) {
        let orderstatus;
        if (Redeemreq[i].status == 10) {
          orderstatus = "Accepted";
        }
        else if (Redeemreq[i].status == 0) {
          orderstatus = "In Queue";
        }
        else {
          orderstatus = "Rejected";
        }
        this.excelarr.push({
          Order_date_time: new Date(Redeemreq[i].sin.seconds * 1000).toDateString(),
          Order_Id: Redeemreq[i].id,
          Order_type: Redeemreq[i].journey,
          Store_name: Redeemreq[i].storeName,
          Cust_name: Redeemreq[i].userName,
          Total: Redeemreq[i].amTotal,
          Order_status: orderstatus,
        });
      }
      this.excelservice.exportasexcelfile(this.excelarr, "demo");
    });
  }

  onChange() {
    if (this.parameters == 'journey' || this.parameters == 'status') {
      this.valuetype = 1;
      if (this.parameters == 'journey') {
        this.Valuearr = [{
          Title: "F2F", titvalue: "F2F"
        },
        {
          Title: "Direct", titvalue: "POS"
        }]
      }
      else {
        this.Valuearr = [
          { Title: "Accepted", titvalue: 10 },
          { Title: "IN Queue", titvalue: 0 },
          { Title: "Rejected", titvalue: -10 }
        ]
      }
    }
    else {
      if (this.parameters == 'amTotal') {
        this.inputtype = "number";
      }
      this.valuetype = 2;
    }
  }

  ApplyFilter() {
    this.showerror = false;
    if (this.parameters == "") {
      this.showerror = true;
      this.errormsg = "Please select the parameter."
    }
    else if (this.operators == "") {
      this.showerror = true;
      this.errormsg = "Please select the operators.";
    }
    else if ((this.searchvalue == "" || this.searchvalue == undefined) && this.searchvalue != 0) {
      this.showerror = true;
      this.errormsg = "Please Enter the value in input Box.";
    }
    else {
      this.execute();
    }
  }
}
