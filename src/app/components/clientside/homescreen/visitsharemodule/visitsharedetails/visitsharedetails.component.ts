import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { type } from 'os';
import { ApiserviceService } from 'src/app/apiservice.service';

@Component({
  selector: 'app-visitsharedetails',
  templateUrl: './visitsharedetails.component.html',
  styleUrls: ['./visitsharedetails.component.scss'],
})
export class VisitsharedetailsComponent implements OnInit {
  // parameters: string = '';
  // searchvalue: any;
  // valuetype: number = 2;
  // Valuearr: Array<any> = [];

  nodes!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  nodeColumns: string[] = ['node', 'no_stores', 'storename', 'date', 'action'];

  ParaArr: Array<any> = [
    {
      Title: 'Cities',
      titvalue: '',
    },
    {
      Title: 'Mumbai',
      titvalue: 'mumbai',
    },
    {
      Title: 'Kalyan',
      titvalue: 'kalyan',
    },
  ];

  node: Array<any> = [
    {
      Title: 'Cities',
      titvalue: '',
    },
    {
      Title: '1',
      titvalue: 'mumbai',
    },
    {
      Title: '2',
      titvalue: 'kalyan',
    },
  ];

  constructor(
    public as: ApiserviceService,
    public router: Router,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.execute();
    }, 1000);
  }

  allstores(store: any) {
    // visit share earn
    if (this.router.url == '/visitdetails') {
      this.router.navigate(['/storedetails/' + store]);
    }
    // Brands in your neighbourhood
    if (this.router.url == '/allstores/brandsallstore') {
      this.router.navigate(['/storedetails/' + store]);
    }
  }

  execute() {
    const users = [
      {
        node: '1',
        no_stores: '10',
        storedetail: [
          { storename: 'Akkad Bakkad Bombay Boom' },
          { storename: 'asdadsasd' },
          { storename: 'Dal tadka' },
          { storename: 'asdadsasd' },
          { storename: 'Dal tadka' },
          { storename: 'asdadsasd' },
          { storename: 'Dal tadka' },
          { storename: 'asdadsasd' },
        ],
        date: new Date(),
      },
    ];
    // this.nodes = new MatTableDataSource(this.as.nodeList);
    this.nodes = new MatTableDataSource(users);
    this.nodes.paginator = this.paginator;
    this.nodes.sort = this.sort;
    // this.auth.getStoreList(100).subscribe((users: any) => {
    //   console.log('List: ', users);
    //   this.dataSource = new MatTableDataSource(users);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
  }
}
