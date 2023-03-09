import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ExcelexportService } from 'src/app/excelexport.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  getall: boolean = false;
  showerror: boolean = false;
  parameters: string = "";
  operators: string = "";
  errormsg: string = "";
  searchvalue: any;
  inputtype: any;

  usercolumn: string[] = [
    'User_id',
    'User_name',
    'User_contact',
    'Refr_B',
    'Refr_R',
    'Store_linked',
    'action',
  ];

  ParaArr: Array<any> = [
    {
      Title: "All", titvalue: "",
    },
    {
      Title: "Customer Name", titvalue: "name",
    },
    {
      Title: "Mobile No ", titvalue: "phone",
    },
    {
      Title: "E-mail ID", titvalue: "email",
    },
    {
      Title: "Refr Cash Balance", titvalue: "acBalC",
    },
  ];

  OperatorArr: Array<any> = [
    {
      Title: "All", titvalue: "",
    },
    {
      Title: "Equal to", titvalue: "=="
    },
    {
      Title: "Less than", titvalue: "<"
    },
    {
      Title: "Greater than", titvalue: ">"
    },
    {
      Title: "Array contains", titvalue: "array-contains"
    }
  ]

  UserdataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private apiservice: ApiserviceService, private excelservice: ExcelexportService
  ) {
  }

  ngOnInit(): void {
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
    else if (this.searchvalue == "" || this.searchvalue == undefined) {
      this.showerror = true;
      this.errormsg = "Please Enter the value in input Box.";
    }
    else {
      if (this.parameters == "acBalC") {
        this.searchvalue = +this.searchvalue;
      }
      this.execute(this.parameters, this.operators, this.searchvalue);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.execute();
    }, 1000);
  }

  execute(para?: string, operator?: string, value?: any) {
    this.apiservice.getUserList(1000, this.getall, para, operator, value).pipe(take(1)).subscribe((recentusers: any) => {
      this.UserdataSource = new MatTableDataSource(recentusers);
      this.UserdataSource.sort = this.sort;
    });
  }

  exportexcel() {
    this.apiservice.getUserList(1000, this.getall, this.parameters, this.operators, this.searchvalue).pipe(take(1)).subscribe((recentusers: any) => {
      let userdataarr: Array<any> = [];
      for (let i = 0; i < recentusers.length; i++) {
        userdataarr.push({
          User_id: recentusers[i].uid,
          Name: recentusers[i].name,
          RegistrationDate: new Date(recentusers[i].sin.seconds * 1000).toDateString(),
          Mobile_NO: recentusers[i].phone,
          Email_id: recentusers[i].email,
          Refr_cash_balance: recentusers[i].acBalC,
          Refr_credits: recentusers[i].acBalGivenC,
          Is_store: (recentusers[i].storeCam == undefined || recentusers[i].storeCam.length == 0) ? false : true,
        })
      }
      this.excelservice.exportasexcelfile(userdataarr, "demo");
    });
  }
}
